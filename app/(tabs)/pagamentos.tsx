import { useState, useEffect, useCallback } from "react";
import {
  FlatList,
  Text,
  View,
  TouchableOpacity,
  RefreshControl,
  Platform,
  TextInput,
} from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { SkeletonList } from "@/components/loading";
import * as Haptics from "expo-haptics";

interface Pagamento {
  id: string;
  associadoNome: string;
  associadoId: string;
  valor: number;
  dataPagamento: Date;
  mesReferencia: string;
  formaPagamento: "boleto" | "pix" | "cartao" | "dinheiro";
}

// Dados simulados
const mockPagamentos: Pagamento[] = [
  {
    id: "1",
    associadoNome: "João Silva",
    associadoId: "1",
    valor: 150.0,
    dataPagamento: new Date("2024-03-10"),
    mesReferencia: "Março/2024",
    formaPagamento: "pix",
  },
  {
    id: "2",
    associadoNome: "Maria Santos",
    associadoId: "2",
    valor: 150.0,
    dataPagamento: new Date("2024-03-08"),
    mesReferencia: "Março/2024",
    formaPagamento: "boleto",
  },
  {
    id: "3",
    associadoNome: "Carlos Ferreira",
    associadoId: "5",
    valor: 150.0,
    dataPagamento: new Date("2024-03-05"),
    mesReferencia: "Março/2024",
    formaPagamento: "pix",
  },
  {
    id: "4",
    associadoNome: "Ana Oliveira",
    associadoId: "4",
    valor: 300.0,
    dataPagamento: new Date("2024-03-01"),
    mesReferencia: "Fev-Mar/2024",
    formaPagamento: "cartao",
  },
  {
    id: "5",
    associadoNome: "Pedro Costa",
    associadoId: "3",
    valor: 150.0,
    dataPagamento: new Date("2024-02-28"),
    mesReferencia: "Fevereiro/2024",
    formaPagamento: "dinheiro",
  },
  {
    id: "6",
    associadoNome: "João Silva",
    associadoId: "1",
    valor: 150.0,
    dataPagamento: new Date("2024-02-15"),
    mesReferencia: "Fevereiro/2024",
    formaPagamento: "boleto",
  },
  {
    id: "7",
    associadoNome: "Maria Santos",
    associadoId: "2",
    valor: 150.0,
    dataPagamento: new Date("2024-02-12"),
    mesReferencia: "Fevereiro/2024",
    formaPagamento: "pix",
  },
];

export default function PagamentosScreen() {
  const colors = useColors();

  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pagamentos, setPagamentos] = useState<Pagamento[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const loadData = useCallback(async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setPagamentos(mockPagamentos);
    } catch (error) {
      console.error("Erro ao carregar pagamentos:", error);
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

  const filteredPagamentos = pagamentos.filter((p) =>
    p.associadoNome.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const valorTotal = pagamentos.reduce((acc, p) => acc + p.valor, 0);

  const getFormaPagamentoIcon = (forma: string) => {
    switch (forma) {
      case "pix":
        return "⚡";
      case "boleto":
        return "📄";
      case "cartao":
        return "💳";
      case "dinheiro":
        return "💵";
      default:
        return "💰";
    }
  };

  const getFormaPagamentoLabel = (forma: string) => {
    switch (forma) {
      case "pix":
        return "PIX";
      case "boleto":
        return "Boleto";
      case "cartao":
        return "Cartão";
      case "dinheiro":
        return "Dinheiro";
      default:
        return forma;
    }
  };

  const renderItem = ({ item }: { item: Pagamento }) => (
    <View className="bg-surface rounded-xl p-4 mb-3 border border-border">
      <View className="flex-row items-center">
        <View
          className="w-12 h-12 rounded-full items-center justify-center mr-3"
          style={{ backgroundColor: colors.success + "15" }}
        >
          <Text className="text-xl">{getFormaPagamentoIcon(item.formaPagamento)}</Text>
        </View>
        <View className="flex-1">
          <View className="flex-row justify-between items-start">
            <View className="flex-1 mr-2">
              <Text className="text-base font-semibold text-foreground">
                {item.associadoNome}
              </Text>
              <Text className="text-sm text-muted mt-0.5">{item.mesReferencia}</Text>
            </View>
            <View className="items-end">
              <Text className="text-base font-bold" style={{ color: colors.success }}>
                R$ {item.valor.toFixed(2)}
              </Text>
              <Text className="text-xs text-muted mt-0.5">
                {item.dataPagamento.toLocaleDateString("pt-BR")}
              </Text>
            </View>
          </View>
          <View className="flex-row items-center mt-2">
            <View
              className="rounded-full px-2 py-0.5"
              style={{ backgroundColor: colors.primary + "15" }}
            >
              <Text className="text-xs" style={{ color: colors.primary }}>
                {getFormaPagamentoLabel(item.formaPagamento)}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );

  // Agrupar pagamentos por mês
  const groupedByMonth = filteredPagamentos.reduce(
    (acc, p) => {
      const monthKey = p.dataPagamento.toLocaleDateString("pt-BR", {
        month: "long",
        year: "numeric",
      });
      if (!acc[monthKey]) {
        acc[monthKey] = [];
      }
      acc[monthKey].push(p);
      return acc;
    },
    {} as Record<string, Pagamento[]>
  );

  return (
    <ScreenContainer className="bg-background">
      {/* Header */}
      <View className="px-6 py-4">
        <Text className="text-2xl font-bold text-foreground mb-4">Pagamentos</Text>

        {/* Card Resumo */}
        <View
          className="rounded-xl p-4 mb-4"
          style={{ backgroundColor: colors.success + "10" }}
        >
          <View className="flex-row justify-between items-center">
            <View>
              <Text className="text-xs text-muted">Total Recebido</Text>
              <Text className="text-2xl font-bold" style={{ color: colors.success }}>
                R$ {valorTotal.toFixed(2)}
              </Text>
            </View>
            <View className="items-end">
              <Text className="text-xs text-muted">Pagamentos</Text>
              <Text className="text-lg font-bold text-foreground">
                {pagamentos.length}
              </Text>
            </View>
          </View>
        </View>

        {/* Search */}
        <TextInput
          placeholder="Buscar por nome do associado..."
          placeholderTextColor={colors.muted}
          value={searchQuery}
          onChangeText={setSearchQuery}
          className="rounded-xl px-4 py-3 text-base"
          style={{
            color: colors.foreground,
            backgroundColor: colors.surface,
            borderWidth: 1,
            borderColor: colors.border,
          }}
        />
      </View>

      {/* List */}
      {isLoading ? (
        <View className="px-6">
          <SkeletonList count={5} />
        </View>
      ) : (
        <FlatList
          data={filteredPagamentos}
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
              <Text className="text-4xl mb-4">💰</Text>
              <Text className="text-base text-muted text-center">
                {searchQuery
                  ? "Nenhum pagamento encontrado"
                  : "Nenhum pagamento registrado"}
              </Text>
            </View>
          }
        />
      )}
    </ScreenContainer>
  );
}
