import { useState, useEffect } from "react";
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { useColors } from "@/hooks/use-colors";
import { useAuth } from "@/lib/auth-context";
import { LoadingOverlay } from "@/components/loading";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withDelay,
  withSequence,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";

export default function LoginScreen() {
  const router = useRouter();
  const colors = useColors();
  const { login, user, isSignedIn } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  // Animações
  const logoScale = useSharedValue(0);
  const formOpacity = useSharedValue(0);
  const formTranslateY = useSharedValue(50);
  const shakeX = useSharedValue(0);

  // REDIRECIONAMENTO AUTOMÁTICO: Observa mudanças no estado de autenticação
  useEffect(() => {
    if (isSignedIn || user) {
      router.replace("/(tabs)");
    }
  }, [isSignedIn, user, router]);

  // Inicialização das animações
  useEffect(() => {
    logoScale.value = withSpring(1, { damping: 12 });
    formOpacity.value = withDelay(300, withTiming(1, { duration: 500 }));
    formTranslateY.value = withDelay(300, withSpring(0, { damping: 15 }));
  }, [logoScale, formOpacity, formTranslateY]);

  const logoStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value }],
  }));

  const formStyle = useAnimatedStyle(() => ({
    opacity: formOpacity.value,
    transform: [{ translateY: formTranslateY.value }, { translateX: shakeX.value }],
  }));

  const shakeForm = () => {
    shakeX.value = withSequence(
      withTiming(-10, { duration: 50 }),
      withTiming(10, { duration: 50 }),
      withTiming(-10, { duration: 50 }),
      withTiming(10, { duration: 50 }),
      withTiming(0, { duration: 50 })
    );
  };

  const validate = () => {
    const newErrors: { email?: string; password?: string } = {};
    if (!email) {
      newErrors.email = "Email é obrigatório";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Email inválido";
    }
    if (!password) {
      newErrors.password = "Senha é obrigatória";
    } else if (password.length < 6) {
      newErrors.password = "Senha deve ter pelo menos 6 caracteres";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) {
      shakeForm();
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

      await login(email, password);

      if (Platform.OS !== "web") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      
      // O useEffect no topo do arquivo cuidará do router.replace
    } catch (error: any) {
      console.error("Erro no login:", error);
      shakeForm();
      if (Platform.OS !== "web") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
      Alert.alert("Erro de Acesso", "E-mail ou senha inválidos.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <LoadingOverlay visible={isLoading} message="Entrando..." />

      <LinearGradient
        colors={["#059669", "#047857", "#065F46"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0 }}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={{ flex: 1, justifyContent: "center", paddingHorizontal: 32, paddingVertical: 48 }}>
            <Animated.View style={[logoStyle, { alignItems: "center", marginBottom: 48 }]}>
              <View
                style={{
                  width: 96,
                  height: 96,
                  borderRadius: 24,
                  backgroundColor: "rgba(255,255,255,0.2)",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 24,
                }}
              >
                <Text style={{ fontSize: 48 }}>🏢</Text>
              </View>
              <Text style={{ color: "#fff", fontSize: 30, fontWeight: "bold" }}>
                AACB Gestão
              </Text>
            </Animated.View>

            <Animated.View style={formStyle}>
              <View
                style={{
                  backgroundColor: colors.surface,
                  borderRadius: 24,
                  padding: 24,
                  elevation: 12,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 8 },
                  shadowOpacity: 0.15,
                  shadowRadius: 24,
                }}
              >
                <Text
                  style={{
                    color: colors.foreground,
                    fontSize: 20,
                    fontWeight: "bold",
                    textAlign: "center",
                    marginBottom: 24,
                  }}
                >
                  Entrar na sua conta
                </Text>

                {/* Campo Email */}
                <View style={{ marginBottom: 16 }}>
                  <Text style={{ color: colors.muted, fontSize: 14, fontWeight: "500", marginBottom: 8 }}>
                    Email
                  </Text>
                  <View
                    style={{
                      borderRadius: 12,
                      borderWidth: 1.5,
                      borderColor: errors.email ? "#DC2626" : colors.border,
                      backgroundColor: colors.background,
                    }}
                  >
                    <TextInput
                      value={email}
                      onChangeText={(text) => {
                        setEmail(text);
                        setErrors({ ...errors, email: undefined });
                      }}
                      placeholder="seu@email.com"
                      placeholderTextColor={colors.muted}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoCorrect={false}
                      style={{
                        paddingHorizontal: 16,
                        paddingVertical: 16,
                        fontSize: 16,
                        color: colors.foreground,
                      }}
                    />
                  </View>
                  {errors.email && (
                    <Text style={{ color: "#DC2626", fontSize: 12, marginTop: 4 }}>{errors.email}</Text>
                  )}
                </View>

                {/* Campo Senha */}
                <View style={{ marginBottom: 16 }}>
                  <Text style={{ color: colors.muted, fontSize: 14, fontWeight: "500", marginBottom: 8 }}>
                    Senha
                  </Text>
                  <View
                    style={{
                      borderRadius: 12,
                      borderWidth: 1.5,
                      borderColor: errors.password ? "#DC2626" : colors.border,
                      flexDirection: "row",
                      alignItems: "center",
                      backgroundColor: colors.background,
                    }}
                  >
                    <TextInput
                      value={password}
                      onChangeText={(text) => {
                        setPassword(text);
                        setErrors({ ...errors, password: undefined });
                      }}
                      placeholder="••••••••"
                      placeholderTextColor={colors.muted}
                      secureTextEntry={!showPassword}
                      style={{
                        flex: 1,
                        paddingHorizontal: 16,
                        paddingVertical: 16,
                        fontSize: 16,
                        color: colors.foreground,
                      }}
                    />
                    <TouchableOpacity
                      onPress={() => setShowPassword(!showPassword)}
                      style={{ paddingHorizontal: 16 }}
                    >
                      <Text style={{ fontSize: 20 }}>{showPassword ? "🙈" : "👁️"}</Text>
                    </TouchableOpacity>
                  </View>
                  {errors.password && (
                    <Text style={{ color: "#DC2626", fontSize: 12, marginTop: 4 }}>{errors.password}</Text>
                  )}
                </View>

                <TouchableOpacity
                  onPress={handleLogin}
                  disabled={isLoading}
                  activeOpacity={0.8}
                  style={{ borderRadius: 12, overflow: "hidden", marginTop: 8 }}
                >
                  <LinearGradient
                    colors={["#059669", "#047857"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={{ paddingVertical: 16, alignItems: "center" }}
                  >
                    <Text style={{ color: "#fff", fontSize: 18, fontWeight: "bold" }}>
                      {isLoading ? "Entrando..." : "Entrar"}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>

                {/* BOTÃO DE CADASTRO */}
                <TouchableOpacity 
                  onPress={() => router.push("/cadastro" as any)}
                  style={{ marginTop: 20, alignItems: "center" }}
                >
                  <Text style={{ color: colors.muted, fontSize: 14 }}>
                    Não tem uma conta? <Text style={{ color: "#059669", fontWeight: "bold" }}>Cadastre-se</Text>
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Credenciais Rápidas */}
              <View style={{ marginTop: 32, padding: 16, borderRadius: 16, backgroundColor: "rgba(255,255,255,0.1)" }}>
                <Text style={{ color: "#fff", textAlign: "center", marginBottom: 12, fontSize: 13, fontWeight: "600" }}>
                   Credenciais Rápidas
                </Text>
                <View style={{ flexDirection: "row", justifyContent: "center", gap: 12 }}>
                  <TouchableOpacity
                    onPress={() => { setEmail("admin@aacb.com"); setPassword("admin123"); }}
                    style={{ backgroundColor: "rgba(255,255,255,0.2)", borderRadius: 8, padding: 10, flex: 1, alignItems: "center" }}
                  >
                    <Text style={{ color: "#fff", fontSize: 12 }}>👨‍💼 Admin</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => { setEmail("usuario@aacb.com"); setPassword("user123"); }}
                    style={{ backgroundColor: "rgba(255,255,255,0.2)", borderRadius: 8, padding: 10, flex: 1, alignItems: "center" }}
                  >
                    <Text style={{ color: "#fff", fontSize: 12 }}>👤 Usuário</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Animated.View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}