import { useState } from "react";
import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  Switch,
  Alert,
  Platform,
  Modal,
} from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useAuth } from "@/lib/auth-context";
import { useColors } from "@/hooks/use-colors";
import { useThemeContext } from "@/lib/theme-provider";
import { LoadingOverlay } from "@/components/loading";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";

export default function ConfiguracoesScreen() {
  const router = useRouter();
  const colors = useColors();
  const { colorScheme, setColorScheme } = useThemeContext();
  const { user, logout, isAdmin, updateProfile } = useAuth();

  const [isLoading, setIsLoading] = useState(false);
  const [notificacoesAtivas, setNotificacoesAtivas] = useState(
    user?.notificacoesAtivas ?? true
  );

  const [idiomaModalVisible, setIdiomaModalVisible] = useState(false);
  const [idiomaSelecionado, setIdiomaSelecionado] = useState("Português (Brasil)");

  const handleLogout = () => {
    Alert.alert("Sair", "Tem certeza que deseja encerrar sua sessão?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Sair",
        style: "destructive",
        onPress: async () => {
          if (Platform.OS !== "web") {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
          }
          setIsLoading(true);
          try {
            await logout();
            router.replace("/login");
          } catch (error) {
            console.error("Erro fatal ao processar logout:", error);
            Alert.alert("Erro", "Falha ao desconectar. Tente novamente.");
          } finally {
            setIsLoading(false);
          }
        },
      },
    ]);
  };

  const handleToggleNotificacoes = async (value: boolean) => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setNotificacoesAtivas(value);
    try {
      await updateProfile({ notificacoesAtivas: value });
    } catch (error) {
      console.error("Erro ao atualizar notificações:", error);
      setNotificacoesAtivas(!value);
      Alert.alert("Erro", "Erro ao atualizar configurações");
    }
  };

  const handleMudarIdioma = (nome: string) => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setIdiomaSelecionado(nome);
    setIdiomaModalVisible(false);
    Alert.alert("Idioma", `Idioma alterado para ${nome}`);
  };

  const MenuItem = ({
    title,
    subtitle,
    onPress,
    icon,
    showArrow = true,
    danger = false,
  }: {
    title: string;
    subtitle?: string;
    onPress: () => void;
    icon: string;
    showArrow?: boolean;
    danger?: boolean;
  }) => (
    <TouchableOpacity
      onPress={() => {
        if (Platform.OS !== "web") {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        onPress();
      }}
      activeOpacity={0.7}
      style={{
        backgroundColor: colors.surface,
        borderRadius: 16,
        paddingHorizontal: 16,
        paddingVertical: 16,
        marginBottom: 12,
        flexDirection: "row",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 3,
      }}
    >
      <View
        style={{
          width: 44,
          height: 44,
          borderRadius: 22,
          alignItems: "center",
          justifyContent: "center",
          marginRight: 14,
          backgroundColor: danger ? "#FEE2E2" : colors.background,
        }}
      >
        <Text style={{ fontSize: 20 }}>{icon}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontSize: 16,
            fontWeight: "600",
            color: danger ? "#DC2626" : colors.foreground,
          }}
        >
          {title}
        </Text>
        {subtitle && (
          <Text style={{ fontSize: 13, color: colors.muted, marginTop: 2 }}>
            {subtitle}
          </Text>
        )}
      </View>
      {showArrow && <Text style={{ color: colors.muted, fontSize: 18 }}>→</Text>}
    </TouchableOpacity>
  );

  const ToggleItem = ({
    title,
    subtitle,
    value,
    onValueChange,
    icon,
  }: {
    title: string;
    subtitle?: string;
    value: boolean;
    onValueChange: (value: boolean) => void;
    icon: string;
  }) => (
    <View
      style={{
        backgroundColor: colors.surface,
        borderRadius: 16,
        paddingHorizontal: 16,
        paddingVertical: 16,
        marginBottom: 12,
        flexDirection: "row",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 3,
      }}
    >
      <View
        style={{
          width: 44,
          height: 44,
          borderRadius: 22,
          alignItems: "center",
          justifyContent: "center",
          marginRight: 14,
          backgroundColor: colors.background,
        }}
      >
        <Text style={{ fontSize: 20 }}>{icon}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 16, fontWeight: "600", color: colors.foreground }}>
          {title}
        </Text>
        {subtitle && (
          <Text style={{ fontSize: 13, color: colors.muted, marginTop: 2 }}>
            {subtitle}
          </Text>
        )}
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: colors.border, true: "#86EFAC" }}
        thumbColor={value ? "#059669" : "#9CA3AF"}
      />
    </View>
  );

  return (
    <ScreenContainer edges={["left", "right"]}>
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <LoadingOverlay visible={isLoading} message="Processando..." />

        {/* Modal de Idioma */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={idiomaModalVisible}
          onRequestClose={() => setIdiomaModalVisible(false)}
        >
          <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center', padding: 20 }}>
            <View style={{ 
              backgroundColor: colors.surface, 
              borderRadius: 24, 
              width: '100%', 
              padding: 24,
              borderWidth: colorScheme === 'dark' ? 1 : 0,
              borderColor: colors.border
            }}>
              <Text style={{ fontSize: 20, fontWeight: 'bold', color: colors.foreground, marginBottom: 20, textAlign: 'center' }}>Selecionar Idioma</Text>
              
              {[
                { id: 'pt', nome: 'Português (Brasil)', sigla: 'BR' },
                { id: 'en', nome: 'English (US)', sigla: 'US' },
                { id: 'es', nome: 'Español', sigla: 'ES' },
              ].map((item) => (
                <TouchableOpacity
                  key={item.id}
                  onPress={() => handleMudarIdioma(item.nome)}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingVertical: 16,
                    borderBottomWidth: 0.5,
                    borderBottomColor: colors.border,
                  }}
                >
                  <Text style={{ 
                    fontSize: 14, 
                    marginRight: 16, 
                    color: colors.muted, 
                    fontWeight: 'bold',
                    width: 30 
                  }}>
                    {item.sigla}
                  </Text>
                  
                  <Text style={{ 
                    fontSize: 16, 
                    color: colors.foreground, 
                    flex: 1, 
                    fontWeight: idiomaSelecionado === item.nome ? 'bold' : 'normal' 
                  }}>
                    {item.nome}
                  </Text>
                  {idiomaSelecionado === item.nome && <Text style={{ color: "#059669", fontSize: 18 }}>✓</Text>}
                </TouchableOpacity>
              ))}

              <TouchableOpacity
                onPress={() => setIdiomaModalVisible(false)}
                style={{ marginTop: 24, backgroundColor: colors.background, paddingVertical: 14, borderRadius: 12, alignItems: 'center', borderWidth: 1, borderColor: colors.border }}
              >
                <Text style={{ color: colors.foreground, fontWeight: '600' }}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
          <LinearGradient
            colors={["#059669", "#047857", "#065F46"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ paddingTop: 60, paddingBottom: 80, paddingHorizontal: 24 }}
          >
            <Text style={{ color: "#fff", fontSize: 28, fontWeight: "bold" }}>Configurações</Text>
            <Text style={{ color: "rgba(255,255,255,0.8)", fontSize: 14, marginTop: 4 }}>Gerencie sua conta e preferências</Text>
          </LinearGradient>

          {/* Card Perfil */}
          <View style={{ paddingHorizontal: 24, marginTop: -48 }}>
            <TouchableOpacity
              onPress={() => router.push("/perfil" as any)}
              activeOpacity={0.9}
              style={{
                backgroundColor: colors.surface,
                borderRadius: 20,
                padding: 20,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.12,
                shadowRadius: 12,
                elevation: 8,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: colors.background, alignItems: "center", justifyContent: "center", marginRight: 16 }}>
                <Text style={{ fontSize: 28, fontWeight: "bold", color: "#059669" }}>{user?.nome?.charAt(0).toUpperCase() || "U"}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 18, fontWeight: "bold", color: colors.foreground }}>{user?.nome || "Usuário"}</Text>
                <Text style={{ fontSize: 14, color: colors.muted, marginTop: 2 }}>{user?.email || ""}</Text>
                <View style={{ marginTop: 8, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, backgroundColor: isAdmin ? "#D1FAE5" : "#DBEAFE", alignSelf: "flex-start" }}>
                  <Text style={{ fontSize: 11, fontWeight: "600", color: isAdmin ? "#059669" : "#2563EB" }}>{isAdmin ? "👑 Administrador" : "👤 Associado"}</Text>
                </View>
              </View>
              <Text style={{ color: colors.muted, fontSize: 20 }}>→</Text>
            </TouchableOpacity>
          </View>

          {/* Seção Conta */}
          <View style={{ paddingHorizontal: 24, marginTop: 24 }}>
            <Text style={{ fontSize: 13, fontWeight: "600", color: colors.muted, marginBottom: 12, textTransform: "uppercase" }}>Conta</Text>
            <MenuItem title="Meu Perfil" icon="👤" onPress={() => router.push("/perfil" as any)} />
            <MenuItem title="Alterar Senha" icon="🔐" onPress={() => router.push("/perfil/alterar-senha" as any)} />
            <MenuItem title="Histórico de Atividades" icon="📋" onPress={() => router.push("/perfil/atividades" as any)} />
          </View>

          {/* Seção Preferências */}
          <View style={{ paddingHorizontal: 24, marginTop: 24 }}>
            <Text style={{ fontSize: 13, fontWeight: "600", color: colors.muted, marginBottom: 12, textTransform: "uppercase" }}>Preferências</Text>
            <ToggleItem title="Notificações" icon="🔔" value={notificacoesAtivas} onValueChange={handleToggleNotificacoes} />
            <ToggleItem
              title="Modo Escuro"
              icon={colorScheme === "dark" ? "🌙" : "☀️"}
              value={colorScheme === "dark"}
              onValueChange={(isDark) => {
                if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setColorScheme(isDark ? "dark" : "light");
              }}
            />
            <MenuItem title="Idioma" subtitle={idiomaSelecionado} icon="🌐" onPress={() => setIdiomaModalVisible(true)} />
          </View>

          {/* Seção Administração - ATUALIZADA */}
          {isAdmin && (
            <View style={{ paddingHorizontal: 24, marginTop: 24 }}>
              <Text style={{ fontSize: 13, fontWeight: "600", color: colors.muted, marginBottom: 12, textTransform: "uppercase" }}>Administração</Text>
              
              <MenuItem 
                title="Notificar Associados" 
                subtitle="Enviar aviso para todos os usuários"
                icon="📢" 
                onPress={() => router.push("/enviar-notificacao" as any)} 
              />
              
              <MenuItem 
                title="Relatórios" 
                subtitle="Dados analíticos da associação"
                icon="📊" 
                onPress={() => router.push("/adm/relatorios" as any)} 
              />
            </View>
          )}

          {/* Seção Suporte */}
          <View style={{ paddingHorizontal: 24, marginTop: 24 }}>
            <Text style={{ fontSize: 13, fontWeight: "600", color: colors.muted, marginBottom: 12, textTransform: "uppercase" }}>Suporte</Text>
            <MenuItem title="Central de Ajuda" icon="❓" onPress={() => Alert.alert("Em breve", "Central de ajuda em desenvolvimento")} />
            <MenuItem title="Fale Conosco" icon="💬" onPress={() => Alert.alert("Contato", "Email: suporte@aacb.com\nTelefone: (11) 99999-9999")} />
          </View>

          <View style={{ paddingHorizontal: 24, marginTop: 24 }}>
            <MenuItem title="Sair da Conta" icon="🚪" onPress={handleLogout} showArrow={false} danger />
          </View>

          <View style={{ paddingHorizontal: 24, marginTop: 32 }}>
            <Text style={{ fontSize: 12, color: colors.muted, textAlign: "center", lineHeight: 18 }}>© 2024 AACB Gestão de Associados{"\n"}Todos os direitos reservados</Text>
          </View>
        </ScrollView>
      </View>
    </ScreenContainer>
  );
}