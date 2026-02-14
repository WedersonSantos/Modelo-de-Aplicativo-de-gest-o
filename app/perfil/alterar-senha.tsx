import { useState } from "react";
import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Alert,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useAuth } from "@/lib/auth-context";
import { LoadingOverlay } from "@/components/loading";
import * as Haptics from "expo-haptics";

export default function AlterarSenhaScreen() {
  const router = useRouter();
  const colors = useColors();
  const { updatePassword } = useAuth();

  const [isLoading, setIsLoading] = useState(false);
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [showSenhaAtual, setShowSenhaAtual] = useState(false);
  const [showNovaSenha, setShowNovaSenha] = useState(false);
  const [showConfirmarSenha, setShowConfirmarSenha] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!senhaAtual) {
      newErrors.senhaAtual = "Informe a senha atual";
    }

    if (!novaSenha) {
      newErrors.novaSenha = "Informe a nova senha";
    } else if (novaSenha.length < 6) {
      newErrors.novaSenha = "A senha deve ter pelo menos 6 caracteres";
    }

    if (!confirmarSenha) {
      newErrors.confirmarSenha = "Confirme a nova senha";
    } else if (novaSenha !== confirmarSenha) {
      newErrors.confirmarSenha = "As senhas não coincidem";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) {
      if (Platform.OS !== "web") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
      return;
    }

    setIsLoading(true);
    try {
      if (Platform.OS !== "web") {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }

      await updatePassword(senhaAtual, novaSenha);

      if (Platform.OS !== "web") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }

      Alert.alert("Sucesso", "Senha alterada com sucesso!", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (error: any) {
      if (Platform.OS !== "web") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
      Alert.alert("Erro", error.message || "Erro ao alterar senha");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScreenContainer className="bg-background">
      <LoadingOverlay visible={isLoading} message="Alterando senha..." />

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
        <Text className="text-lg font-bold text-foreground">Alterar Senha</Text>
        <View className="w-16" />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="px-6 py-6">
          {/* Instruções */}
          <View
            className="rounded-xl p-4 mb-6"
            style={{ backgroundColor: colors.primary + "10" }}
          >
            <Text className="text-sm" style={{ color: colors.primary }}>
              Para sua segurança, informe sua senha atual e depois escolha uma nova senha com pelo menos 6 caracteres.
            </Text>
          </View>

          {/* Senha Atual */}
          <View className="mb-4">
            <Text className="text-sm font-semibold text-foreground mb-2">Senha Atual</Text>
            <View className="relative">
              <TextInput
                value={senhaAtual}
                onChangeText={(text) => {
                  setSenhaAtual(text);
                  setErrors({ ...errors, senhaAtual: "" });
                }}
                placeholder="••••••••"
                placeholderTextColor={colors.muted}
                secureTextEntry={!showSenhaAtual}
                className="rounded-xl px-4 py-4 pr-12 text-base"
                style={{
                  color: colors.foreground,
                  backgroundColor: colors.surface,
                  borderWidth: 1,
                  borderColor: errors.senhaAtual ? colors.error : colors.border,
                }}
              />
              <TouchableOpacity
                onPress={() => setShowSenhaAtual(!showSenhaAtual)}
                className="absolute right-4 top-4"
                activeOpacity={0.7}
              >
                <Text style={{ color: colors.muted }}>
                  {showSenhaAtual ? "🙈" : "👁️"}
                </Text>
              </TouchableOpacity>
            </View>
            {errors.senhaAtual && (
              <Text className="text-xs mt-1" style={{ color: colors.error }}>
                {errors.senhaAtual}
              </Text>
            )}
          </View>

          {/* Nova Senha */}
          <View className="mb-4">
            <Text className="text-sm font-semibold text-foreground mb-2">Nova Senha</Text>
            <View className="relative">
              <TextInput
                value={novaSenha}
                onChangeText={(text) => {
                  setNovaSenha(text);
                  setErrors({ ...errors, novaSenha: "" });
                }}
                placeholder="••••••••"
                placeholderTextColor={colors.muted}
                secureTextEntry={!showNovaSenha}
                className="rounded-xl px-4 py-4 pr-12 text-base"
                style={{
                  color: colors.foreground,
                  backgroundColor: colors.surface,
                  borderWidth: 1,
                  borderColor: errors.novaSenha ? colors.error : colors.border,
                }}
              />
              <TouchableOpacity
                onPress={() => setShowNovaSenha(!showNovaSenha)}
                className="absolute right-4 top-4"
                activeOpacity={0.7}
              >
                <Text style={{ color: colors.muted }}>
                  {showNovaSenha ? "🙈" : "👁️"}
                </Text>
              </TouchableOpacity>
            </View>
            {errors.novaSenha && (
              <Text className="text-xs mt-1" style={{ color: colors.error }}>
                {errors.novaSenha}
              </Text>
            )}
          </View>

          {/* Confirmar Nova Senha */}
          <View className="mb-6">
            <Text className="text-sm font-semibold text-foreground mb-2">Confirmar Nova Senha</Text>
            <View className="relative">
              <TextInput
                value={confirmarSenha}
                onChangeText={(text) => {
                  setConfirmarSenha(text);
                  setErrors({ ...errors, confirmarSenha: "" });
                }}
                placeholder="••••••••"
                placeholderTextColor={colors.muted}
                secureTextEntry={!showConfirmarSenha}
                className="rounded-xl px-4 py-4 pr-12 text-base"
                style={{
                  color: colors.foreground,
                  backgroundColor: colors.surface,
                  borderWidth: 1,
                  borderColor: errors.confirmarSenha ? colors.error : colors.border,
                }}
              />
              <TouchableOpacity
                onPress={() => setShowConfirmarSenha(!showConfirmarSenha)}
                className="absolute right-4 top-4"
                activeOpacity={0.7}
              >
                <Text style={{ color: colors.muted }}>
                  {showConfirmarSenha ? "🙈" : "👁️"}
                </Text>
              </TouchableOpacity>
            </View>
            {errors.confirmarSenha && (
              <Text className="text-xs mt-1" style={{ color: colors.error }}>
                {errors.confirmarSenha}
              </Text>
            )}
          </View>

          {/* Botão Salvar */}
          <TouchableOpacity
            onPress={handleSave}
            disabled={isLoading}
            activeOpacity={0.8}
            className="rounded-xl py-4 px-4"
            style={{
              backgroundColor: colors.primary,
              opacity: isLoading ? 0.7 : 1,
            }}
          >
            <Text className="text-white font-bold text-center text-base">
              {isLoading ? "Alterando..." : "Alterar Senha"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
