# 📝 Iterate - アプリケーション要件定義書 (SRS) Ver.2

**Project Name:** Iterate (イテレート)  
**Description:** Expo/Next.js/Solito で構築する、最強のクロスプラットフォーム分散学習（SRS）アプリ。  
**Target User:** 自分 (High School Developer) & 学習ガチ勢  
**Last Updated:** 2024-01-30

---

## 1. システム構成 (Tech Stack)

爆速開発とパフォーマンスを両立する「モダン構成」なのだ。

| 領域 | 技術選定 | 理由 |
| :--- | :--- | :--- |
| **Monorepo** | **Solito** (Turborepo) | WebとAppのコードを90%共通化するため。 |
| **Package Manager** | **Bun** | インストールも実行も爆速にするため。 |
| **Web Framework** | **Next.js (App Router)** | SEOとパフォーマンス最強。Vercelで即デプロイ。 |
| **Mobile Framework** | **Expo (React Native)** | iOS/AndroidをTypeScriptだけで作るため。 |
| **UI Library** | **Tamagui** | Web/App両対応の高速UIキット。デザイン統一が楽。 |
| **Database (Driver)** | **Supabase (Default)** | 認証・DB・リアルタイム同期がこれ1つで完結。 |
| **SRS Logic** | **ts-fsrs** | Anki最新のFSRSアルゴリズムをTypeScriptで実装。 |
| **State Management** | **Jotai (ジョータイ)** | Atom（原子）単位で状態管理。パフォーマンスが良く、Reactと相性抜群。 |
| **Data Layer** | **Repository Pattern** | DBの実装とアプリのロジックを切り離す。Interfaceで依存性を注入。 |

---

## 2. 機能要件 (Functional Requirements)

### 2.1 学習コア機能 (The Brain 🧠)

ここがアプリの命なのだ。`ts-fsrs` をフル活用するん。

- **FSRSスケジューリング:**
  - カードに対し「Again(やり直し)」「Hard(難しい)」「Good(普通)」「Easy(簡単)」の4段階評価を行う。
  - 次回の復習日時を `ts-fsrs` で自動計算し、DBに保存する。
  
- **デッキ管理:**
  - ユーザーは複数の「デッキ（単語帳）」を作成できる（例: 「英単語」「古文単語」）。
  - デッキごとに「今日の学習予定数」を表示する。
  
- **学習セッション:**
  - 1枚ずつカードを表示 → 答えを表示 → 評価ボタンを押す → 次のカードへ。
  - 完了時に「今日の成果（枚数、正答率）」をリザルト画面で褒める（モチベ維持！）。

### 2.2 データ管理 (The Memory 💾)

- **クラウド同期 (Supabase):**
  - ログインすれば、PC(Web)で登録した単語を、電車の中(スマホ)で学習できる。
  
- **オフライン対応 (Future Work):**
  - ※まずはオンライン必須で作る（MVP）。将来的に `WatermelonDB` か `expo-sqlite` でオフライン対応する。

### 2.3 UI/UX (The Face 🎨)

- **ダークモード対応:** 夜の勉強でも目が痛くならないようにする。
- **Markdownサポート:** カードの裏面で太字やコードブロックを使えるようにする（プログラミング学習用）。
- **キーボードショートカット:** PC版では `Space` で答え表示、`1~4` で評価できるようにする（サクサク操作）。

---

## 3. アーキテクチャ設計 (The Core Logic 🧠)

ここが今回のキモなのだ。**「依存性の注入 (Dependency Injection)」** の考え方を使うん。

### 3.1 データ層の抽象化 (Repository Interface)

「何を保存するか」だけを決めて、「どう保存するか」は決めないインターフェースを作るのだ。

```typescript
// packages/app/domain/repository/CardRepository.ts

export interface CardRepository {
  getCard(id: string): Promise<Card | null>
  getCardsByDeck(deckId: string): Promise<Card[]>
  getDueCards(date: Date, deckId?: string): Promise<Card[]>
  saveCard(card: Card): Promise<void>
  deleteCard(id: string): Promise<void>
  getCardCount(deckId: string): Promise<number>
}
```

### 3.2 実装クラス (Implementation)

このクラスの中身だけを変えれば、将来SQLiteやFirebaseに移行してもアプリは壊れないのだ！

```typescript
// packages/app/infrastructure/supabase/SupabaseCardRepository.ts

export class SupabaseCardRepository implements CardRepository {
  async getCard(id: string) {
    const { data } = await supabase.from('cards').select('*').eq('id', id)
    return data ? data[0] : null
  }
  // ...他のメソッドも実装
}

// packages/app/infrastructure/mock/MockCardRepository.ts

export class MockCardRepository implements CardRepository {
  private cards: Map<string, Card> = new Map()
  
  async getCard(id: string) {
    return this.cards.get(id) || null
  }
  // ...開発用のシンプルな実装
}
```

### 3.3 状態管理 (Jotai Atoms)

Jotaiを使って、どこからでもリポジトリを使えるようにするん。

```typescript
// packages/app/store/atoms.ts

import { atom } from 'jotai'
import { MockCardRepository } from '../infrastructure/mock'

// ★ここで「今の実装」を選ぶ！
// 将来はここを `new SupabaseCardRepository()` に変えるだけでOKなのだ！
export const cardRepositoryAtom = atom<CardRepository>(
  new MockCardRepository()
)

// 非同期でカードを取得するAtom
export const dueCardsAtom = atom(async (get) => {
  const repo = get(cardRepositoryAtom)
  return await repo.getDueCards(new Date())
})
```

---

## 4. ディレクトリ構成 (Monorepo Structure)

「クリーンアーキテクチャ」っぽく整理したのだ。

```
iterate/
├── apps/
│   ├── expo/          # スマホアプリ (iOS/Android) のエントリーポイント
│   └── next/          # Webアプリ (Next.js) のエントリーポイント
│
├── packages/
│   ├── app/           # ★メインのコードは全部ここ！
│   │   ├── domain/            # アプリのルール（フレームワークに依存しない）
│   │   │   ├── model/         # データ型 (Card, Deck, ReviewLog)
│   │   │   └── repository/    # インターフェース定義
│   │   │
│   │   ├── infrastructure/    # 外部サービスの実装詳細
│   │   │   ├── supabase/      # Supabaseの実装
│   │   │   ├── sqlite/        # (将来) オフラインDBの実装
│   │   │   └── mock/          # テスト用のニセモノ実装
│   │   │
│   │   ├── store/             # Jotai (状態管理)
│   │   │   ├── atoms.ts       # グローバルな状態とDIコンテナ
│   │   │   └── hooks.ts       # 使いやすくするカスタムフック
│   │   │
│   │   └── features/          # 画面UI (Tamagui)
│   │       ├── study/         # 学習画面
│   │       └── deck/          # デッキ一覧
│   │
│   ├── ui/            # ボタンやカードなどの共通パーツ (Tamagui)
│   └── db/            # Supabaseやts-fsrsのロジック置き場
│
└── docs/              # ドキュメント
    └── SPECIFICATION.md  # この仕様書
```

---

## 5. データモデル (Database Schema)

### 5.1 Card (カード)

| フィールド | 型 | 説明 |
|-----------|------|------|
| id | string | 一意識別子 |
| deckId | string | 所属するデッキのID |
| front | string | カードの表面（質問） |
| back | string | カードの裏面（答え） |
| created | Date | 作成日時 |
| modified | Date | 更新日時 |
| due | Date | 次回復習予定日時 |
| stability | number | FSRS: 安定性パラメータ |
| difficulty | number | FSRS: 難易度パラメータ |
| elapsed_days | number | FSRS: 経過日数 |
| scheduled_days | number | FSRS: スケジュール日数 |
| reps | number | 復習回数 |
| lapses | number | 忘却回数 |
| state | CardState | カードの状態 (New/Learning/Review/Relearning) |
| last_review | Date? | 最終復習日時 |

### 5.2 Deck (デッキ)

| フィールド | 型 | 説明 |
|-----------|------|------|
| id | string | 一意識別子 |
| name | string | デッキ名 |
| description | string? | 説明 |
| created | Date | 作成日時 |
| modified | Date | 更新日時 |

### 5.3 ReviewLog (復習ログ)

| フィールド | 型 | 説明 |
|-----------|------|------|
| id | string | 一意識別子 |
| cardId | string | カードID |
| rating | Rating | 評価 (Again/Hard/Good/Easy) |
| state | CardState | 復習時の状態 |
| due | Date | 次回予定 |
| stability | number | 復習時の安定性 |
| difficulty | number | 復習時の難易度 |
| elapsed_days | number | 経過日数 |
| scheduled_days | number | スケジュール日数 |
| review | Date | 復習実施日時 |

---

## 6. 開発ロードマップ (MVPへの道) 🛣️

まずは「最低限動くもの (MVP)」を目指すのだ！

### Phase 1: 環境構築とアーキテクチャ ✅ 完了
- [x] プロジェクト構造の作成
- [x] ドメインモデルの定義
- [x] リポジトリインターフェースの定義
- [x] Mockリポジトリの実装
- [x] Jotai状態管理のセットアップ

### Phase 2: UI作成 (次のステップ)
- [ ] Tamaguiのセットアップ
- [ ] カード表示コンポーネント
- [ ] デッキ一覧画面
- [ ] 学習セッション画面

### Phase 3: ロジック実装
- [ ] ts-fsrsの組み込み
- [ ] 評価ボタンの実装
- [ ] 次回復習日の計算と保存

### Phase 4: DB連携
- [ ] Supabaseプロジェクトの作成
- [ ] DBスキーマの作成
- [ ] SupabaseCardRepositoryの完成
- [ ] 認証機能の実装

### Phase 5: リリース
- [ ] Vercel (Web) デプロイ
- [ ] EAS Build (App) ビルド
- [ ] ストア公開準備

---

## 7. 開発の進め方 (Development Strategy)

この設計なら、**「まずはDBなし（Mock）」** で開発を始められるのが最強のメリットなのだ！

1. **Interface定義:** Repository interfaceを書く ✅
2. **Mock作成:** データ配列を返すだけの `MockRepository` を作る ✅
3. **UI実装:** Mockを使って、画面の動きを全部作っちゃう
4. **本番実装:** 最後に `SupabaseRepository` を作って差し替える

これなら、Supabaseの設定にハマってもUI開発は止まらないん。完璧なのだ！🦊👍

---

## 8. 実装例 (Usage Examples)

### 8.1 リポジトリの使い方

```typescript
// コンポーネント内で使う
import { useCardRepository, useDueCards } from 'app/store'

function StudyScreen() {
  const dueCards = useDueCards() // 今日の復習カードを取得
  
  return (
    <div>
      <h1>Today's Review: {dueCards.length} cards</h1>
      {/* ... */}
    </div>
  )
}
```

### 8.2 実装の切り替え

```typescript
// packages/app/store/atoms.ts

// 開発中 (Mock)
import { MockCardRepository } from '../infrastructure/mock'
export const cardRepositoryAtom = atom(new MockCardRepository())

// 本番 (Supabase)
import { SupabaseCardRepository } from '../infrastructure/supabase'
export const cardRepositoryAtom = atom(new SupabaseCardRepository())
```

---

## 9. まとめ

この設計書に従えば、以下が実現できるのだ：

✅ **柔軟性:** DBを簡単に切り替えられる  
✅ **開発速度:** Mockで即座に開発開始できる  
✅ **保守性:** 責任が明確に分離されている  
✅ **テスト容易性:** Mock実装でテストが簡単  
✅ **パフォーマンス:** Jotaiの原子的更新で最適化  
✅ **型安全:** TypeScriptでバグを事前に防ぐ  

これが「Iterate」の完璧な設計図なのだ！🦊✨

どうなん？この「インターフェースで受ける」設計、エンジニアとしてレベル高いと思うのだ！👍
