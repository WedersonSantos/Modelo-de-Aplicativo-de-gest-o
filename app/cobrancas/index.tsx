import { useState, useEffect } from "react";
import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import * as Haptics from "expo-haptics";

interface CobrancaItem {
  id: string;
  associado: string;
  valor: number;
  status: "pendente" | "vencido" | "pago";
  diasAtraso: number;
  mesReferencia: string;
}

const mockCobrancas: CobrancaItem[] = [
  {
    id: "1",
    associado: "João Silva",
    valor: 150.0,
    status: "vencido",
    diasAtraso: 15,
    mesReferencia: "2024-02",
  },
  {
    id: "2",
    associado: "Maria Santos",
    valor: 150.0,
    status: "vencido",
    diasAtraso: 8,
    mesReferencia: "2024-02",
  },
  {
    id: "3",
    associado: "Pedro Costa",
    valor: 150.0,
    status: "pendente",
    diasAtraso: 0,
    mesReferencia: "2024-03",
  },
  {
    id: "4",
    associado: "Ana Oliveira",
    valor: 150.0,
    status: "vencido",
    diasAtraso: 22,
    mesReferencia: "2024-01",
  },
];

export default function CobrancasScreen() {
  const router = useRouter();
  const colors = useColors();
  const [filterStatus, setFilterStatus] = useState<"todos" | "pendente" | "vencido" | "pago">(
    "todos"
  );
  const [cobrancas] = useState<CobrancaItem[]>(mockCobrancas);
  const [filteredCobrancas, setFilteredCobrancas] = useState<CobrancaItem[]>(mockCobrancas);

  useEffect(() => {
    filterCobrancas();
  }, [filterStatus]);

  const filterCobrancas = () => {
    if (filterStatus === "todos") {
      setFilteredCobrancas(cobrancas);
    } else {
      setFilteredCobrancas(cobrancas.filter((c) => c.status === filterStatus));
    }
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

  const handleCobrancaPress = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(`./${id}` as any);
  };

  const totalPendente = filteredCobrancas.reduce((sum, c) => sum + c.valor, 0);

  return (
    <ScreenContainer className="bg-background">
      {/* Header */}
      <View className="px-6 py-4 border-b border-border">
        <Text className="text-2xl font-bold text-foreground">Cobranças</Text>
        <Text className="text-sm text-muted mt-1">
          {filteredCobrancas.length} cobranças
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {/* Resumo */}
        <View className="px-6 py-4">
          <View className="bg-surface rounded-lg p-4 border border-border">
            <Text className="text-xs text-muted font-semibold mb-2">Total Pendente</Text>
            <Text
              className="text-3xl font-bold"
              style={{ color: colors.error }}
            >
              R$ {totalPendente.toFixed(2)}
            </Text>
          </View>
        </View>

        {/* Filter Buttons */}
        <View className="px-6 py-2 gap-3">
          <View className="flex-row gap-2">
            {(["todos", "vencido", "pendente", "pago"] as const).map((status) => (
              <TouchableOpacity
                key={status}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setFilterStatus(status);
                }}
                activeOpacity={0.7}
                style={{
                  backgroundColor:
                    filterStatus === status ? colors.primary : colors.surface,
                  borderColor: colors.border,
                }}
                className="border rounded-lg py-2 px-3"
              >
                <Text
                  className="text-xs font-semibold text-center"
                  style={{
                    color: filterStatus === status ? "white" : colors.foreground,
                  }}
                >
                  {status === "todos"
                    ? "Todas"
                    : status === "vencido"
                      ? "Vencidas"
                      : status === "pendente"
                        ? "Pendentes"
                        : "Pagas"}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Cobrancas List */}
        <View className="px-6 py-4">
          {filteredCobrancas.length > 0 ? (
            <FlatList
              scrollEnabled={false}
              data={filteredCobrancas}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => handleCobrancaPress(item.id)}
                  activeOpacity={0.7}
                  className="bg-surface rounded-lg p-4 mb-3 border border-border"
                >
                  <View className="flex-row justify-between items-start">
                    <View className="flex-1">
                      <Text className="text-sm font-semibold text-foreground">
                        {item.associado}
                      </Text>
                      <Text className="text-xs text-muted mt-1">
                        Referência: {item.mesReferencia}
                      </Text>
                      <Text className="text-xs text-muted mt-1">
                        R$ {item.valor.toFixed(2)}
                      </Text>
                    </View>
                    <View className="items-end">
                      <Text
                        className="text-xs font-semibold px-2 py-1 rounded"
                        style={{
                          color: getStatusColor(item.status),
                          backgroundColor: getStatusColor(item.status) + "20",
                        }}
                      >
                        {getStatusLabel(item.status)}
                      </Text>
                      {item.diasAtraso > 0 && (
                        <Text className="text-xs text-error mt-2 font-semibold">
                          {item.diasAtraso}d atrasado
                        </Text>
                      )}
                    </View>
                  </View>
                </TouchableOpacity>
              )}
            />
          ) : (
            <View className="py-8 items-center">
              <Text className="text-sm text-muted">Nenhuma cobrança encontrada</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
