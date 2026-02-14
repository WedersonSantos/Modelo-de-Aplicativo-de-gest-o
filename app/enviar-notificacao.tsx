import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Platform,
  KeyboardAvoidingView,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { LoadingOverlay } from "@/components/loading";
import * as Haptics from "expo-haptics";

type PublicoAlvo = "todos" | "associados" | "admins";

export default function EnviarNotificacaoScreen() {
  const router = useRouter();
  const colors = useColors();

  const [isLoading, setIsLoading] = useState(false);
  const [titulo, setTitulo] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [urgencia, setUrgencia] = useState<"baixa" | "media" | "alta">("baixa");
  const [publico, setPublico] = useState<PublicoAlvo>("todos");

  const publicos = [
    { id: "todos", label: "Todos os Usuários", icon: "👥" },
    { id: "associados", label: "Apenas Associados", icon: "👤" },
    { id: "admins", label: "Apenas Administradores", icon: "🛡️" },
  ];

  const handleEnviar = async () => {
    if (!titulo.trim() || !mensagem.trim()) {
      Alert.alert("Campos obrigatórios", "Preencha o título e a mensagem.");
      return;
    }

    const alvo = publicos.find(p => p.id === publico)?.label;

    Alert.alert(
      "Confirmar Disparo",
      `Público: ${alvo}\n\nConfirma o envio desta notificação push?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Confirmar e Enviar",
          onPress: async () => {
            setIsLoading(true);
            setTimeout(() => {
              if (Platform.OS !== "web") Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              setIsLoading(false);
              Alert.alert("Sucesso", "Notificação enviada com sucesso!");
              router.back();
            }, 1500);
          },
        },
      ]
    );
  };

  return (
    <ScreenContainer>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1, backgroundColor: colors.background }}
      >
        <LoadingOverlay visible={isLoading} message="Disparando mensagens..." />

        <ScrollView contentContainerStyle={{ padding: 24 }} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Text style={{ fontSize: 24, color: colors.foreground }}>←</Text>
            </TouchableOpacity>
            <Text style={[styles.title, { color: colors.foreground }]}>Central de Avisos</Text>
          </View>

          {/* Seleção de Público Estilizada */}
          <Text style={[styles.label, { color: colors.muted }]}>Destinatários</Text>
          <View style={[styles.pickerContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            {publicos.map((item, index) => (
              <TouchableOpacity
                key={item.id}
                onPress={() => {
                  if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setPublico(item.id as PublicoAlvo);
                }}
                style={[
                  styles.pickerItem,
                  { borderBottomWidth: index === publicos.length - 1 ? 0 : 0.5, borderBottomColor: colors.border }
                ]}
              >
                <Text style={{ fontSize: 18, marginRight: 12 }}>{item.icon}</Text>
                <Text style={{ flex: 1, color: colors.foreground, fontSize: 15, fontWeight: publico === item.id ? "600" : "400" }}>
                  {item.label}
                </Text>
                <View style={[styles.radioOuter, { borderColor: publico === item.id ? "#059669" : colors.muted }]}>
                  {publico === item.id && <View style={styles.radioInner} />}
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Seletor de Urgência (Simplificado) */}
          <Text style={[styles.label, { color: colors.muted, marginTop: 24 }]}>Urgência do Alerta</Text>
          <View style={styles.urgenciaRow}>
            {(["baixa", "media", "alta"] as const).map((nivel) => (
              <TouchableOpacity
                key={nivel}
                onPress={() => setUrgencia(nivel)}
                style={[
                  styles.urgenciaChip,
                  { 
                    backgroundColor: urgencia === nivel ? (nivel === 'alta' ? '#EF4444' : nivel === 'media' ? '#F59E0B' : '#3B82F6') : colors.surface,
                    borderColor: urgencia === nivel ? 'transparent' : colors.border
                  }
                ]}
              >
                <Text style={{ color: urgencia === nivel ? '#fff' : colors.muted, fontSize: 12, fontWeight: 'bold', textTransform: 'capitalize' }}>
                  {nivel}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Mensagem */}
          <View style={{ marginTop: 32 }}>
            <TextInput
              style={[styles.input, { backgroundColor: colors.surface, color: colors.foreground, borderColor: colors.border }]}
              placeholder="Título do aviso"
              placeholderTextColor={colors.muted}
              value={titulo}
              onChangeText={setTitulo}
            />

            <TextInput
              style={[styles.input, styles.textArea, { backgroundColor: colors.surface, color: colors.foreground, borderColor: colors.border }]}
              placeholder="Escreva o conteúdo da notificação..."
              placeholderTextColor={colors.muted}
              multiline
              value={mensagem}
              onChangeText={setMensagem}
            />
          </View>

          <TouchableOpacity onPress={handleEnviar} activeOpacity={0.8} style={styles.sendButton}>
            <Text style={styles.sendButtonText}>Disparar para {publicos.find(p => p.id === publico)?.label}</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: "row", alignItems: "center", marginBottom: 32 },
  backButton: { width: 40, height: 40, justifyContent: "center" },
  title: { fontSize: 22, fontWeight: "bold", marginLeft: 8 },
  label: { fontSize: 11, fontWeight: "700", marginBottom: 12, textTransform: "uppercase", letterSpacing: 1 },
  pickerContainer: { borderRadius: 16, borderWidth: 1, overflow: "hidden" },
  pickerItem: { flexDirection: "row", alignItems: "center", padding: 16 },
  radioOuter: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, alignItems: "center", justifyContent: "center" },
  radioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: "#059669" },
  urgenciaRow: { flexDirection: "row", justifyContent: "space-between" },
  urgenciaChip: { flex: 1, paddingVertical: 8, alignItems: "center", borderRadius: 8, borderWidth: 1, marginHorizontal: 4 },
  input: { padding: 16, borderRadius: 16, fontSize: 16, borderWidth: 1, marginBottom: 16 },
  textArea: { height: 120, textAlignVertical: "top" },
  sendButton: { backgroundColor: "#059669", padding: 18, borderRadius: 16, alignItems: "center", marginTop: 20 },
  sendButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" }
});