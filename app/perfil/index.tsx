import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import * as ImagePicker from 'expo-image-picker';
import { ScreenContainer } from "@/components/screen-container";
import { useAuth } from "@/lib/auth-context";
import { useColors } from "@/hooks/use-colors";
import * as Haptics from "expo-haptics";

export default function PerfilScreen() {
  const router = useRouter();
  const colors = useColors();
  const { user, updateProfile, logout, isAdmin } = useAuth();

  const [userPhoto, setUserPhoto] = useState<string | null>(user?.avatar || null);

  // FUNÇÕES DE MÁSCARA PARA PRIVACIDADE
  const maskEmail = (email: string) => {
    if (!isAdmin || !email) return email;
    const [user, domain] = email.split("@");
    return `${user.substring(0, 2)}***@${domain}`;
  };

  const maskCPF = (cpf: string) => {
    if (!isAdmin || !cpf) return cpf;
    // Assume o formato 000.000.000-00
    return `${cpf.substring(0, 3)}.***.***${cpf.substring(11)}`;
  };

  const handleEscolherFoto = async () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert("Permissão negada", "Precisamos de acesso à galeria para trocar sua foto.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      const selectedUri = result.assets[0].uri;
      try {
        setUserPhoto(selectedUri);
        await updateProfile({ avatar: selectedUri });
        
        if (Platform.OS !== "web") {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
        Alert.alert("Sucesso", "Sua foto de perfil foi atualizada!");
      } catch {
        Alert.alert("Erro", "Não foi possível salvar sua foto.");
      }
    }
  };

  const handleExcluirConta = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }

    Alert.alert(
      "Excluir Conta",
      "Tem certeza que deseja excluir sua conta? Esta ação é irreversível.",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Excluir Permanentemente", 
          style: "destructive", 
          onPress: async () => {
            Alert.alert("Conta Excluída", "Sua conta foi removida com sucesso.");
            await logout();
            router.replace("/login");
          } 
        }
      ]
    );
  };

  const InfoCard = ({ label, value, icon }: { label: string; value: string; icon: string }) => (
    <View style={{ 
      backgroundColor: colors.surface, 
      padding: 16, 
      borderRadius: 16, 
      marginBottom: 12,
      borderWidth: 1,
      borderColor: colors.border
    }}>
      <Text style={{ fontSize: 11, color: colors.muted, marginBottom: 4, textTransform: 'uppercase', fontWeight: 'bold' }}>
        {icon} {label}
      </Text>
      <Text style={{ fontSize: 16, color: colors.foreground, fontWeight: '500' }}>{value}</Text>
    </View>
  );

  return (
    <ScreenContainer>
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        
        <ScrollView contentContainerStyle={{ padding: 24 }} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 32 }}>
            <TouchableOpacity onPress={() => router.back()} style={{ width: 40, height: 40, justifyContent: 'center' }}>
              <Text style={{ fontSize: 24, color: colors.foreground }}>←</Text>
            </TouchableOpacity>
            <Text style={{ fontSize: 24, fontWeight: 'bold', color: colors.foreground, marginLeft: 8 }}>Meu Perfil</Text>
          </View>

          {/* Avatar */}
          <View style={{ alignItems: 'center', marginBottom: 40 }}>
            <TouchableOpacity 
              onPress={handleEscolherFoto}
              activeOpacity={0.9}
            >
              <View style={{ 
                width: 120, 
                height: 120, 
                borderRadius: 60, 
                backgroundColor: '#059669', 
                alignItems: 'center', 
                justifyContent: 'center',
                borderWidth: 4,
                borderColor: colors.surface,
                overflow: 'hidden'
              }}>
                {userPhoto ? (
                  <Image source={{ uri: userPhoto }} style={{ width: '100%', height: '100%' }} />
                ) : (
                  <Text style={{ fontSize: 48, fontWeight: 'bold', color: '#fff' }}>
                    {user?.nome?.charAt(0).toUpperCase() || "U"}
                  </Text>
                )}
              </View>
            </TouchableOpacity>
            <Text style={{ marginTop: 12, color: colors.muted, fontSize: 13 }}>Toque na foto para alterar</Text>
          </View>

          {/* Dados Cadastrais com Máscara de Privacidade */}
          <Text style={{ fontSize: 13, fontWeight: "700", color: colors.muted, marginBottom: 12, textTransform: "uppercase" }}>
            Dados Cadastrais
          </Text>
          
          <InfoCard label="Nome Completo" value={user?.nome || "Não informado"} icon="👤" />
          <InfoCard label="E-mail" value={maskEmail(user?.email || "")} icon="✉️" />
          <InfoCard label="Função" value={user?.role === 'admin' ? 'Administrador' : 'Associado'} icon="🛡️" />
          <InfoCard label="CPF" value={maskCPF(user?.cpf || "")} icon="🆔" />

          {/* Segurança */}
          <Text style={{ fontSize: 13, fontWeight: "700", color: colors.muted, marginTop: 24, marginBottom: 12, textTransform: "uppercase" }}>
            Segurança
          </Text>
          
          <TouchableOpacity
            onPress={() => router.push("/perfil/alterar-senha" as any)}
            activeOpacity={0.7}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: colors.surface,
              padding: 16,
              borderRadius: 16,
              borderWidth: 1,
              borderColor: colors.border,
              marginBottom: 12
            }}
          >
            <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
              <Text style={{ fontSize: 18 }}>🔐</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 16, fontWeight: '600', color: colors.foreground }}>Alterar Minha Senha</Text>
              <Text style={{ fontSize: 12, color: colors.muted }}>Proteja sua conta</Text>
            </View>
            <Text style={{ color: colors.muted, fontSize: 18 }}>→</Text>
          </TouchableOpacity>

          {!isAdmin && (
            <TouchableOpacity
              onPress={handleExcluirConta}
              activeOpacity={0.7}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: colors.surface,
                padding: 16,
                borderRadius: 16,
                borderWidth: 1,
                borderColor: "#FCA5A5",
              }}
            >
              <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: "#FEE2E2", alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
                <Text style={{ fontSize: 18 }}>🗑️</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 16, fontWeight: '600', color: "#DC2626" }}>Excluir Conta</Text>
                <Text style={{ fontSize: 12, color: "#EF4444" }}>Apagar seus dados permanentemente</Text>
              </View>
            </TouchableOpacity>
          )}

          <View style={{ marginTop: 40, padding: 20, backgroundColor: colors.surface + '80', borderRadius: 12 }}>
            <Text style={{ fontSize: 12, color: colors.muted, textAlign: 'center', lineHeight: 18 }}>
              {isAdmin 
                ? "Como administrador, seus dados sensíveis estão parcialmente ocultos para sua segurança." 
                : "Dados sensíveis só podem ser alterados pela administração da AACB."}
            </Text>
          </View>

        </ScrollView>
      </View>
    </ScreenContainer>
  );
}