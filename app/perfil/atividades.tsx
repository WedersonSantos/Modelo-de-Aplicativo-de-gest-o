import { useState, useEffect, useCallback } from "react";
import {
  FlatList,
  Text,
  View,
  TouchableOpacity,
  RefreshControl,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useAuth } from "@/lib/auth-context";
import { SkeletonList } from "@/components/loading";
import { AtividadeLog } from "@/lib/types";
import * as Haptics from "expo-haptics";

// Dados simulados
const mockAtividades: AtividadeLog[] = [
  {
    id: "1",
    userId: "1",
    acao: "Login",
    descricao: "Login realizado com sucesso",
    data: new Date(),
    dispositivo: "iPhone 15 Pro",
  },
  {
    id: "2",
    userId: "1",
    acao: "Perfil",
    descricao: "Perfil atualizado",
    data: new Date(Date.now() - 1000 * 60 * 60 * 2),
    dispositivo: "iPhone 15 Pro",
  },
  {
    id: "3",
    userId: "1",
    acao: "Pagamento",
    descricao: "Pagamento de R$ 150,00 registrado",
    data: new Date(Date.now() - 1000 * 60 * 60 * 24),
    dispositivo: "Web Browser",
  },
  {
    id: "4",
    userId: "1",
    acao: "Login",
    descricao: "Login realizado com sucesso",
    data: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
    dispositivo: "Android",
  },
  {
    id: "5",
    userId: "1",
    acao: "Senha",
    descricao: "Senha alterada com sucesso",
    data: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
    dispositivo: "iPhone 15 Pro",
  },
  {
    id: "6",
    userId: "1",
    acao: "Boleto",
    descricao: "Boleto gerado - Ref: Fevereiro/2024",
    data: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
    dispositivo: "Web Browser",
  },
];

export default function AtividadesScreen() {
  const router = useRouter();
  const colors = useColors();
  const { user } = useAuth();

  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [atividades, setAtividades] = useState<AtividadeLog[]>([]);

  const loadData = useCallback(async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setAtividades(mockAtividades);
    } catch (error) {
      console.error("Erro ao carregar atividades:", error);
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

  const getAcaoIcon = (acao: string) => {
    switch (acao.toLowerCase()) {
      case "login":
        return "🔐";
      case "perfil":
        return "👤";
      case "pagamento":
        return "💰";
      case "senha":
        return "🔑";
      case "boleto":
        return "📄";
      default:
        return "📋";
    }
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (hours < 1) {
      return "Agora mesmo";
    } else if (hours < 24) {
      return `Há ${hours}h`;
    } else if (days < 7) {
      return `Há ${days} dia${days > 1 ? "s" : ""}`;
    } else {
      return date.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "short",
      });
    }
  };

  const renderItem = ({ item }: { item: AtividadeLog }) => (
    <View className="bg-surface rounded-xl p-4 mb-3 border border-border">
      <View className="flex-row items-start">
        <View
          className="w-10 h-10 rounded-full items-center justify-center mr-3"
          style={{ backgroundColor: colors.primary + "15" }}
        >
          <Text className="text-lg">{getAcaoIcon(item.acao)}</Text>
        </View>
        <View className="flex-1">
          <View className="flex-row justify-between items-start">
            <Text className="text-sm font-semibold text-foreground">{item.acao}</Text>
            <Text className="text-xs text-muted">{formatDate(item.data)}</Text>
          </View>
          <Text className="text-sm text-muted mt-1">{item.descricao}</Text>
          {item.dispositivo && (
            <Text className="text-xs text-muted mt-2">📱 {item.dispositivo}</Text>
          )}
        </View>
      </View>
    </View>
  );

  return (
    <ScreenContainer className="bg-background">
      {/* Header */}
      <View className="flex-row items-center justify-between px-6 py-4 border-b border-border">
        <TouchableOpacity
          onPress={() => router.back()}
          activeOpacity={0.7}
          className="py-2"
        >
          <Text style={{ color: colors.primary }} className="text-base font-semibold">
            ← Voltar
          </Text>
        </TouchableOpacity>
        <Text className="text-lg font-bold text-foreground">Atividades</Text>
        <View className="w-16" />
      </View>

      {isLoading ? (
        <View className="px-6 py-4">
          <SkeletonList count={6} />
        </View>
      ) : (
        <FlatList
          data={atividades}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 16 }}
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
              <Text className="text-4xl mb-4">📋</Text>
              <Text className="text-base text-muted text-center">
                Nenhuma atividade registrada
              </Text>
            </View>
          }
        />
      )}
    </ScreenContainer>
  );
}
