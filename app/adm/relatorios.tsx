import React from "react";
import { View, Text, ScrollView, TouchableOpacity, Dimensions } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");

export default function RelatoriosScreen() {
  const router = useRouter();
  const colors = useColors();

  const stats = [
    { label: "Total Associados", value: "1,248", icon: "👥", color: "#3B82F6" },
    { label: "Novos este mês", value: "+42", icon: "📈", color: "#10B981" },
    { label: "Inadimplência", value: "3.2%", icon: "⚠️", color: "#EF4444" },
    { label: "Receita Mensal", value: "R$ 12.4k", icon: "💰", color: "#F59E0B" },
  ];

  // Nomes dos meses para tornar o gráfico legível
  const meses = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul"];
  const dadosGrafico = [40, 60, 45, 80, 55, 95, 70];

  const StatCard = ({ item }: { item: typeof stats[0] }) => (
    <View style={{
      backgroundColor: colors.surface,
      width: (width - 64) / 2,
      padding: 16,
      borderRadius: 20,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: colors.border,
      elevation: 2,
    }}>
      <View style={{ backgroundColor: item.color + '20', width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
        <Text style={{ fontSize: 18 }}>{item.icon}</Text>
      </View>
      <Text style={{ color: colors.muted, fontSize: 11, fontWeight: '700', textTransform: 'uppercase' }}>{item.label}</Text>
      <Text style={{ color: colors.foreground, fontSize: 20, fontWeight: 'bold', marginTop: 4 }}>{item.value}</Text>
    </View>
  );

  return (
    <ScreenContainer>
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <ScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
          
          <LinearGradient
            colors={["#065F46", "#047857"]}
            style={{ padding: 24, paddingTop: 60, borderBottomLeftRadius: 32, borderBottomRightRadius: 32 }}
          >
            <TouchableOpacity onPress={() => router.back()} style={{ marginBottom: 16 }}>
              <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>← Voltar</Text>
            </TouchableOpacity>
            <Text style={{ color: "#fff", fontSize: 28, fontWeight: "bold" }}>Painel Analítico</Text>
            <Text style={{ color: "rgba(255,255,255,0.8)", fontSize: 14 }}>Resumo geral da AACB em tempo real</Text>
          </LinearGradient>

          <View style={{ padding: 24, marginTop: 8 }}>
            <Text style={{ color: colors.foreground, fontSize: 18, fontWeight: 'bold', marginBottom: 16 }}>Visão Geral</Text>
            
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
              {stats.map((item, index) => <StatCard key={index} item={item} />)}
            </View>

            {/* Gráfico de Barras com nomes dos meses */}
            <View style={{ 
              marginTop: 16, 
              backgroundColor: colors.surface, 
              padding: 20, 
              borderRadius: 24, 
              borderWidth: 1, 
              borderColor: colors.border,
              overflow: 'hidden' 
            }}>
              <Text style={{ color: colors.foreground, fontSize: 16, fontWeight: 'bold', marginBottom: 24 }}>Crescimento de Associados</Text>
              
              <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', height: 140 }}>
                {dadosGrafico.map((h, i) => (
                  <View key={i} style={{ alignItems: 'center', flex: 1 }}>
                    {/* Tooltip simulado (valor acima da barra) */}
                    <Text style={{ color: colors.muted, fontSize: 9, marginBottom: 4 }}>{h}</Text>
                    <View style={{ 
                      height: h, 
                      width: '70%', 
                      backgroundColor: i === dadosGrafico.length - 1 ? '#10B981' : '#059669', 
                      borderRadius: 6,
                      opacity: i === dadosGrafico.length - 1 ? 1 : 0.6
                    }} />
                    <Text style={{ color: colors.muted, fontSize: 10, marginTop: 8, fontWeight: '600' }}>
                      {meses[i]}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Insight de Inadimplência */}
            <TouchableOpacity style={{ 
              marginTop: 20, 
              backgroundColor: '#FEF2F2', 
              padding: 16, 
              borderRadius: 16, 
              flexDirection: 'row', 
              alignItems: 'center', 
              borderWidth: 1, 
              borderColor: '#FCA5A5' 
            }}>
              <Text style={{ fontSize: 20, marginRight: 12 }}>🚩</Text>
              <View style={{ flex: 1 }}>
                <Text style={{ color: '#991B1B', fontWeight: 'bold', fontSize: 14 }}>Atenção Financeira</Text>
                <Text style={{ color: '#B91C1C', fontSize: 12 }}>Existem associados com mensalidades pendentes.</Text>
              </View>
            </TouchableOpacity>

          </View>
        </ScrollView>
      </View>
    </ScreenContainer>
  );
}