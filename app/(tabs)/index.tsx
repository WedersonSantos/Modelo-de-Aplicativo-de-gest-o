import { useState, useEffect, useCallback, useMemo } from "react";
import {
  ScrollView,
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

import { useAuth } from "@/lib/auth-context";
import { SkeletonCard, SkeletonList } from "@/components/loading";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import type { Parcela } from "@/lib/types";

// Dados simulados para Admin
const mockAdminStats = {
  totalAssociados: 156,
  associadosAtivos: 142,
  pessoasPagaram: 118,
  pessoasNaoPagaram: 38,
  valorTotalRecebido: 45750.0,
  valorTotalPendente: 8450.0,
  cobrancasPendentes: 38,
  inadimplencia: 24.4,
};

const mockUltimasCobrancas = [
  { id: "1", nome: "João Silva", valor: 150.0, status: "vencido", dias: 15 },
  { id: "2", nome: "Maria Santos", valor: 150.0, status: "pendente", dias: 5 },
  { id: "3", nome: "Pedro Costa", valor: 300.0, status: "vencido", dias: 30 },
];

// Gerar parcelas baseado nos dados do usuário
const gerarParcelas = (valorTotal: number, numeroParcelas: number, parcelasPagas: number): Parcela[] => {
  const totalParcelasSeguro = numeroParcelas || 1;
  const valorParcela = valorTotal / totalParcelasSeguro;
  const parcelas: Parcela[] = [];
  const hoje = new Date();
  
  for (let i = 1; i <= totalParcelasSeguro; i++) {
    const dataVencimento = new Date(hoje.getFullYear(), hoje.getMonth() - parcelasPagas + i - 1, 15);
    const isPago = i <= parcelasPagas;
    const isVencido = !isPago && dataVencimento < hoje;
    
    parcelas.push({
      id: `parcela-${i}`,
      numero: i,
      valor: valorParcela,
      dataVencimento,
      dataPagamento: isPago ? new Date(dataVencimento.getTime() - 5 * 24 * 60 * 60 * 1000) : undefined,
      status: isPago ? "pago" : isVencido ? "vencido" : "pendente",
      formaPagamento: isPago ? "pix" : undefined,
    });
  }
  
  return parcelas;
};

// Dashboard para usuário comum
const UserDashboard = () => {
  const router = useRouter();
  const colors = useColors();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const valorTotal = Number(user?.valorTotal) || 0;
  const numeroParcelas = Number(user?.numeroParcelas) || 1;
  const parcelasPagas = Number(user?.parcelasPagas) || 0;
  
  const valorParcela = valorTotal / numeroParcelas;
  const valorPago = valorParcela * parcelasPagas;
  const valorDevedor = Math.max(0, valorTotal - valorPago);

  const porcentagemProgresso = valorTotal > 0 ? Math.round((valorPago / valorTotal) * 100) : 0;

  const parcelas = useMemo(() => {
    return gerarParcelas(valorTotal, numeroParcelas, parcelasPagas);
  }, [valorTotal, numeroParcelas, parcelasPagas]);

  const parcelasPendentes = parcelas.filter(p => p.status !== "pago");
  const proximaParcela = parcelasPendentes[0];

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const onRefresh = useCallback(() => {
    setIsRefreshing(true);
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setTimeout(() => setIsRefreshing(false), 1000);
  }, []);

  const handlePagarPix = (parcela: Parcela) => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    router.push({
      pathname: "/pagamento-pix",
      params: {
        parcelaId: parcela.id,
        valor: parcela.valor.toString(),
        descricao: `Parcela ${parcela.numero}/${numeroParcelas}`,
      },
    } as any);
  };

  const handleGerarBoleto = (parcela: Parcela) => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    Alert.alert(
      "Boleto Gerado",
      `Boleto da Parcela ${parcela.numero}/${numeroParcelas} no valor de R$ ${parcela.valor.toFixed(2)} foi gerado!\n\nO boleto foi enviado para seu email.`,
      [{ text: "OK" }]
    );
  };

  if (isLoading) {
    return (
      <ScreenContainer>
        <View className="px-6 py-4">
          <SkeletonCard />
          <View className="mt-4">
            <SkeletonList count={3} />
          </View>
        </View>
      </ScreenContainer>
    );
  }

  const renderParcela = ({ item }: { item: Parcela }) => {
    const isPago = item.status === "pago";
    const isVencido = item.status === "vencido";

    return (
      <View
        key={item.id}
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
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  backgroundColor: isPago ? "#D1FAE5" : isVencido ? "#FEE2E2" : "#FEF3C7",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 12,
                }}
              >
                <Text style={{ fontSize: 14 }}>
                  {isPago ? "✅" : isVencido ? "⚠️" : "📅"}
                </Text>
              </View>
              <View>
                <Text style={{ color: colors.foreground, fontSize: 16, fontWeight: "600" }}>
                  Parcela {item.numero}/{numeroParcelas}
                </Text>
                <Text style={{ color: colors.muted, fontSize: 13, marginTop: 2 }}>
                  {isPago
                    ? `Pago em ${item.dataPagamento?.toLocaleDateString("pt-BR")}`
                    : `Vence em ${item.dataVencimento.toLocaleDateString("pt-BR")}`}
                </Text>
              </View>
            </View>
          </View>
          <View style={{ alignItems: "flex-end" }}>
            <Text
              style={{
                color: isPago ? "#059669" : isVencido ? "#DC2626" : "#F59E0B",
                fontSize: 18,
                fontWeight: "bold",
              }}
            >
              R$ {item.valor.toFixed(2)}
            </Text>
            <View
              style={{
                backgroundColor: isPago ? "#D1FAE5" : isVencido ? "#FEE2E2" : "#FEF3C7",
                paddingHorizontal: 8,
                paddingVertical: 2,
                borderRadius: 8,
                marginTop: 4,
              }}
            >
              <Text
                style={{
                  color: isPago ? "#059669" : isVencido ? "#DC2626" : "#F59E0B",
                  fontSize: 11,
                  fontWeight: "600",
                }}
              >
                {isPago ? "Pago" : isVencido ? "Vencido" : "Pendente"}
              </Text>
            </View>
          </View>
        </View>

        {!isPago && (
          <View style={{ flexDirection: "row", gap: 8, marginTop: 12 }}>
            <TouchableOpacity
              onPress={() => handlePagarPix(item)}
              activeOpacity={0.8}
              style={{ flex: 1, borderRadius: 10, overflow: "hidden" }}
            >
              <LinearGradient
                colors={["#059669", "#047857"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{ paddingVertical: 10, alignItems: "center", flexDirection: "row", justifyContent: "center" }}
              >
                <Text style={{ color: "#fff", fontWeight: "600", fontSize: 13 }}>
                  💳 Pagar PIX
                </Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleGerarBoleto(item)}
              activeOpacity={0.8}
              style={{
                flex: 1,
                borderRadius: 10,
                borderWidth: 1.5,
                borderColor: "#059669",
                paddingVertical: 10,
                alignItems: "center",
              }}
            >
              <Text style={{ color: "#059669", fontWeight: "600", fontSize: 13 }}>
                📄 Boleto
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  return (
    <ScreenContainer edges={["left", "right"]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            tintColor="#059669"
          />
        }
      >
        <LinearGradient
          colors={["#059669", "#047857", "#065F46"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ paddingTop: 64, paddingBottom: 96, paddingHorizontal: 24 }}
        >
          <Text style={{ color: "rgba(255,255,255,0.8)", fontSize: 16 }}>Olá,</Text>
          <Text style={{ color: "#fff", fontSize: 28, fontWeight: "bold", marginTop: 4 }}>
            {user?.nome || "Usuário"}
          </Text>
          <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 14, marginTop: 8 }}>
            Bem-vindo ao AACB Gestão
          </Text>
        </LinearGradient>

        <View style={{ paddingHorizontal: 24, marginTop: -64 }}>
          <View
            style={{
              backgroundColor: colors.surface,
              borderRadius: 24,
              padding: 20,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.15,
              shadowRadius: 12,
              elevation: 8,
            }}
          >
            <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 16 }}>
              <View>
                <Text style={{ color: colors.muted, fontSize: 13 }}>Valor Total</Text>
                <Text style={{ color: colors.foreground, fontSize: 24, fontWeight: "bold", marginTop: 2 }}>
                  R$ {valorTotal.toFixed(2)}
                </Text>
              </View>
              <View style={{ alignItems: "flex-end" }}>
                <Text style={{ color: colors.muted, fontSize: 13 }}>Valor Devedor</Text>
                <Text
                  style={{
                    color: valorDevedor > 0 ? "#DC2626" : "#059669",
                    fontSize: 24,
                    fontWeight: "bold",
                    marginTop: 2,
                  }}
                >
                  R$ {valorDevedor.toFixed(2)}
                </Text>
              </View>
            </View>

            <View style={{ marginBottom: 16 }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 6 }}>
                <Text style={{ color: colors.muted, fontSize: 12 }}>Progresso de Pagamento</Text>
                <Text style={{ color: "#059669", fontSize: 12, fontWeight: "600" }}>
                  {porcentagemProgresso}%
                </Text>
              </View>
              <View style={{ height: 8, backgroundColor: colors.border, borderRadius: 4 }}>
                <View
                  style={{
                    height: 8,
                    backgroundColor: "#059669",
                    borderRadius: 4,
                    width: `${porcentagemProgresso}%`,
                  }}
                />
              </View>
            </View>

            <View
              style={{
                flexDirection: "row",
                backgroundColor: colors.background,
                borderRadius: 12,
                padding: 12,
              }}
            >
              <View style={{ flex: 1, alignItems: "center" }}>
                <Text style={{ color: "#059669", fontSize: 20, fontWeight: "bold" }}>
                  {parcelasPagas}
                </Text>
                <Text style={{ color: colors.muted, fontSize: 11, marginTop: 2 }}>Pagas</Text>
              </View>
              <View style={{ width: 1, backgroundColor: colors.border }} />
              <View style={{ flex: 1, alignItems: "center" }}>
                <Text style={{ color: "#F59E0B", fontSize: 20, fontWeight: "bold" }}>
                  {Math.max(0, numeroParcelas - parcelasPagas)}
                </Text>
                <Text style={{ color: colors.muted, fontSize: 11, marginTop: 2 }}>Pendentes</Text>
              </View>
              <View style={{ width: 1, backgroundColor: colors.border }} />
              <View style={{ flex: 1, alignItems: "center" }}>
                <Text style={{ color: colors.foreground, fontSize: 20, fontWeight: "bold" }}>
                  {numeroParcelas}
                </Text>
                <Text style={{ color: colors.muted, fontSize: 11, marginTop: 2 }}>Total</Text>
              </View>
            </View>

            {proximaParcela && (
              <View
                style={{
                  marginTop: 16,
                  padding: 12,
                  backgroundColor: proximaParcela.status === "vencido" ? "#FEF2F2" : "#FFFBEB",
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: proximaParcela.status === "vencido" ? "#FECACA" : "#FDE68A",
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                  <View>
                    <Text
                      style={{
                        color: proximaParcela.status === "vencido" ? "#DC2626" : "#D97706",
                        fontSize: 12,
                        fontWeight: "600",
                      }}
                    >
                      {proximaParcela.status === "vencido" ? "⚠️ PARCELA VENCIDA" : "📅 PRÓXIMO VENCIMENTO"}
                    </Text>
                    <Text style={{ color: "#1F2937", fontSize: 14, fontWeight: "600", marginTop: 4 }}>
                      Parcela {proximaParcela.numero} - {proximaParcela.dataVencimento.toLocaleDateString("pt-BR")}
                    </Text>
                  </View>
                  <Text
                    style={{
                      color: proximaParcela.status === "vencido" ? "#DC2626" : "#D97706",
                      fontSize: 16,
                      fontWeight: "bold",
                    }}
                  >
                    R$ {proximaParcela.valor.toFixed(2)}
                  </Text>
                </View>
              </View>
            )}
          </View>
        </View>

        <View style={{ paddingHorizontal: 24, marginTop: 24, marginBottom: 12 }}>
          <Text style={{ color: colors.foreground, fontSize: 18, fontWeight: "bold" }}>
            Minhas Parcelas
          </Text>
        </View>

        <View style={{ paddingHorizontal: 24, paddingBottom: 24 }}>
          {parcelas.map((parcela) => renderParcela({ item: parcela }))}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
};

// Dashboard para Admin
const AdminDashboard = () => {
  const router = useRouter();
  const colors = useColors();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const stats = mockAdminStats; // CORREÇÃO: Usando mock direto sem estado desnecessário

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const onRefresh = useCallback(() => {
    setIsRefreshing(true);
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setTimeout(() => setIsRefreshing(false), 1000);
  }, []);

  if (isLoading) {
    return (
      <ScreenContainer>
        <View className="px-6 py-4">
          <SkeletonCard />
          <View className="mt-4">
            <SkeletonList count={4} />
          </View>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer edges={["left", "right"]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            tintColor="#059669"
          />
        }
      >
        <LinearGradient
          colors={["#059669", "#047857", "#065F46"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ paddingTop: 64, paddingBottom: 100, paddingHorizontal: 24 }}
        >
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
            <View>
              <Text style={{ color: "rgba(255,255,255,0.8)", fontSize: 16 }}>Bem-vindo,</Text>
              <Text style={{ color: "#fff", fontSize: 28, fontWeight: "bold", marginTop: 4 }}>
                {user?.nome || "Admin"}
              </Text>
              <View style={{ flexDirection: "row", alignItems: "center", marginTop: 8 }}>
                <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: "#86EFAC", marginRight: 8 }} />
                <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 14 }}>Administrador</Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => {
                if (Platform.OS !== "web") {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }
              }}
              style={{
                width: 48,
                height: 48,
                borderRadius: 24,
                backgroundColor: "rgba(255,255,255,0.2)",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={{ fontSize: 20 }}>🔔</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        <View style={{ paddingHorizontal: 24, marginTop: -64 }}>
          <View
            style={{
              backgroundColor: colors.surface,
              borderRadius: 20,
              padding: 20,
              marginBottom: 16,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.12,
              shadowRadius: 12,
              elevation: 8,
            }}
          >
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <View>
                <Text style={{ color: colors.muted, fontSize: 14 }}>💰 Valor Total Recebido</Text>
                <Text style={{ color: "#059669", fontSize: 32, fontWeight: "bold", marginTop: 4 }}>
                  R$ {stats.valorTotalRecebido.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </Text>
              </View>
              <View
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 28,
                  backgroundColor: "#D1FAE5",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text style={{ fontSize: 28 }}>💵</Text>
              </View>
            </View>
          </View>

          <View style={{ flexDirection: "row", gap: 12, marginBottom: 16 }}>
            <View
              style={{
                flex: 1,
                backgroundColor: colors.surface,
                borderRadius: 16,
                padding: 16,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.08,
                shadowRadius: 8,
                elevation: 4,
              }}
            >
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: "#D1FAE5",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 12,
                }}
              >
                <Text style={{ fontSize: 18 }}>✅</Text>
              </View>
              <Text style={{ color: colors.muted, fontSize: 12 }}>Pessoas que Pagaram</Text>
              <Text style={{ color: "#059669", fontSize: 28, fontWeight: "bold", marginTop: 4 }}>
                {stats.pessoasPagaram}
              </Text>
              <Text style={{ color: colors.muted, fontSize: 11, marginTop: 4 }}>
                {Math.round((stats.pessoasPagaram / (stats.totalAssociados || 1)) * 100)}% do total
              </Text>
            </View>

            <View
              style={{
                flex: 1,
                backgroundColor: colors.surface,
                borderRadius: 16,
                padding: 16,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.08,
                shadowRadius: 8,
                elevation: 4,
              }}
            >
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: "#FEE2E2",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 12,
                }}
              >
                <Text style={{ fontSize: 18 }}>❌</Text>
              </View>
              <Text style={{ color: colors.muted, fontSize: 12 }}>Pessoas que Não Pagaram</Text>
              <Text style={{ color: "#DC2626", fontSize: 28, fontWeight: "bold", marginTop: 4 }}>
                {stats.pessoasNaoPagaram}
              </Text>
              <Text style={{ color: colors.muted, fontSize: 11, marginTop: 4 }}>
                R$ {stats.valorTotalPendente.toLocaleString("pt-BR", { minimumFractionDigits: 2 })} pendente
              </Text>
            </View>
          </View>

          <View
            style={{
              backgroundColor: colors.surface,
              borderRadius: 16,
              padding: 16,
              marginBottom: 16,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.08,
              shadowRadius: 8,
              elevation: 4,
            }}
          >
            <View style={{ flexDirection: "row" }}>
              <View style={{ flex: 1, alignItems: "center", paddingVertical: 8 }}>
                <Text style={{ color: colors.muted, fontSize: 11 }}>Total Associados</Text>
                <Text style={{ color: colors.foreground, fontSize: 24, fontWeight: "bold", marginTop: 4 }}>
                  {stats.totalAssociados}
                </Text>
              </View>
              <View style={{ width: 1, backgroundColor: colors.border }} />
              <View style={{ flex: 1, alignItems: "center", paddingVertical: 8 }}>
                <Text style={{ color: colors.muted, fontSize: 11 }}>Ativos</Text>
                <Text style={{ color: "#059669", fontSize: 24, fontWeight: "bold", marginTop: 4 }}>
                  {stats.associadosAtivos}
                </Text>
              </View>
              <View style={{ width: 1, backgroundColor: colors.border }} />
              <View style={{ flex: 1, alignItems: "center", paddingVertical: 8 }}>
                <Text style={{ color: colors.muted, fontSize: 11 }}>Inadimplência</Text>
                <Text style={{ color: "#DC2626", fontSize: 24, fontWeight: "bold", marginTop: 4 }}>
                  {stats.inadimplencia}%
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={{ paddingHorizontal: 24, marginTop: 8 }}>
          <Text style={{ color: colors.foreground, fontSize: 18, fontWeight: "bold", marginBottom: 16 }}>
            Ações Rápidas
          </Text>
          <View style={{ flexDirection: "row", gap: 12 }}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                if (Platform.OS !== "web") {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }
                router.push("/associados/novo" as any);
              }}
              style={{ flex: 1, borderRadius: 16, overflow: "hidden" }}
            >
              <LinearGradient
                colors={["#059669", "#047857"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{ paddingVertical: 16, alignItems: "center" }}
              >
                <Text style={{ fontSize: 24, marginBottom: 8 }}>➕</Text>
                <Text style={{ color: "#fff", fontWeight: "600", fontSize: 13 }}>Novo Associado</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                if (Platform.OS !== "web") {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }
                router.push("/cobrancas" as any);
              }}
              style={{ flex: 1, borderRadius: 16, overflow: "hidden" }}
            >
              <LinearGradient
                colors={["#DC2626", "#B91C1C"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{ paddingVertical: 16, alignItems: "center" }}
              >
                <Text style={{ fontSize: 24, marginBottom: 8 }}>📄</Text>
                <Text style={{ color: "#fff", fontWeight: "600", fontSize: 13 }}>Gerar Boletos</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                if (Platform.OS !== "web") {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }
                router.push("/pagamentos" as any);
              }}
              style={{ flex: 1, borderRadius: 16, overflow: "hidden" }}
            >
              <LinearGradient
                colors={["#0EA5E9", "#0284C7"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{ paddingVertical: 16, alignItems: "center" }}
              >
                <Text style={{ fontSize: 24, marginBottom: 8 }}>💰</Text>
                <Text style={{ color: "#fff", fontWeight: "600", fontSize: 13 }}>Pagamentos</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ paddingHorizontal: 24, marginTop: 24, marginBottom: 24 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <Text style={{ color: colors.foreground, fontSize: 18, fontWeight: "bold" }}>
              Cobranças Recentes
            </Text>
            <TouchableOpacity onPress={() => router.push("/cobrancas" as any)} activeOpacity={0.7}>
              <Text style={{ color: "#059669", fontWeight: "600", fontSize: 14 }}>Ver todas →</Text>
            </TouchableOpacity>
          </View>

          {mockUltimasCobrancas.map((cobranca) => (
            <TouchableOpacity
              key={cobranca.id}
              activeOpacity={0.7}
              onPress={() => {
                if (Platform.OS !== "web") {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }
              }}
              style={{
                backgroundColor: colors.surface,
                borderRadius: 16,
                padding: 16,
                marginBottom: 12,
                flexDirection: "row",
                alignItems: "center",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.06,
                shadowRadius: 6,
                elevation: 3,
              }}
            >
              <View
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                  backgroundColor: cobranca.status === "vencido" ? "#FEE2E2" : "#FEF3C7",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 16,
                }}
              >
                <Text style={{ fontSize: 16, fontWeight: "bold", color: "#059669" }}>
                  {cobranca.nome.charAt(0)}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: colors.foreground, fontWeight: "600" }}>{cobranca.nome}</Text>
                <Text style={{ color: colors.muted, fontSize: 13, marginTop: 2 }}>
                  {cobranca.status === "vencido"
                    ? `${cobranca.dias} dias em atraso`
                    : `Vence em ${cobranca.dias} dias`}
                </Text>
              </View>
              <View style={{ alignItems: "flex-end" }}>
                <Text
                  style={{
                    fontWeight: "bold",
                    color: cobranca.status === "vencido" ? "#DC2626" : "#F59E0B",
                  }}
                >
                  R$ {cobranca.valor.toFixed(2)}
                </Text>
                <View
                  style={{
                    marginTop: 4,
                    paddingHorizontal: 8,
                    paddingVertical: 2,
                    borderRadius: 8,
                    backgroundColor: cobranca.status === "vencido" ? "#FEE2E2" : "#FEF3C7",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 11,
                      fontWeight: "500",
                      color: cobranca.status === "vencido" ? "#DC2626" : "#F59E0B",
                    }}
                  >
                    {cobranca.status === "vencido" ? "Vencido" : "Pendente"}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
};

export default function HomeScreen() {
  const { isAdmin } = useAuth();
  return isAdmin ? <AdminDashboard /> : <UserDashboard />;
}