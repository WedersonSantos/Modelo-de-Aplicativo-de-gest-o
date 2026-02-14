import { useState, useEffect } from "react";
import {
  ScrollView,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { Associado } from "@/lib/types";
import * as Haptics from "expo-haptics";

const mockAssociados: Associado[] = [
  {
    id: "1",
    nome: "João Silva",
    email: "joao@example.com",
    cpf: "123.456.789-00",
    dataAdesao: new Date("2023-01-15"),
    status: "ativo",
  },
  {
    id: "2",
    nome: "Maria Santos",
    email: "maria@example.com",
    cpf: "987.654.321-00",
    dataAdesao: new Date("2023-03-20"),
    status: "ativo",
  },
  {
    id: "3",
    nome: "Pedro Costa",
    email: "pedro@example.com",
    cpf: "456.789.123-00",
    dataAdesao: new Date("2022-06-10"),
    status: "ativo",
  },
  {
    id: "4",
    nome: "Ana Oliveira",
    email: "ana@example.com",
    cpf: "789.123.456-00",
    dataAdesao: new Date("2023-11-05"),
    status: "inativo",
  },
];

export default function AssociadosScreen() {
  const router = useRouter();
  const colors = useColors();
  const [searchText, setSearchText] = useState("");
  const [filterStatus, setFilterStatus] = useState<"todos" | "ativo" | "inativo">("todos");
  const [associados] = useState<Associado[]>(mockAssociados);
  const [filteredAssociados, setFilteredAssociados] = useState<Associado[]>(mockAssociados);

  useEffect(() => {
    filterAssociados();
  }, [searchText, filterStatus]);

  const filterAssociados = () => {
    let filtered = associados;

    if (filterStatus !== "todos") {
      filtered = filtered.filter((a) => a.status === filterStatus);
    }

    if (searchText) {
      filtered = filtered.filter(
        (a) =>
          a.nome.toLowerCase().includes(searchText.toLowerCase()) ||
          a.email.toLowerCase().includes(searchText.toLowerCase()) ||
          a.cpf.includes(searchText)
      );
    }

    setFilteredAssociados(filtered);
  };

  const handleAssociadoPress = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(`./${id}` as any);
  };

  const handleNovoAssociado = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push("./novo" as any);
  };

  return (
    <ScreenContainer className="bg-background">
      {/* Header */}
      <View className="px-6 py-4 border-b border-border">
        <Text className="text-2xl font-bold text-foreground">Associados</Text>
        <Text className="text-sm text-muted mt-1">
          {filteredAssociados.length} de {associados.length}
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {/* Search Bar */}
        <View className="px-6 py-4 gap-3">
          <TextInput
            placeholder="Buscar por nome, email ou CPF..."
            placeholderTextColor={colors.muted}
            value={searchText}
            onChangeText={setSearchText}
            className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
            style={{
              color: colors.foreground,
              borderColor: colors.border,
              backgroundColor: colors.surface,
            }}
          />

          {/* Filter Buttons */}
          <View className="flex-row gap-2">
            {(["todos", "ativo", "inativo"] as const).map((status) => (
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
                className="flex-1 border rounded-lg py-2 px-3"
              >
                <Text
                  className="text-xs font-semibold text-center"
                  style={{
                    color: filterStatus === status ? "white" : colors.foreground,
                  }}
                >
                  {status === "todos"
                    ? "Todos"
                    : status === "ativo"
                      ? "Ativos"
                      : "Inativos"}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Associados List */}
        <View className="px-6">
          {filteredAssociados.length > 0 ? (
            <FlatList
              scrollEnabled={false}
              data={filteredAssociados}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => handleAssociadoPress(item.id)}
                  activeOpacity={0.7}
                  className="bg-surface rounded-lg p-4 mb-3 border border-border"
                >
                  <View className="flex-row justify-between items-start">
                    <View className="flex-1">
                      <Text className="text-sm font-semibold text-foreground">
                        {item.nome}
                      </Text>
                      <Text className="text-xs text-muted mt-1">{item.email}</Text>
                      <Text className="text-xs text-muted mt-1">{item.cpf}</Text>
                    </View>
                    <View
                      style={{
                        backgroundColor:
                          item.status === "ativo" ? colors.success + "20" : colors.error + "20",
                      }}
                      className="rounded px-2 py-1"
                    >
                      <Text
                        className="text-xs font-semibold"
                        style={{
                          color: item.status === "ativo" ? colors.success : colors.error,
                        }}
                      >
                        {item.status === "ativo" ? "Ativo" : "Inativo"}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              )}
            />
          ) : (
            <View className="py-8 items-center">
              <Text className="text-sm text-muted">Nenhum associado encontrado</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity
        onPress={handleNovoAssociado}
        activeOpacity={0.8}
        style={{
          backgroundColor: colors.primary,
          position: "absolute",
          bottom: 30,
          right: 20,
          width: 56,
          height: 56,
          borderRadius: 28,
          justifyContent: "center",
          alignItems: "center",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
        }}
      >
        <Text className="text-2xl text-white font-bold">+</Text>
      </TouchableOpacity>
    </ScreenContainer>
  );
}
