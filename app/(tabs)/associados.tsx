import { useState, useEffect, useCallback } from "react";
import {
  FlatList,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  RefreshControl,
  Platform,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { SkeletonList } from "@/components/loading";
import { Associado } from "@/lib/types";
import * as Haptics from "expo-haptics";

// Dados simulados
const mockAssociados: Associado[] = [
  {
    id: "1",
    nome: "João Silva",
    email: "joao@email.com",
    cpf: "123.456.789-00",
    telefone: "(11) 98888-8888",
    dataAdesao: new Date("2024-01-15"),
    status: "ativo",
  },
  {
    id: "2",
    nome: "Maria Santos",
    email: "maria@email.com",
    cpf: "987.654.321-00",
    telefone: "(11) 97777-7777",
    dataAdesao: new Date("2024-02-20"),
    status: "ativo",
  },
  {
    id: "3",
    nome: "Pedro Costa",
    email: "pedro@email.com",
    cpf: "456.789.123-00",
    telefone: "(11) 96666-6666",
    dataAdesao: new Date("2023-11-10"),
    status: "inativo",
  },
  {
    id: "4",
    nome: "Ana Oliveira",
    email: "ana@email.com",
    cpf: "321.654.987-00",
    telefone: "(11) 95555-5555",
    dataAdesao: new Date("2024-03-05"),
    status: "ativo",
  },
  {
    id: "5",
    nome: "Carlos Ferreira",
    email: "carlos@email.com",
    cpf: "789.123.456-00",
    telefone: "(11) 94444-4444",
    dataAdesao: new Date("2023-08-22"),
    status: "suspenso",
  },
];

type FilterStatus = "todos" | "ativo" | "inativo" | "suspenso";

export default function AssociadosScreen() {
  const router = useRouter();
  const colors = useColors();

  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [associados, setAssociados] = useState<Associado[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("todos");

  const loadData = useCallback(async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setAssociados(mockAssociados);
    } catch (error) {
      console.error("Erro ao carregar associados:", error);
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

  const filteredAssociados = associados.filter((a) => {
    const matchesSearch =
      a.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.cpf.includes(searchQuery);

    const matchesStatus = filterStatus === "todos" || a.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ativo":
        return colors.success;
      case "inativo":
        return colors.muted;
      case "suspenso":
        return colors.warning;
      default:
        return colors.muted;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "ativo":
        return "Ativo";
      case "inativo":
        return "Inativo";
      case "suspenso":
        return "Suspenso";
      default:
        return status;
    }
  };

  const handleDeleteAssociado = (associado: Associado) => {
    Alert.alert(
      "Excluir Associado",
      `Tem certeza que deseja excluir ${associado.nome}?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: () => {
            if (Platform.OS !== "web") {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            }
            setAssociados(associados.filter((a) => a.id !== associado.id));
            Alert.alert("Sucesso", "Associado excluído com sucesso!");
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
      className="px-4 py-2 rounded-full mr-2"
      style={{
        backgroundColor: filterStatus === value ? colors.primary : colors.surface,
        borderWidth: 1,
        borderColor: filterStatus === value ? colors.primary : colors.border,
      }}
    >
      <Text
        className="text-sm font-medium"
        style={{ color: filterStatus === value ? "#fff" : colors.foreground }}
      >
        {label} ({count})
      </Text>
    </TouchableOpacity>
  );

  const renderItem = ({ item }: { item: Associado }) => (
    <TouchableOpacity
      onPress={() => {
        if (Platform.OS !== "web") {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        router.push(`/associados/${item.id}` as any);
      }}
      onLongPress={() => {
        if (Platform.OS !== "web") {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        }
        Alert.alert(item.nome, "Escolha uma ação:", [
          { text: "Cancelar", style: "cancel" },
          {
            text: "Ver Detalhes",
            onPress: () => router.push(`/associados/${item.id}` as any),
          },
          {
            text: "Excluir",
            style: "destructive",
            onPress: () => handleDeleteAssociado(item),
          },
        ]);
      }}
      activeOpacity={0.7}
      className="bg-surface rounded-xl p-4 mb-3 border border-border"
    >
      <View className="flex-row items-center">
        <View
          className="w-12 h-12 rounded-full items-center justify-center mr-3"
          style={{ backgroundColor: colors.primary + "15" }}
        >
          <Text className="text-lg font-bold" style={{ color: colors.primary }}>
            {item.nome.charAt(0).toUpperCase()}
          </Text>
        </View>
        <View className="flex-1">
          <View className="flex-row justify-between items-start">
            <Text className="text-base font-semibold text-foreground">{item.nome}</Text>
            <View
              className="rounded-full px-2 py-0.5"
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
          <Text className="text-sm text-muted mt-1">{item.email}</Text>
          <Text className="text-xs text-muted mt-0.5">{item.cpf}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const counts = {
    todos: associados.length,
    ativo: associados.filter((a) => a.status === "ativo").length,
    inativo: associados.filter((a) => a.status === "inativo").length,
    suspenso: associados.filter((a) => a.status === "suspenso").length,
  };

  return (
    <ScreenContainer className="bg-background">
      {/* Header */}
      <View className="px-6 py-4">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-2xl font-bold text-foreground">Associados</Text>
          <TouchableOpacity
            onPress={() => {
              if (Platform.OS !== "web") {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }
              router.push("/associados/novo" as any);
            }}
            activeOpacity={0.7}
            className="rounded-full px-4 py-2"
            style={{ backgroundColor: colors.primary }}
          >
            <Text className="text-white font-semibold">+ Novo</Text>
          </TouchableOpacity>
        </View>

        {/* Search */}
        <TextInput
          placeholder="Buscar por nome, email ou CPF..."
          placeholderTextColor={colors.muted}
          value={searchQuery}
          onChangeText={setSearchQuery}
          className="rounded-xl px-4 py-3 text-base mb-4"
          style={{
            color: colors.foreground,
            backgroundColor: colors.surface,
            borderWidth: 1,
            borderColor: colors.border,
          }}
        />

        {/* Filters */}
        <View className="flex-row mb-2">
          <FilterButton label="Todos" value="todos" count={counts.todos} />
          <FilterButton label="Ativos" value="ativo" count={counts.ativo} />
          <FilterButton label="Inativos" value="inativo" count={counts.inativo} />
        </View>
      </View>

      {/* List */}
      {isLoading ? (
        <View className="px-6">
          <SkeletonList count={5} />
        </View>
      ) : (
        <FlatList
          data={filteredAssociados}
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
              <Text className="text-4xl mb-4">🔍</Text>
              <Text className="text-base text-muted text-center">
                {searchQuery
                  ? "Nenhum associado encontrado"
                  : "Nenhum associado cadastrado"}
              </Text>
            </View>
          }
        />
      )}
    </ScreenContainer>
  );
}
