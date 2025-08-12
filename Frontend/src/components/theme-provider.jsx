// src/components/theme-provider.jsx

import { ThemeProvider as NextThemesProvider } from "next-themes"

// Komponen ini hanya bertugas meneruskan semua properti ke provider inti dari next-themes.
export function ThemeProvider({ children, ...props }) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}