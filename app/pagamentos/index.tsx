import { useState } from "react";
import {
  ScrollView,
  Text,
  View,
  FlatList,
} from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";

interface PagamentoItem {
  id: string;
  associado: string;
  valor: number;
  dataPagamento: string;
  mesReferencia: string;
}

const mockPagamentos: PagamentoItem[] = [
  {
    id: "1",
    associado: "João Silva",
    valor: 150.0,
    dataPagamento: "2024-03-15",
    mesReferencia: "2024-03",
  },
  {
    id: "2",
    associado: "Maria Santos",
    valor: 150.0,
    dataPagamento: "2024-03-14",
    mesReferencia: "2024-03",
  },
  {
    id: "3",
    associado: "Pedro Costa",
    valor: 150.0,
    dataPagamento: "2024-03-13",
    mesReferencia: "2024-03",
  },
  {
    id: "4",
    associado: "Ana Oliveira",
    valor: 150.0,
    dataPagamento: "2024-02-28",
    mesReferencia: "2024-02",
  },
  {
    id: "5",
    associado: "Carlos Mendes",
    valor: 150.0,
    dataPagamento: "2024-02-20",
    mesReferencia: "2024-02",
  },
];

export default function PagamentosScreen() {
  const colors = useColors();
  const [pagamentos] = useState<PagamentoItem[]>(mockPagamentos);

  const totalPagamentos = pagamentos.reduce((sum, p) => sum + p.valor, 0);

  return (
    <ScreenContainer className="bg-background">
      {/* Header */}
      <View className="px-6 py-4 border-b border-border">
        <Text className="text-2xl font-bold text-foreground">Pagamentos</Text>
        <Text className="text-sm text-muted mt-1">
          {pagamentos.length} pagamentos registrados
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {/* Resumo */}
        <View className="px-6 py-4">
          <View className="bg-surface rounded-lg p-4 border border-border">
            <Text className="text-xs text-muted font-semibold mb-2">Total Recebido</Text>
            <Text
              className="text-3xl font-bold"
              style={{ color: colors.success }}
            >
              R$ {totalPagamentos.toFixed(2)}
            </Text>
          </View>
        </View>

        {/* Pagamentos List */}
        <View className="px-6">
          {pagamentos.length > 0 ? (
            <FlatList
              scrollEnabled={false}
              data={pagamentos}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View
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
                        Data: {item.dataPagamento}
                      </Text>
                    </View>
                    <Text
                      className="text-sm font-bold"
                      style={{ color: colors.success }}
                    >
                      R$ {item.valor.toFixed(2)}
                    </Text>
                  </View>
                </View>
              )}
            />
          ) : (
            <View className="py-8 items-center">
              <Text className="text-sm text-muted">Nenhum pagamento registrado</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
