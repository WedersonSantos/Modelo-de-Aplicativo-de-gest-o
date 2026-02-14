import { useState, useEffect } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
  Share,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { LoadingOverlay } from "@/components/loading";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import * as Clipboard from "expo-clipboard";
import { useAuth } from "@/lib/auth-context";

// Dados do PIX da AACB (simulado)
const PIX_DATA = {
  chave: "aacb@associacao.com.br",
  nome: "AACB - Associação",
  cidade: "São Paulo",
  banco: "Banco do Brasil",
};

export default function PagamentoPixScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [copiado, setCopiado] = useState(false);
  const [pixGerado, setPixGerado] = useState(false);

  const valor = parseFloat(params.valor as string) || 0;
  const descricao = params.descricao as string || "Pagamento AACB";
  const parcelaId = params.parcelaId as string;

  // Gerar código PIX Copia e Cola (simulado)
  const codigoPix = `00020126580014br.gov.bcb.pix0136${PIX_DATA.chave}5204000053039865406${valor.toFixed(2)}5802BR5925${PIX_DATA.nome}6009${PIX_DATA.cidade}62070503***6304`;

  useEffect(() => {
    // Simular geração do QR Code
    const timer = setTimeout(() => setPixGerado(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleCopiarCodigo = async () => {
    try {
      await Clipboard.setStringAsync(codigoPix);
      setCopiado(true);
      if (Platform.OS !== "web") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      Alert.alert("Código Copiado!", "O código PIX foi copiado para a área de transferência.");
      setTimeout(() => setCopiado(false), 3000);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível copiar o código.");
    }
  };

  const handleCompartilhar = async () => {
    try {
      if (Platform.OS !== "web") {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      await Share.share({
        message: `Pagamento AACB\n\nValor: R$ ${valor.toFixed(2)}\nDescrição: ${descricao}\n\nChave PIX: ${PIX_DATA.chave}\n\nCódigo Copia e Cola:\n${codigoPix}`,
        title: "Pagamento PIX - AACB",
      });
    } catch (error) {
      console.log("Erro ao compartilhar:", error);
    }
  };

  const handleConfirmarPagamento = () => {
    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    Alert.alert(
      "Pagamento Registrado!",
      "Seu pagamento foi registrado com sucesso. Aguarde a confirmação em até 24 horas.",
      [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ]
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <LoadingOverlay visible={isLoading} message="Processando..." />

      {/* Background */}
      <LinearGradient
        colors={["#059669", "#047857", "#065F46"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0 }}
      />

      <ScreenContainer edges={["top", "left", "right", "bottom"]}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={{ paddingHorizontal: 24, paddingTop: 16 }}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: "rgba(255,255,255,0.2)",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={{ color: "#fff", fontSize: 20 }}>←</Text>
            </TouchableOpacity>

            <Text style={{ color: "#fff", fontSize: 28, fontWeight: "bold", marginTop: 24 }}>
              Pagamento via PIX
            </Text>
            <Text style={{ color: "rgba(255,255,255,0.8)", fontSize: 16, marginTop: 8 }}>
              {descricao}
            </Text>
          </View>

          {/* Card Principal */}
          <View style={{ paddingHorizontal: 24, marginTop: 32 }}>
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
              {/* Valor */}
              <View style={{ alignItems: "center", marginBottom: 24 }}>
                <Text style={{ color: "#6B7280", fontSize: 14 }}>Valor a Pagar</Text>
                <Text style={{ color: "#059669", fontSize: 40, fontWeight: "bold", marginTop: 8 }}>
                  R$ {valor.toFixed(2)}
                </Text>
              </View>

              {/* QR Code Placeholder */}
              <View
                style={{
                  backgroundColor: "#F9FAFB",
                  borderRadius: 16,
                  padding: 24,
                  alignItems: "center",
                  marginBottom: 24,
                }}
              >
                {pixGerado ? (
                  <>
                    <View
                      style={{
                        width: 180,
                        height: 180,
                        backgroundColor: "#fff",
                        borderRadius: 12,
                        alignItems: "center",
                        justifyContent: "center",
                        borderWidth: 2,
                        borderColor: "#E5E7EB",
                        marginBottom: 16,
                      }}
                    >
                      {/* Simulação de QR Code */}
                      <View style={{ flexDirection: "row", flexWrap: "wrap", width: 140, height: 140 }}>
                        {Array.from({ length: 100 }).map((_, i) => (
                          <View
                            key={i}
                            style={{
                              width: 14,
                              height: 14,
                              backgroundColor: Math.random() > 0.5 ? "#1F2937" : "#fff",
                            }}
                          />
                        ))}
                      </View>
                    </View>
                    <Text style={{ color: "#6B7280", fontSize: 13, textAlign: "center" }}>
                      Escaneie o QR Code com o app do seu banco
                    </Text>
                  </>
                ) : (
                  <View style={{ alignItems: "center", padding: 40 }}>
                    <Text style={{ color: "#6B7280", fontSize: 14 }}>Gerando QR Code...</Text>
                  </View>
                )}
              </View>

              {/* Dados do PIX */}
              <View
                style={{
                  backgroundColor: "#F0FDF4",
                  borderRadius: 12,
                  padding: 16,
                  marginBottom: 24,
                }}
              >
                <Text style={{ color: "#166534", fontSize: 14, fontWeight: "600", marginBottom: 12 }}>
                  📋 Dados para Transferência
                </Text>
                <View style={{ gap: 8 }}>
                  <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                    <Text style={{ color: "#166534", fontSize: 13 }}>Chave PIX:</Text>
                    <Text style={{ color: "#166534", fontSize: 13, fontWeight: "600" }}>{PIX_DATA.chave}</Text>
                  </View>
                  <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                    <Text style={{ color: "#166534", fontSize: 13 }}>Nome:</Text>
                    <Text style={{ color: "#166534", fontSize: 13, fontWeight: "600" }}>{PIX_DATA.nome}</Text>
                  </View>
                  <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                    <Text style={{ color: "#166534", fontSize: 13 }}>Banco:</Text>
                    <Text style={{ color: "#166534", fontSize: 13, fontWeight: "600" }}>{PIX_DATA.banco}</Text>
                  </View>
                </View>
              </View>

              {/* Código Copia e Cola */}
              <View style={{ marginBottom: 24 }}>
                <Text style={{ color: "#4B5563", fontSize: 14, fontWeight: "600", marginBottom: 8 }}>
                  Código PIX Copia e Cola
                </Text>
                <View
                  style={{
                    backgroundColor: "#F3F4F6",
                    borderRadius: 12,
                    padding: 12,
                    borderWidth: 1,
                    borderColor: "#E5E7EB",
                  }}
                >
                  <Text
                    style={{ color: "#6B7280", fontSize: 12, lineHeight: 18 }}
                    numberOfLines={3}
                    ellipsizeMode="middle"
                  >
                    {codigoPix}
                  </Text>
                </View>
              </View>

              {/* Botões */}
              <View style={{ gap: 12 }}>
                <TouchableOpacity
                  onPress={handleCopiarCodigo}
                  activeOpacity={0.8}
                  style={{ borderRadius: 12, overflow: "hidden" }}
                >
                  <LinearGradient
                    colors={copiado ? ["#059669", "#047857"] : ["#1F2937", "#111827"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={{ paddingVertical: 16, alignItems: "center", flexDirection: "row", justifyContent: "center" }}
                  >
                    <Text style={{ color: "#fff", fontSize: 16, fontWeight: "bold" }}>
                      {copiado ? "✅ Código Copiado!" : "📋 Copiar Código PIX"}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleCompartilhar}
                  activeOpacity={0.8}
                  style={{
                    borderRadius: 12,
                    borderWidth: 2,
                    borderColor: "#059669",
                    paddingVertical: 16,
                    alignItems: "center",
                  }}
                >
                  <Text style={{ color: "#059669", fontSize: 16, fontWeight: "bold" }}>
                    📤 Compartilhar
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Botão Confirmar Pagamento */}
          <View style={{ paddingHorizontal: 24, marginTop: 24, marginBottom: 32 }}>
            <TouchableOpacity
              onPress={handleConfirmarPagamento}
              activeOpacity={0.8}
              style={{
                backgroundColor: "rgba(255,255,255,0.2)",
                borderRadius: 16,
                paddingVertical: 16,
                alignItems: "center",
                borderWidth: 1,
                borderColor: "rgba(255,255,255,0.3)",
              }}
            >
              <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>
                ✅ Já Realizei o Pagamento
              </Text>
            </TouchableOpacity>

            <Text
              style={{
                color: "rgba(255,255,255,0.6)",
                fontSize: 12,
                textAlign: "center",
                marginTop: 12,
              }}
            >
              Após o pagamento, a confirmação pode levar até 24 horas
            </Text>
          </View>

          {/* Instruções */}
          <View style={{ paddingHorizontal: 24, marginBottom: 32 }}>
            <View
              style={{
                backgroundColor: "rgba(255,255,255,0.1)",
                borderRadius: 16,
                padding: 20,
              }}
            >
              <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600", marginBottom: 16 }}>
                📱 Como Pagar
              </Text>
              <View style={{ gap: 12 }}>
                <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
                  <View
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: 12,
                      backgroundColor: "rgba(255,255,255,0.2)",
                      alignItems: "center",
                      justifyContent: "center",
                      marginRight: 12,
                    }}
                  >
                    <Text style={{ color: "#fff", fontSize: 12, fontWeight: "bold" }}>1</Text>
                  </View>
                  <Text style={{ color: "rgba(255,255,255,0.9)", fontSize: 14, flex: 1 }}>
                    Abra o app do seu banco e acesse a área PIX
                  </Text>
                </View>
                <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
                  <View
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: 12,
                      backgroundColor: "rgba(255,255,255,0.2)",
                      alignItems: "center",
                      justifyContent: "center",
                      marginRight: 12,
                    }}
                  >
                    <Text style={{ color: "#fff", fontSize: 12, fontWeight: "bold" }}>2</Text>
                  </View>
                  <Text style={{ color: "rgba(255,255,255,0.9)", fontSize: 14, flex: 1 }}>
                    Escolha "Pagar com QR Code" ou "PIX Copia e Cola"
                  </Text>
                </View>
                <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
                  <View
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: 12,
                      backgroundColor: "rgba(255,255,255,0.2)",
                      alignItems: "center",
                      justifyContent: "center",
                      marginRight: 12,
                    }}
                  >
                    <Text style={{ color: "#fff", fontSize: 12, fontWeight: "bold" }}>3</Text>
                  </View>
                  <Text style={{ color: "rgba(255,255,255,0.9)", fontSize: 14, flex: 1 }}>
                    Escaneie o QR Code ou cole o código copiado
                  </Text>
                </View>
                <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
                  <View
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: 12,
                      backgroundColor: "rgba(255,255,255,0.2)",
                      alignItems: "center",
                      justifyContent: "center",
                      marginRight: 12,
                    }}
                  >
                    <Text style={{ color: "#fff", fontSize: 12, fontWeight: "bold" }}>4</Text>
                  </View>
                  <Text style={{ color: "rgba(255,255,255,0.9)", fontSize: 14, flex: 1 }}>
                    Confirme os dados e finalize o pagamento
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </ScreenContainer>
    </View>
  );
}
