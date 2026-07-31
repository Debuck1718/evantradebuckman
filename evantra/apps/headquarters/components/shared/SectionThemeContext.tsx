"use client";

import { createContext, useContext } from "react";

export type SectionTheme = "light" | "dark";

const SectionThemeContext = createContext<SectionTheme>("light");

export function SectionThemeProvider({
  theme,
  children,
}: {
  theme: SectionTheme;
  children: React.ReactNode;
}) {
  return (
    <SectionThemeContext.Provider value={theme}>
      {children}
    </SectionThemeContext.Provider>
  );
}

export function useSectionTheme() {
  return useContext(SectionThemeContext);
}