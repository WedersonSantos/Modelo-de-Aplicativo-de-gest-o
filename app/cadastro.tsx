import { useState } from "react";
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/lib/auth-context";
import { LoadingOverlay } from "@/components/loading";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";

export default function CadastroScreen() {
  const router = useRouter();
  const { user, updateProfile } = useAuth();

  const [nomeCompleto, setNomeCompleto] = useState(user?.nome || "");
  const [dataNascimento, setDataNascimento] = useState("");
  const [valorTotal, setValorTotal] = useState("");
  const [numeroParcelas, setNumeroParcelas] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const valorParcela = valorTotal && numeroParcelas
    ? (parseFloat(valorTotal.replace(",", ".")) / parseInt(numeroParcelas)).toFixed(2)
    : "0.00";

  const formatarData = (text: string) => {
    const cleaned = text.replace(/\D/g, "");
    let formatted = "";
    if (cleaned.length > 0) {
      formatted = cleaned.substring(0, 2);
    }
    if (cleaned.length > 2) {
      formatted += "/" + cleaned.substring(2, 4);
    }
    if (cleaned.length > 4) {
      formatted += "/" + cleaned.substring(4, 8);
    }
    return formatted;
  };

  const formatarValor = (text: string) => {
    const cleaned = text.replace(/[^\d,]/g, "");
    return cleaned;
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!nomeCompleto.trim()) {
      newErrors.nomeCompleto = "Nome completo é obrigatório";
    } else if (nomeCompleto.trim().split(" ").length < 2) {
      newErrors.nomeCompleto = "Digite o nome completo";
    }

    if (!dataNascimento) {
      newErrors.dataNascimento = "Data de nascimento é obrigatória";
    } else if (dataNascimento.length !== 10) {
      newErrors.dataNascimento = "Data inválida (DD/MM/AAAA)";
    }

    if (!valorTotal) {
      newErrors.valorTotal = "Valor total é obrigatório";
    } else if (parseFloat(valorTotal.replace(",", ".")) <= 0) {
      newErrors.valorTotal = "Valor deve ser maior que zero";
    }

    if (!numeroParcelas) {
      newErrors.numeroParcelas = "Número de parcelas é obrigatório";
    } else if (parseInt(numeroParcelas) < 1 || parseInt(numeroParcelas) > 48) {
      newErrors.numeroParcelas = "Parcelas devem ser entre 1 e 48";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCadastro = async () => {
    if (!validate()) {
      if (Platform.OS !== "web") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
      return;
    }

    setIsLoading(true);
    try {
      if (Platform.OS !== "web") {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }

      // Converter data
      const [dia, mes, ano] = dataNascimento.split("/");
      const dataNasc = new Date(parseInt(ano), parseInt(mes) - 1, parseInt(dia));

      await updateProfile({
        nome: nomeCompleto.trim(),
        dataNascimento: dataNasc,
        valorTotal: parseFloat(valorTotal.replace(",", ".")),
        numeroParcelas: parseInt(numeroParcelas),
        parcelasPagas: 0,
        cadastroCompleto: true,
      });

      if (Platform.OS !== "web") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }

      Alert.alert(
        "Cadastro Concluído!",
        `Seu cadastro foi realizado com sucesso.\n\nValor Total: R$ ${parseFloat(valorTotal.replace(",", ".")).toFixed(2)}\nParcelas: ${numeroParcelas}x de R$ ${valorParcela}`,
        [{ text: "Continuar", onPress: () => router.replace("/(tabs)") }]
      );
    } catch (error: any) {
      if (Platform.OS !== "web") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
      Alert.alert("Erro", error.message || "Erro ao salvar cadastro");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="flex-1">
      <LoadingOverlay visible={isLoading} message="Salvando cadastro..." />

      {/* Background Gradient */}
      <LinearGradient
        colors={["#059669", "#047857", "#065F46"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0 }}
      />

      {/* Círculos decorativos */}
      <View
        style={{
          position: "absolute",
          top: -80,
          right: -80,
          width: 256,
          height: 256,
          borderRadius: 128,
          backgroundColor: "#fff",
          opacity: 0.1,
        }}
      />
      <View
        style={{
          position: "absolute",
          bottom: 80,
          left: -64,
          width: 128,
          height: 128,
          borderRadius: 64,
          backgroundColor: "#fff",
          opacity: 0.1,
        }}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-1 px-6 py-12">
            {/* Header */}
            <View style={{ marginTop: 40, marginBottom: 24 }}>
              <Text style={{ color: "#fff", fontSize: 28, fontWeight: "bold" }}>
                Complete seu Cadastro
              </Text>
              <Text style={{ color: "rgba(255,255,255,0.8)", fontSize: 16, marginTop: 8 }}>
                Preencha seus dados para continuar
              </Text>
            </View>

            {/* Formulário */}
            <View
              style={{
                backgroundColor: "#fff",
                borderRadius: 24,
                padding: 24,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.15,
                shadowRadius: 24,
                elevation: 12,
              }}
            >
              {/* Nome Completo */}
              <View style={{ marginBottom: 20 }}>
                <Text style={{ color: "#4B5563", fontSize: 14, fontWeight: "600", marginBottom: 8 }}>
                  Nome Completo *
                </Text>
                <View
                  style={{
                    borderRadius: 12,
                    borderWidth: 1.5,
                    borderColor: errors.nomeCompleto ? "#DC2626" : "#E5E7EB",
                    overflow: "hidden",
                  }}
                >
                  <TextInput
                    value={nomeCompleto}
                    onChangeText={(text) => {
                      setNomeCompleto(text);
                      setErrors({ ...errors, nomeCompleto: "" });
                    }}
                    placeholder="Digite seu nome completo"
                    placeholderTextColor="#9CA3AF"
                    autoCapitalize="words"
                    style={{
                      paddingHorizontal: 16,
                      paddingVertical: 14,
                      fontSize: 16,
                      color: "#1F2937",
                    }}
                  />
                </View>
                {errors.nomeCompleto && (
                  <Text style={{ color: "#DC2626", fontSize: 12, marginTop: 4 }}>
                    {errors.nomeCompleto}
                  </Text>
                )}
              </View>

              {/* Data de Nascimento */}
              <View style={{ marginBottom: 20 }}>
                <Text style={{ color: "#4B5563", fontSize: 14, fontWeight: "600", marginBottom: 8 }}>
                  Data de Nascimento *
                </Text>
                <View
                  style={{
                    borderRadius: 12,
                    borderWidth: 1.5,
                    borderColor: errors.dataNascimento ? "#DC2626" : "#E5E7EB",
                    overflow: "hidden",
                  }}
                >
                  <TextInput
                    value={dataNascimento}
                    onChangeText={(text) => {
                      setDataNascimento(formatarData(text));
                      setErrors({ ...errors, dataNascimento: "" });
                    }}
                    placeholder="DD/MM/AAAA"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="numeric"
                    maxLength={10}
                    style={{
                      paddingHorizontal: 16,
                      paddingVertical: 14,
                      fontSize: 16,
                      color: "#1F2937",
                    }}
                  />
                </View>
                {errors.dataNascimento && (
                  <Text style={{ color: "#DC2626", fontSize: 12, marginTop: 4 }}>
                    {errors.dataNascimento}
                  </Text>
                )}
              </View>

              {/* Valor Total */}
              <View style={{ marginBottom: 20 }}>
                <Text style={{ color: "#4B5563", fontSize: 14, fontWeight: "600", marginBottom: 8 }}>
                  Valor Total a Pagar *
                </Text>
                <View
                  style={{
                    borderRadius: 12,
                    borderWidth: 1.5,
                    borderColor: errors.valorTotal ? "#DC2626" : "#E5E7EB",
                    overflow: "hidden",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Text style={{ paddingLeft: 16, fontSize: 16, color: "#6B7280" }}>R$</Text>
                  <TextInput
                    value={valorTotal}
                    onChangeText={(text) => {
                      setValorTotal(formatarValor(text));
                      setErrors({ ...errors, valorTotal: "" });
                    }}
                    placeholder="0,00"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="decimal-pad"
                    style={{
                      flex: 1,
                      paddingHorizontal: 8,
                      paddingVertical: 14,
                      fontSize: 16,
                      color: "#1F2937",
                    }}
                  />
                </View>
                {errors.valorTotal && (
                  <Text style={{ color: "#DC2626", fontSize: 12, marginTop: 4 }}>
                    {errors.valorTotal}
                  </Text>
                )}
              </View>

              {/* Número de Parcelas */}
              <View style={{ marginBottom: 20 }}>
                <Text style={{ color: "#4B5563", fontSize: 14, fontWeight: "600", marginBottom: 8 }}>
                  Número de Parcelas *
                </Text>
                <View
                  style={{
                    borderRadius: 12,
                    borderWidth: 1.5,
                    borderColor: errors.numeroParcelas ? "#DC2626" : "#E5E7EB",
                    overflow: "hidden",
                  }}
                >
                  <TextInput
                    value={numeroParcelas}
                    onChangeText={(text) => {
                      setNumeroParcelas(text.replace(/\D/g, ""));
                      setErrors({ ...errors, numeroParcelas: "" });
                    }}
                    placeholder="Ex: 12"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="numeric"
                    maxLength={2}
                    style={{
                      paddingHorizontal: 16,
                      paddingVertical: 14,
                      fontSize: 16,
                      color: "#1F2937",
                    }}
                  />
                </View>
                {errors.numeroParcelas && (
                  <Text style={{ color: "#DC2626", fontSize: 12, marginTop: 4 }}>
                    {errors.numeroParcelas}
                  </Text>
                )}
              </View>

              {/* Resumo das Parcelas */}
              {valorTotal && numeroParcelas && (
                <View
                  style={{
                    backgroundColor: "#F0FDF4",
                    borderRadius: 12,
                    padding: 16,
                    marginBottom: 24,
                    borderWidth: 1,
                    borderColor: "#BBF7D0",
                  }}
                >
                  <Text style={{ color: "#166534", fontSize: 14, fontWeight: "600", marginBottom: 8 }}>
                    📋 Resumo do Plano
                  </Text>
                  <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 4 }}>
                    <Text style={{ color: "#166534", fontSize: 14 }}>Valor Total:</Text>
                    <Text style={{ color: "#166534", fontSize: 14, fontWeight: "600" }}>
                      R$ {parseFloat(valorTotal.replace(",", ".") || "0").toFixed(2)}
                    </Text>
                  </View>
                  <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 4 }}>
                    <Text style={{ color: "#166534", fontSize: 14 }}>Parcelas:</Text>
                    <Text style={{ color: "#166534", fontSize: 14, fontWeight: "600" }}>
                      {numeroParcelas}x
                    </Text>
                  </View>
                  <View
                    style={{
                      borderTopWidth: 1,
                      borderTopColor: "#BBF7D0",
                      paddingTop: 8,
                      marginTop: 8,
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text style={{ color: "#166534", fontSize: 16, fontWeight: "bold" }}>
                      Valor da Parcela:
                    </Text>
                    <Text style={{ color: "#059669", fontSize: 18, fontWeight: "bold" }}>
                      R$ {valorParcela}
                    </Text>
                  </View>
                </View>
              )}

              {/* Botão Cadastrar */}
              <TouchableOpacity
                onPress={handleCadastro}
                disabled={isLoading}
                activeOpacity={0.8}
                style={{ borderRadius: 12, overflow: "hidden" }}
              >
                <LinearGradient
                  colors={["#059669", "#047857"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{ paddingVertical: 16, alignItems: "center" }}
                >
                  <Text style={{ color: "#fff", fontSize: 18, fontWeight: "bold" }}>
                    {isLoading ? "Salvando..." : "Concluir Cadastro"}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>

            {/* Footer */}
            <Text
              style={{
                color: "rgba(255,255,255,0.5)",
                fontSize: 12,
                textAlign: "center",
                marginTop: 24,
              }}
            >
              © 2024 AACB Gestão de Associados
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
