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
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { SkeletonList, LoadingOverlay } from "@/components/loading";
import * as Haptics from "expo-haptics";

interface Cobranca {
  id: string;
  associadoNome: string;
  associadoId: string;
  valor: number;
  mesReferencia: string;
  dataVencimento: Date;
  status: "pendente" | "vencido" | "pago";
  diasAtraso: number;
}

// Dados simulados
const mockCobrancas: Cobranca[] = [
  {
    id: "1",
    associadoNome: "João Silva",
    associadoId: "1",
    valor: 150.0,
    mesReferencia: "Fevereiro/2024",
    dataVencimento: new Date("2024-02-15"),
    status: "vencido",
    diasAtraso: 30,
  },
  {
    id: "2",
    associadoNome: "Maria Santos",
    associadoId: "2",
    valor: 150.0,
    mesReferencia: "Fevereiro/2024",
    dataVencimento: new Date("2024-02-15"),
    status: "vencido",
    diasAtraso: 30,
  },
  {
    id: "3",
    associadoNome: "Pedro Costa",
    associadoId: "3",
    valor: 150.0,
    mesReferencia: "Março/2024",
    dataVencimento: new Date("2024-03-15"),
    status: "pendente",
    diasAtraso: 0,
  },
  {
    id: "4",
    associadoNome: "Ana Oliveira",
    associadoId: "4",
    valor: 150.0,
    mesReferencia: "Janeiro/2024",
    dataVencimento: new Date("2024-01-15"),
    status: "vencido",
    diasAtraso: 60,
  },
  {
    id: "5",
    associadoNome: "Carlos Ferreira",
    associadoId: "5",
    valor: 150.0,
    mesReferencia: "Março/2024",
    dataVencimento: new Date("2024-03-15"),
    status: "pago",
    diasAtraso: 0,
  },
];

type FilterStatus = "todos" | "pendente" | "vencido" | "pago";

export default function CobrancasScreen() {
  const router = useRouter();
  const colors = useColors();

  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [cobrancas, setCobrancas] = useState<Cobranca[]>([]);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("todos");

  const loadData = useCallback(async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setCobrancas(mockCobrancas);
    } catch (error) {
      console.error("Erro ao carregar cobranças:", error);
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

  const filteredCobrancas = cobrancas.filter((c) => {
    return filterStatus === "todos" || c.status === filterStatus;
  });

  const valorTotal = cobrancas
    .filter((c) => c.status !== "pago")
    .reduce((acc, c) => acc + c.valor, 0);

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

  const handleGerarBoleto = async (cobranca: Cobranca) => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    setIsProcessing(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      if (Platform.OS !== "web") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }

      Alert.alert(
        "Boleto Gerado!",
        `Boleto para ${cobranca.associadoNome} no valor de R$ ${cobranca.valor.toFixed(2)} foi gerado e enviado por email.`
      );
    } catch (error) {
      Alert.alert("Erro", "Erro ao gerar boleto");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleMarcarPago = async (cobranca: Cobranca) => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    Alert.alert(
      "Confirmar Pagamento",
      `Marcar cobrança de ${cobranca.associadoNome} como paga?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Confirmar",
          onPress: async () => {
            setIsProcessing(true);
            try {
              await new Promise((resolve) => setTimeout(resolve, 1000));

              setCobrancas(
                cobrancas.map((c) =>
                  c.id === cobranca.id ? { ...c, status: "pago" as const, diasAtraso: 0 } : c
                )
              );

              if (Platform.OS !== "web") {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              }

              Alert.alert("Sucesso", "Pagamento registrado com sucesso!");
            } catch (error) {
              Alert.alert("Erro", "Erro ao registrar pagamento");
            } finally {
              setIsProcessing(false);
            }
          },
        },
      ]
    );
  };

  const FilterButton = ({
    label,
    value,
    count,
  }: {
    label: string;
    value: FilterStatus;
    count: number;
  }) => (
    <TouchableOpacity
      onPress={() => {
        if (Platform.OS !== "web") {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        setFilterStatus(value);
      }}
      activeOpacity={0.7}
      className="px-3 py-2 rounded-full mr-2"
      style={{
        backgroundColor: filterStatus === value ? colors.primary : colors.surface,
        borderWidth: 1,
        borderColor: filterStatus === value ? colors.primary : colors.border,
      }}
    >
      <Text
        className="text-xs font-medium"
        style={{ color: filterStatus === value ? "#fff" : colors.foreground }}
      >
        {label} ({count})
      </Text>
    </TouchableOpacity>
  );

  const renderItem = ({ item }: { item: Cobranca }) => (
    <View className="bg-surface rounded-xl p-4 mb-3 border border-border">
      <View className="flex-row justify-between items-start mb-3">
        <TouchableOpacity
          onPress={() => router.push(`/associados/${item.associadoId}` as any)}
          activeOpacity={0.7}
        >
          <Text className="text-base font-semibold text-foreground">
            {item.associadoNome}
          </Text>
          <Text className="text-sm text-muted mt-0.5">{item.mesReferencia}</Text>
        </TouchableOpacity>
        <View
          className="rounded-full px-3 py-1"
          style={{ backgroundColor: getStatusColor(item.status) + "20" }}
        >
          <Text
            className="text-xs font-semibold"
            style={{ color: getStatusColor(item.status) }}
          >
            {getStatusLabel(item.status)}
          </Text>
        </View>
      </View>

      <View className="flex-row justify-between items-center mb-3">
        <View>
          <Text className="text-xs text-muted">Valor</Text>
          <Text className="text-lg font-bold" style={{ color: colors.primary }}>
            R$ {item.valor.toFixed(2)}
          </Text>
        </View>
        <View className="items-end">
          <Text className="text-xs text-muted">Vencimento</Text>
          <Text className="text-sm text-foreground">
            {item.dataVencimento.toLocaleDateString("pt-BR")}
          </Text>
        </View>
      </View>

      {item.diasAtraso > 0 && item.status !== "pago" && (
        <View
          className="rounded-lg p-2 mb-3"
          style={{ backgroundColor: colors.error + "10" }}
        >
          <Text className="text-xs text-center" style={{ color: colors.error }}>
            ⚠️ {item.diasAtraso} dias em atraso
          </Text>
        </View>
      )}

      {item.status !== "pago" && (
        <View className="flex-row gap-2">
          <TouchableOpacity
            onPress={() => handleGerarBoleto(item)}
            activeOpacity={0.7}
            className="flex-1 rounded-lg py-2"
            style={{ backgroundColor: colors.primary }}
          >
            <Text className="text-white font-semibold text-center text-sm">
              Gerar Boleto
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleMarcarPago(item)}
            activeOpacity={0.7}
            className="flex-1 rounded-lg py-2"
            style={{ backgroundColor: colors.success }}
          >
            <Text className="text-white font-semibold text-center text-sm">
              Marcar Pago
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  const counts = {
    todos: cobrancas.length,
    pendente: cobrancas.filter((c) => c.status === "pendente").length,
    vencido: cobrancas.filter((c) => c.status === "vencido").length,
    pago: cobrancas.filter((c) => c.status === "pago").length,
  };

  return (
    <ScreenContainer className="bg-background">
      <LoadingOverlay visible={isProcessing} message="Processando..." />

      {/* Header */}
      <View className="px-6 py-4">
        <Text className="text-2xl font-bold text-foreground mb-4">Cobranças</Text>

        {/* Card Resumo */}
        <View
          className="rounded-xl p-4 mb-4"
          style={{ backgroundColor: colors.error + "10" }}
        >
          <View className="flex-row justify-between items-center">
            <View>
              <Text className="text-xs text-muted">Total Pendente</Text>
              <Text className="text-2xl font-bold" style={{ color: colors.error }}>
                R$ {valorTotal.toFixed(2)}
              </Text>
            </View>
            <View className="items-end">
              <Text className="text-xs text-muted">Cobranças em aberto</Text>
              <Text className="text-lg font-bold text-foreground">
                {counts.pendente + counts.vencido}
              </Text>
            </View>
          </View>
        </View>

        {/* Filters */}
        <View className="flex-row">
          <FilterButton label="Todos" value="todos" count={counts.todos} />
          <FilterButton label="Pendentes" value="pendente" count={counts.pendente} />
          <FilterButton label="Vencidos" value="vencido" count={counts.vencido} />
          <FilterButton label="Pagos" value="pago" count={counts.pago} />
        </View>
      </View>

      {/* List */}
      {isLoading ? (
        <View className="px-6">
          <SkeletonList count={5} />
        </View>
      ) : (
        <FlatList
          data={filteredCobrancas}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={onRefresh}
              tintColor={colors.primary}
            />
          }
          ListEmptyComponent={
            <View className="items-center justify-center py-12">
              <Text className="text-4xl mb-4">✅</Text>
              <Text className="text-base text-muted text-center">
                Nenhuma cobrança encontrada
              </Text>
            </View>
          }
        />
      )}
    </ScreenContainer>
  );
}
