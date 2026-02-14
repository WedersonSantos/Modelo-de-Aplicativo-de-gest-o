import { useState } from "react";
import { ScrollView, Text, View, TouchableOpacity, Alert } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import * as Haptics from "expo-haptics";

interface Boleto {
  numero: string;
  valor: number;
  vencimento: string;
  dataGeracao: string;
  status: "gerado" | "enviado" | "pago";
}

const mockCobranca = {
  id: "1",
  associado: "João Silva",
  email: "joao@example.com",
  valor: 150.0,
  status: "vencido" as const,
  mesReferencia: "2024-02",
  dataVencimento: "2024-02-15",
  diasAtraso: 15,
  boletos: [
    {
      numero: "12345.67890 12345.678901 12345.678901 1 12345678901234",
      valor: 150.0,
      vencimento: "2024-02-15",
      dataGeracao: "2024-02-01",
      status: "enviado" as const,
    },
  ],
};

export default function CobrancaDetalheScreen() {
  const { id } = useLocalSearchParams();
  const colors = useColors();
  const [cobranca] = useState(mockCobranca);
  const [isGeneratingBoleto, setIsGeneratingBoleto] = useState(false);
  const [isSendingNotification, setIsSendingNotification] = useState(false);

  const handleGerarBoleto = async () => {
    setIsGeneratingBoleto(true);
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      // Simular geração de boleto
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert("Sucesso", "Boleto gerado com sucesso!");
    } catch (error) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert("Erro", "Falha ao gerar boleto");
    } finally {
      setIsGeneratingBoleto(false);
    }
  };

  const handleEnviarNotificacao = async () => {
    setIsSendingNotification(true);
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      // Simular envio de notificação
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert("Sucesso", `Notificação enviada para ${cobranca.email}`);
    } catch (error) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert("Erro", "Falha ao enviar notificação");
    } finally {
      setIsSendingNotification(false);
    }
  };

  const handleMarcarComoPago = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Alert.alert(
      "Marcar como Pago",
      "Tem certeza que deseja marcar esta cobrança como paga?",
      [
        { text: "Cancelar", onPress: () => {} },
        {
          text: "Confirmar",
          onPress: () => {
            Alert.alert("Sucesso", "Cobrança marcada como paga!");
          },
        },
      ]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pago":
        return colors.success;
      case "vencido":
        return colors.error;
      case "pendente":
        return colors.warning;
      default:
        return colors.muted;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pago":
        return "Pago";
      case "vencido":
        return "Vencido";
      case "pendente":
        return "Pendente";
      default:
        return status;
    }
  };

  return (
    <ScreenContainer className="bg-background">
      {/* Header */}
      <View className="px-6 py-4 border-b border-border">
        <Text className="text-2xl font-bold text-foreground">{cobranca.associado}</Text>
        <Text className="text-sm text-muted mt-1">{cobranca.email}</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
        {/* Status Card */}
        <View className="px-6 py-4">
          <View
            className="rounded-lg p-4 border"
            style={{
              backgroundColor: getStatusColor(cobranca.status) + "10",
              borderColor: getStatusColor(cobranca.status) + "40",
            }}
          >
            <View className="flex-row justify-between items-start">
              <View>
                <Text className="text-xs text-muted font-semibold mb-2">Status</Text>
                <Text
                  className="text-lg font-bold"
                  style={{ color: getStatusColor(cobranca.status) }}
                >
                  {getStatusLabel(cobranca.status)}
                </Text>
              </View>
              <View className="items-end">
                <Text className="text-xs text-muted font-semibold mb-2">Valor</Text>
                <Text className="text-2xl font-bold text-foreground">
                  R$ {cobranca.valor.toFixed(2)}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Informações */}
        <View className="px-6 py-4">
          <Text className="text-lg font-bold text-foreground mb-3">Informações</Text>
          <View className="bg-surface rounded-lg p-4 gap-3 border border-border">
            <View>
              <Text className="text-xs text-muted font-semibold">Referência</Text>
              <Text className="text-sm text-foreground mt-1">{cobranca.mesReferencia}</Text>
            </View>
            <View>
              <Text className="text-xs text-muted font-semibold">Data de Vencimento</Text>
              <Text className="text-sm text-foreground mt-1">{cobranca.dataVencimento}</Text>
            </View>
            {cobranca.diasAtraso > 0 && (
              <View>
                <Text className="text-xs text-muted font-semibold">Dias em Atraso</Text>
                <Text className="text-sm text-error mt-1 font-semibold">
                  {cobranca.diasAtraso} dias
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Boletos */}
        <View className="px-6 py-4">
          <Text className="text-lg font-bold text-foreground mb-3">Boletos</Text>
          {cobranca.boletos.length > 0 ? (
            cobranca.boletos.map((boleto, index) => (
              <View
                key={index}
                className="bg-surface rounded-lg p-4 mb-3 border border-border"
              >
                <View className="flex-row justify-between items-start mb-3">
                  <View>
                    <Text className="text-xs text-muted font-semibold">Número</Text>
                    <Text className="text-xs text-foreground mt-1 font-mono">
                      {boleto.numero}
                    </Text>
                  </View>
                  <View
                    style={{
                      backgroundColor: colors.success + "20",
                    }}
                    className="rounded px-2 py-1"
                  >
                    <Text
                      className="text-xs font-semibold"
                      style={{ color: colors.success }}
                    >
                      {boleto.status === "enviado" ? "Enviado" : "Gerado"}
                    </Text>
                  </View>
                </View>
                <View className="gap-2">
                  <View>
                    <Text className="text-xs text-muted font-semibold">Valor</Text>
                    <Text className="text-sm text-foreground mt-1">
                      R$ {boleto.valor.toFixed(2)}
                    </Text>
                  </View>
                  <View>
                    <Text className="text-xs text-muted font-semibold">Vencimento</Text>
                    <Text className="text-sm text-foreground mt-1">{boleto.vencimento}</Text>
                  </View>
                </View>
              </View>
            ))
          ) : (
            <Text className="text-sm text-muted text-center py-4">
              Nenhum boleto gerado
            </Text>
          )}
        </View>

        {/* Ações */}
        <View className="px-6 py-4 gap-3">
          <TouchableOpacity
            onPress={handleGerarBoleto}
            disabled={isGeneratingBoleto}
            activeOpacity={0.7}
            style={{ backgroundColor: colors.primary, opacity: isGeneratingBoleto ? 0.6 : 1 }}
            className="rounded-lg py-3 px-4"
          >
            <Text className="text-white font-semibold text-center">
              {isGeneratingBoleto ? "Gerando..." : "Gerar Boleto"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleEnviarNotificacao}
            disabled={isSendingNotification}
            activeOpacity={0.7}
            style={{ backgroundColor: colors.warning, opacity: isSendingNotification ? 0.6 : 1 }}
            className="rounded-lg py-3 px-4"
          >
            <Text className="text-white font-semibold text-center">
              {isSendingNotification ? "Enviando..." : "Enviar Notificação"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleMarcarComoPago}
            activeOpacity={0.7}
            style={{ backgroundColor: colors.success }}
            className="rounded-lg py-3 px-4"
          >
            <Text className="text-white font-semibold text-center">Marcar como Pago</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
