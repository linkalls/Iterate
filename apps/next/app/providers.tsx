'use client'

import { TamaguiProvider } from 'tamagui'
import { Provider as JotaiProvider } from 'jotai'
import config from '../../../packages/ui/tamagui.config'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <JotaiProvider>
      <TamaguiProvider config={config} defaultTheme="light">
        {children}
      </TamaguiProvider>
    </JotaiProvider>
  )
}
