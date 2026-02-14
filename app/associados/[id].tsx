import { useState } from "react";
import { ScrollView, Text, View, TouchableOpacity, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { Associado, Pagamento, Devedor } from "@/lib/types";
import * as Haptics from "expo-haptics";

const mockAssociado: Associado = {
  id: "1",
  nome: "João Silva",
  email: "joao@example.com",
  cpf: "123.456.789-00",
  dataAdesao: new Date("2023-01-15"),
  status: "ativo",
};

const mockPagamentos: Pagamento[] = [
  {
    id: "1",
    associadoId: "1",
    valor: 150.0,
    dataPagamento: new Date("2024-01-15"),
    mesReferencia: "2024-01",
  },
  {
    id: "2",
    associadoId: "1",
    valor: 150.0,
    dataPagamento: new Date("2023-12-20"),
    mesReferencia: "2023-12",
  },
];

const mockDebitos: Devedor[] = [
  {
    id: "1",
    associadoId: "1",
    mesAtraso: "2024-02",
    valorPendente: 150.0,
    diasAtraso: 15,
    dataVencimento: new Date("2024-02-15"),
    status: "vencido",
  },
];

export default function AssociadoDetalheScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const colors = useColors();
  const [associado] = useState<Associado>(mockAssociado);
  const [pagamentos] = useState<Pagamento[]>(mockPagamentos);
  const [debitos] = useState<Devedor[]>(mockDebitos);

  const handleEditar = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(`./editar/${id}` as any);
  };

  const handleRegistrarPagamento = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Alert.alert(
      "Registrar Pagamento",
      "Digite o valor do pagamento",
      [
        { text: "Cancelar", onPress: () => {} },
        {
          text: "Registrar",
          onPress: () => {
            Alert.alert("Sucesso", "Pagamento registrado com sucesso!");
          },
        },
      ]
    );
  };

  const handleGerarBoleto = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Alert.alert("Boleto Gerado", "Boleto gerado com sucesso!");
  };

  const handleExcluir = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    Alert.alert(
      "Excluir Associado",
      "Tem certeza que deseja excluir este associado?",
      [
        { text: "Cancelar", onPress: () => {} },
        {
          text: "Excluir",
          onPress: () => {
            router.back();
          },
          style: "destructive",
        },
      ]
    );
  };

  return (
    <ScreenContainer className="bg-background">
      {/* Header */}
      <View className="px-6 py-4 border-b border-border flex-row justify-between items-center">
        <View>
          <Text className="text-2xl font-bold text-foreground">{associado.nome}</Text>
          <Text className="text-sm text-muted mt-1">{associado.email}</Text>
        </View>
        <View
          style={{
            backgroundColor:
              associado.status === "ativo" ? colors.success + "20" : colors.error + "20",
          }}
          className="rounded px-3 py-1"
        >
          <Text
            className="text-xs font-semibold"
            style={{
              color: associado.status === "ativo" ? colors.success : colors.error,
            }}
          >
            {associado.status === "ativo" ? "Ativo" : "Inativo"}
          </Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
        {/* Informações */}
        <View className="px-6 py-4">
          <Text className="text-lg font-bold text-foreground mb-3">Informações</Text>
          <View className="bg-surface rounded-lg p-4 gap-3 border border-border">
            <View>
              <Text className="text-xs text-muted font-semibold">CPF</Text>
              <Text className="text-sm text-foreground mt-1">{associado.cpf}</Text>
            </View>
            <View>
              <Text className="text-xs text-muted font-semibold">Data de Adesão</Text>
              <Text className="text-sm text-foreground mt-1">
                {associado.dataAdesao.toLocaleDateString("pt-BR")}
              </Text>
            </View>
          </View>
        </View>

        {/* Débitos Pendentes */}
        {debitos.length > 0 && (
          <View className="px-6 py-4">
            <Text className="text-lg font-bold text-foreground mb-3">Débitos Pendentes</Text>
            {debitos.map((debito) => (
              <View
                key={debito.id}
                className="bg-surface rounded-lg p-4 mb-3 border border-border"
                style={{ borderColor: colors.error + "40" }}
              >
                <View className="flex-row justify-between items-start">
                  <View>
                    <Text className="text-sm font-semibold text-foreground">
                      {debito.mesAtraso}
                    </Text>
                    <Text className="text-xs text-muted mt-1">
                      Vencimento: {debito.dataVencimento.toLocaleDateString("pt-BR")}
                    </Text>
                  </View>
                  <View className="items-end">
                    <Text className="text-sm font-bold" style={{ color: colors.error }}>
                      R$ {debito.valorPendente.toFixed(2)}
                    </Text>
                    <Text className="text-xs text-error mt-1">
                      {debito.diasAtraso} dias atrasado
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Pagamentos Recentes */}
        <View className="px-6 py-4">
          <Text className="text-lg font-bold text-foreground mb-3">Pagamentos Recentes</Text>
          {pagamentos.length > 0 ? (
            pagamentos.map((pagamento) => (
              <View
                key={pagamento.id}
                className="bg-surface rounded-lg p-4 mb-3 border border-border"
              >
                <View className="flex-row justify-between items-start">
                  <View>
                    <Text className="text-sm font-semibold text-foreground">
                      {pagamento.mesReferencia}
                    </Text>
                    <Text className="text-xs text-muted mt-1">
                      {pagamento.dataPagamento.toLocaleDateString("pt-BR")}
                    </Text>
                  </View>
                  <Text className="text-sm font-bold" style={{ color: colors.success }}>
                    R$ {pagamento.valor.toFixed(2)}
                  </Text>
                </View>
              </View>
            ))
          ) : (
            <Text className="text-sm text-muted text-center py-4">
              Nenhum pagamento registrado
            </Text>
          )}
        </View>

        {/* Ações */}
        <View className="px-6 py-4 gap-3">
          <TouchableOpacity
            onPress={handleRegistrarPagamento}
            activeOpacity={0.7}
            style={{ backgroundColor: colors.success }}
            className="rounded-lg py-3 px-4"
          >
            <Text className="text-white font-semibold text-center">Registrar Pagamento</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleGerarBoleto}
            activeOpacity={0.7}
            style={{ backgroundColor: colors.primary }}
            className="rounded-lg py-3 px-4"
          >
            <Text className="text-white font-semibold text-center">Gerar Boleto</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleEditar}
            activeOpacity={0.7}
            className="bg-surface border border-border rounded-lg py-3 px-4"
          >
            <Text className="text-foreground font-semibold text-center">Editar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleExcluir}
            activeOpacity={0.7}
            style={{ backgroundColor: colors.error + "20" }}
            className="rounded-lg py-3 px-4"
          >
            <Text className="font-semibold text-center" style={{ color: colors.error }}>
              Excluir
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
