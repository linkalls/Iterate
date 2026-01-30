/**
 * SQLite Database Adapter
 * Provides a unified interface for sql.js and bun:sqlite
 */

/**
 * Unified database statement interface
 */
export interface SQLiteStatement {
  step(): boolean
  getAsObject(): Record<string, any>
  free(): void
}

/**
 * Unified database interface
 */
export interface SQLiteDatabase {
  prepare(sql: string): SQLiteStatement
  close(): void
}

/**
 * SQLite adapter interface
 */
export interface SQLiteAdapter {
  openDatabase(data: Uint8Array): SQLiteDatabase
}

/**
 * Detect if running in Bun runtime
 */
export function isBunRuntime(): boolean {
  return typeof (globalThis as any).Bun !== 'undefined'
}

/**
 * sql.js adapter implementation
 */
export class SqlJsAdapter implements SQLiteAdapter {
  private SQL: any = null

  constructor(private sqlModule: any) {
    this.SQL = sqlModule
  }

  static async create(): Promise<SqlJsAdapter> {
    // Use dynamic import for sql.js
    const sqlJsModule = await import('sql.js')
    const initSqlJs = sqlJsModule.default
    const SQL = await initSqlJs({
      locateFile: (file: string) => `https://sql.js.org/dist/${file}`,
    })
    return new SqlJsAdapter(SQL)
  }

  openDatabase(data: Uint8Array): SQLiteDatabase {
    const db = new this.SQL.Database(data)
    
    return {
      prepare(sql: string): SQLiteStatement {
        const stmt = db.prepare(sql)
        return {
          step(): boolean {
            return stmt.step()
          },
          getAsObject(): Record<string, any> {
            return stmt.getAsObject()
          },
          free(): void {
            stmt.free()
          },
        }
      },
      close(): void {
        db.close()
      },
    }
  }
}

/**
 * Bun SQLite adapter implementation
 */
export class BunSqliteAdapter implements SQLiteAdapter {
  static async create(): Promise<BunSqliteAdapter> {
    return new BunSqliteAdapter()
  }

  openDatabase(data: Uint8Array): SQLiteDatabase {
    // bun:sqlite requires a file path, so we need to write to temp file
    const fs = require('fs')
    const path = require('path')
    const os = require('os')
    
    // Create a temporary file
    const tmpDir = os.tmpdir()
    const tmpFile = path.join(tmpDir, `anki-import-${Date.now()}.db`)
    fs.writeFileSync(tmpFile, data)
    
    // Import bun:sqlite dynamically
    const { Database } = require('bun:sqlite')
    const db = new Database(tmpFile)
    
    // Track temp file for cleanup
    let tempFilePath = tmpFile
    
    return {
      prepare(sql: string): SQLiteStatement {
        const stmt = db.prepare(sql)
        let rows: any[] = []
        let currentIndex = -1
        let initialized = false
        
        return {
          step(): boolean {
            if (!initialized) {
              // Fetch all rows on first step
              rows = stmt.all()
              initialized = true
              currentIndex = -1
            }
            
            currentIndex++
            return currentIndex < rows.length
          },
          getAsObject(): Record<string, any> {
            return rows[currentIndex] || {}
          },
          free(): void {
            // Bun SQLite statements don't need explicit freeing
            rows = []
            currentIndex = -1
            initialized = false
          },
        }
      },
      close(): void {
        db.close()
        // Clean up temporary file
        try {
          fs.unlinkSync(tempFilePath)
        } catch {
          // Ignore errors during cleanup
        }
      },
    }
  }
}

/**
 * Create appropriate SQLite adapter based on runtime
 */
export async function createSQLiteAdapter(): Promise<SQLiteAdapter> {
  if (isBunRuntime()) {
    return await BunSqliteAdapter.create()
  } else {
    return await SqlJsAdapter.create()
  }
}
