import { useState, useEffect, useCallback } from "react";
import {
  FlatList,
  Text,
  View,
  TouchableOpacity,
  RefreshControl,
  Platform,
  Alert,
} from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useAuth } from "@/lib/auth-context";
import { SkeletonList, LoadingOverlay } from "@/components/loading";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";

interface Divida {
  id: string;
  mesReferencia: string;
  valor: number;
  dataVencimento: Date;
  status: "pendente" | "vencido" | "pago";
  diasAtraso: number;
}

// Dados simulados
const mockDividas: Divida[] = [
  {
    id: "1",
    mesReferencia: "Março/2024",
    valor: 150.0,
    dataVencimento: new Date("2024-03-15"),
    status: "pendente",
    diasAtraso: 0,
  },
  {
    id: "2",
    mesReferencia: "Fevereiro/2024",
    valor: 150.0,
    dataVencimento: new Date("2024-02-15"),
    status: "vencido",
    diasAtraso: 30,
  },
];

export default function MinhasDividasScreen() {
  const colors = useColors();
  const { user } = useAuth();

  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [dividas, setDividas] = useState<Divida[]>([]);

  const valorTotal = dividas
    .filter((d) => d.status !== "pago")
    .reduce((acc, d) => acc + d.valor, 0);

  const loadData = useCallback(async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setDividas(mockDividas);
    } catch (error) {
      // CORREÇÃO: Usando a variável de erro no log
      console.error("Erro ao carregar dívidas:", error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onRefresh = useCallback(() => {
    setIsRefreshing(true);
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    loadData();
  }, [loadData]);

  const handleGerarBoleto = async (divida: Divida) => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    setIsGenerating(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      if (Platform.OS !== "web") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }

      Alert.alert(
        "Boleto Gerado!",
        `Boleto referente a ${divida.mesReferencia} no valor de R$ ${divida.valor.toFixed(2)} foi gerado com sucesso.\n\nO boleto foi enviado para seu email.`,
        [{ text: "OK" }]
      );
    } catch (error) {
      // CORREÇÃO: Usando a variável de erro no log para debugar falhas na geração
      console.error("Erro ao gerar boleto:", error);
      
      if (Platform.OS !== "web") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
      Alert.alert("Erro", "Erro ao gerar boleto. Tente novamente.");
    } finally {
      setIsGenerating(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pago":
        return "#059669";
      case "vencido":
        return "#DC2626";
      case "pendente":
        return "#F59E0B";
      default:
        return "#6B7280";
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

  const renderItem = ({ item }: { item: Divida }) => (
    <View
      style={{
        backgroundColor: colors.surface,
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 3,
      }}
    >
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 16, fontWeight: "600", color: colors.foreground }}>
            {item.mesReferencia}
          </Text>
          <Text style={{ fontSize: 14, color: colors.muted, marginTop: 4 }}>
            Vencimento: {item.dataVencimento.toLocaleDateString("pt-BR")}
          </Text>
        </View>
        <View
          style={{
            backgroundColor: getStatusColor(item.status) + "20",
            paddingHorizontal: 12,
            paddingVertical: 4,
            borderRadius: 20,
          }}
        >
          <Text
            style={{
              fontSize: 12,
              fontWeight: "600",
              color: getStatusColor(item.status),
            }}
          >
            {getStatusLabel(item.status)}
          </Text>
        </View>
      </View>

      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <Text style={{ fontSize: 24, fontWeight: "bold", color: "#059669" }}>
          R$ {item.valor.toFixed(2)}
        </Text>

        {item.status !== "pago" && (
          <TouchableOpacity
            onPress={() => handleGerarBoleto(item)}
            activeOpacity={0.8}
            style={{ borderRadius: 12, overflow: "hidden" }}
          >
            <LinearGradient
              colors={["#059669", "#047857"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{ paddingHorizontal: 16, paddingVertical: 10 }}
            >
              <Text style={{ color: "#fff", fontWeight: "600", fontSize: 14 }}>
                Gerar Boleto
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        )}
      </View>

      {item.diasAtraso > 0 && (
        <View
          style={{
            marginTop: 12,
            backgroundColor: "#FEE2E2",
            borderRadius: 8,
            padding: 8,
          }}
        >
          <Text style={{ fontSize: 12, color: "#DC2626", textAlign: "center" }}>
            ⚠️ {item.diasAtraso} dias em atraso
          </Text>
        </View>
      )}
    </View>
  );

  if (isLoading) {
    return (
      <ScreenContainer>
        <View style={{ padding: 24 }}>
          <SkeletonList count={4} />
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer edges={["left", "right"]}>
      <LoadingOverlay visible={isGenerating} message="Gerando boleto..." />

      <LinearGradient
        colors={["#059669", "#047857", "#065F46"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ paddingTop: 64, paddingBottom: 80, paddingHorizontal: 24 }}
      >
        <Text style={{ color: "rgba(255,255,255,0.8)", fontSize: 16 }}>
          Olá, {user?.nome || "Usuário"}
        </Text>
        <Text style={{ color: "#fff", fontSize: 28, fontWeight: "bold", marginTop: 4 }}>
          Minhas Dívidas
        </Text>
      </LinearGradient>

      <View style={{ paddingHorizontal: 24, marginTop: -48 }}>
        <View
          style={{
            backgroundColor: colors.surface,
            borderRadius: 20,
            padding: 20,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.12,
            shadowRadius: 12,
            elevation: 8,
          }}
        >
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <View>
              <Text style={{ color: colors.muted, fontSize: 14 }}>
                {valorTotal > 0 ? "Total em Aberto" : "Situação"}
              </Text>
              <Text
                style={{
                  color: valorTotal > 0 ? "#DC2626" : "#059669",
                  fontSize: 32,
                  fontWeight: "bold",
                  marginTop: 4,
                }}
              >
                {valorTotal > 0 ? `R$ ${valorTotal.toFixed(2)}` : "Em dia!"}
              </Text>
            </View>
            <View
              style={{
                width: 56,
                height: 56,
                borderRadius: 28,
                backgroundColor: valorTotal > 0 ? "#FEE2E2" : "#D1FAE5",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={{ fontSize: 28 }}>{valorTotal > 0 ? "💰" : "✅"}</Text>
            </View>
          </View>
          {valorTotal > 0 && (
            <Text style={{ color: colors.muted, fontSize: 12, marginTop: 8 }}>
              {dividas.filter((d) => d.status !== "pago").length} débito(s) pendente(s)
            </Text>
          )}
        </View>
      </View>

      <View style={{ paddingHorizontal: 24, marginTop: 24, marginBottom: 8 }}>
        <Text style={{ fontSize: 18, fontWeight: "bold", color: colors.foreground }}>
          Meus Débitos
        </Text>
      </View>

      <FlatList
        data={dividas}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 20 }}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            tintColor="#059669"
          />
        }
        ListEmptyComponent={
          <View style={{ alignItems: "center", justifyContent: "center", paddingVertical: 48 }}>
            <Text style={{ fontSize: 48, marginBottom: 16 }}>🎉</Text>
            <Text style={{ fontSize: 18, fontWeight: "600", color: colors.foreground, marginBottom: 8 }}>
              Parabéns!
            </Text>
            <Text style={{ fontSize: 14, color: colors.muted, textAlign: "center" }}>
              Você não possui débitos pendentes
            </Text>
          </View>
        }
      />
    </ScreenContainer>
  );
}