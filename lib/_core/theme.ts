import { Platform } from "react-native";
import themeConfig from "@/theme.config";

export type ColorScheme = "light" | "dark";

export const ThemeColors = themeConfig.themeColors;

type ThemeColorTokens = typeof ThemeColors;
type ThemeColorName = keyof ThemeColorTokens;
type SchemePalette = Record<ColorScheme, Record<ThemeColorName, string>>;
type SchemePaletteItem = SchemePalette[ColorScheme];

function buildSchemePalette(colors: ThemeColorTokens): SchemePalette {
  const palette: SchemePalette = {
    light: {} as SchemePalette["light"],
    dark: {} as SchemePalette["dark"],
  };

  (Object.keys(colors) as ThemeColorName[]).forEach((name) => {
    const swatch = colors[name];
    palette.light[name] = swatch.light;
    palette.dark[name] = swatch.dark;
  });

  return palette;
}

// DEFINIÇÃO DAS CORES AACB + DETAIL
// Sobrescrevemos os valores vindos do config para garantir a identidade visual
export const SchemeColors = {
  light: {
    primary: "#178348",    // Verde AACB
    background: "#F2F2F2", // Branco do site (Gelo)
    surface: "#FFFFFF",    // Branco puro para cards
    foreground: "#322D39", // Cinza escuro para textos
    muted: "#6B7280",      // Cinza para textos secundários
    border: "#D1D5DB", 
    success: "#178348", 
    warning: "#F59E0B", 
    error: "#EF4444", 
    detail: "#1b98E0",     // AZUL para detalhes
  },
  dark: {
    primary: "#178348", 
    background: "#121212", 
    surface: "#1E1E1E", 
    foreground: "#F2F2F2", 
    muted: "#9CA3AF", 
    border: "#374151", 
    success: "#178348", 
    warning: "#FBBF24", 
    error: "#f13131", 
    detail: "#1b98E0",     // AZUL para detalhes
  },
};

type RuntimePalette = SchemePaletteItem & {
  detail: string;          // Adicionado no tipo para evitar erro de compilação
  text: string;
  background: string;
  tint: string;
  icon: string;
  tabIconDefault: string;
  tabIconSelected: string;
  border: string;
};

function buildRuntimePalette(scheme: ColorScheme): RuntimePalette {
  const base = SchemeColors[scheme];
  return {
    ...base,
    detail: base.detail,   // Mapeamento da nova cor
    text: base.foreground,
    background: base.background,
    tint: base.primary,
    icon: base.muted,
    tabIconDefault: base.muted,
    tabIconSelected: base.primary,
    border: base.border,
  };
}

export const Colors = {
  light: buildRuntimePalette("light"),
  dark: buildRuntimePalette("dark"),
} satisfies Record<ColorScheme, RuntimePalette>;

export type ThemeColorPalette = (typeof Colors)[ColorScheme];

export const Fonts = Platform.select({
  ios: {
    sans: "system-ui",
    serif: "ui-serif",
    rounded: "ui-rounded",
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});