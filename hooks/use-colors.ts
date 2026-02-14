import { Colors, type ColorScheme, type ThemeColorPalette } from "@/constants/theme";
// Importamos o contexto que gerencia a troca de tema manual
import { useThemeContext } from "@/lib/theme-provider"; 

/**
 * Retorna a paleta de cores do tema atual, respeitando a escolha do usuário no app.
 * Uso: const colors = useColors(); então colors.primary, colors.detail, etc.
 */
export function useColors(colorSchemeOverride?: ColorScheme): ThemeColorPalette {
  // Pegamos o esquema de cores que está ATIVO no ThemeProvider
  const { colorScheme: activeScheme } = useThemeContext();
  
  // Prioridade: 1. Override manual | 2. Tema ativo no contexto | 3. Fallback light
  const scheme = (colorSchemeOverride ?? activeScheme ?? "light") as ColorScheme;
  
  return Colors[scheme];
}