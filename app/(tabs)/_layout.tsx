import { Tabs } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Platform } from "react-native";
import { useColors } from "@/hooks/use-colors";
import { useAuth } from "@/lib/auth-context";

export default function TabLayout() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { isAdmin } = useAuth();
  const bottomPadding = Platform.OS === "web" ? 12 : Math.max(insets.bottom, 8);
  const tabBarHeight = 56 + bottomPadding;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          paddingTop: 8,
          paddingBottom: bottomPadding,
          height: tabBarHeight,
          backgroundColor: colors.background,
          borderTopColor: colors.border,
          borderTopWidth: 0.5,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: "600",
        },
      }}
    >
      {/* Dashboard - Todos */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Início",
          tabBarIcon: ({ color }) => <IconSymbol size={24} name="house.fill" color={color} />,
        }}
      />

      {/* Associados - Apenas Admin */}
      <Tabs.Screen
        name="associados"
        options={{
          title: "Associados",
          tabBarIcon: ({ color }) => <IconSymbol size={24} name="person.2.fill" color={color} />,
          href: isAdmin ? "/associados" : null,
        }}
      />

      {/* Cobranças - Apenas Admin */}
      <Tabs.Screen
        name="cobrancas"
        options={{
          title: "Cobranças",
          tabBarIcon: ({ color }) => <IconSymbol size={24} name="doc.text.fill" color={color} />,
          href: isAdmin ? "/cobrancas" : null,
        }}
      />

      {/* Minhas Dívidas - Apenas Usuário */}
      <Tabs.Screen
        name="minhas-dividas"
        options={{
          title: "Minhas Dívidas",
          tabBarIcon: ({ color }) => <IconSymbol size={24} name="doc.text.fill" color={color} />,
          href: !isAdmin ? "/minhas-dividas" : null,
        }}
      />

      {/* Pagamentos - Apenas Admin */}
      <Tabs.Screen
        name="pagamentos"
        options={{
          title: "Pagamentos",
          tabBarIcon: ({ color }) => <IconSymbol size={24} name="creditcard.fill" color={color} />,
          href: isAdmin ? "/pagamentos" : null,
        }}
      />

      {/* Configurações - Todos */}
      <Tabs.Screen
        name="configuracoes"
        options={{
          title: "Conta",
          tabBarIcon: ({ color }) => <IconSymbol size={24} name="gearshape.fill" color={color} />,
        }}
      />
    </Tabs>
  );
}
