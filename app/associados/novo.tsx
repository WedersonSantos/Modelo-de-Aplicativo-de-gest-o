import { useState } from "react";
import {
  ScrollView,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import * as Haptics from "expo-haptics";

export default function NovoAssociadoScreen() {
  const router = useRouter();
  const colors = useColors();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");
  const [status, setStatus] = useState<"ativo" | "inativo">("ativo");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSalvar = async () => {
    if (!nome || !email || !cpf) {
      Alert.alert("Erro", "Por favor, preencha todos os campos");
      return;
    }

    setIsSubmitting(true);
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      // Simular salvamento
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert("Sucesso", "Associado adicionado com sucesso!");
      router.back();
    } catch (error) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert("Erro", "Falha ao adicionar associado");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScreenContainer className="bg-background">
      {/* Header */}
      <View className="px-6 py-4 border-b border-border">
        <Text className="text-2xl font-bold text-foreground">Novo Associado</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
        {/* Formulário */}
        <View className="px-6 py-4 gap-4">
          {/* Nome */}
          <View className="gap-2">
            <Text className="text-sm font-semibold text-foreground">Nome *</Text>
            <TextInput
              placeholder="Digite o nome completo"
              placeholderTextColor={colors.muted}
              value={nome}
              onChangeText={setNome}
              editable={!isSubmitting}
              className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
              style={{
                color: colors.foreground,
                borderColor: colors.border,
                backgroundColor: colors.surface,
              }}
            />
          </View>

          {/* Email */}
          <View className="gap-2">
            <Text className="text-sm font-semibold text-foreground">Email *</Text>
            <TextInput
              placeholder="email@example.com"
              placeholderTextColor={colors.muted}
              value={email}
              onChangeText={setEmail}
              editable={!isSubmitting}
              keyboardType="email-address"
              autoCapitalize="none"
              className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
              style={{
                color: colors.foreground,
                borderColor: colors.border,
                backgroundColor: colors.surface,
              }}
            />
          </View>

          {/* CPF */}
          <View className="gap-2">
            <Text className="text-sm font-semibold text-foreground">CPF *</Text>
            <TextInput
              placeholder="000.000.000-00"
              placeholderTextColor={colors.muted}
              value={cpf}
              onChangeText={setCpf}
              editable={!isSubmitting}
              className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
              style={{
                color: colors.foreground,
                borderColor: colors.border,
                backgroundColor: colors.surface,
              }}
            />
          </View>

          {/* Status */}
          <View className="gap-2">
            <Text className="text-sm font-semibold text-foreground">Status</Text>
            <View className="flex-row gap-2">
              {(["ativo", "inativo"] as const).map((s) => (
                <TouchableOpacity
                  key={s}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setStatus(s);
                  }}
                  activeOpacity={0.7}
                  style={{
                    backgroundColor: status === s ? colors.primary : colors.surface,
                    borderColor: colors.border,
                  }}
                  className="flex-1 border rounded-lg py-3 px-3"
                >
                  <Text
                    className="text-sm font-semibold text-center"
                    style={{
                      color: status === s ? "white" : colors.foreground,
                    }}
                  >
                    {s === "ativo" ? "Ativo" : "Inativo"}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Botões */}
          <View className="gap-3 mt-4">
            <TouchableOpacity
              onPress={handleSalvar}
              disabled={isSubmitting}
              activeOpacity={0.7}
              style={{
                backgroundColor: colors.primary,
                opacity: isSubmitting ? 0.6 : 1,
              }}
              className="rounded-lg py-3 px-4"
            >
              <Text className="text-white font-semibold text-center">
                {isSubmitting ? "Salvando..." : "Salvar"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.back()}
              disabled={isSubmitting}
              activeOpacity={0.7}
              className="bg-surface border border-border rounded-lg py-3 px-4"
            >
              <Text className="text-foreground font-semibold text-center">
                Cancelar
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
