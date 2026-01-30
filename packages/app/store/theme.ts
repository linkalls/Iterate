import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

/**
 * Theme Atom
 * Persists theme preference in localStorage (web) or AsyncStorage (mobile)
 */
export const themeAtom = atomWithStorage<'light' | 'dark'>(
  'iterate-theme',
  'light'
)

/**
 * Toggle Theme Atom
 * Derived atom for toggling between light and dark themes
 */
export const toggleThemeAtom = atom(
  (get) => get(themeAtom),
  (get, set) => {
    const current = get(themeAtom)
    set(themeAtom, current === 'light' ? 'dark' : 'light')
  }
)
