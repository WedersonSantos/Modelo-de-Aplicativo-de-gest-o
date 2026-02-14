import { View, Text, ActivityIndicator, DimensionValue } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
} from "react-native-reanimated";
import { useEffect } from "react";
import { useColors } from "@/hooks/use-colors";

interface LoadingScreenProps {
  message?: string;
}

export function LoadingScreen({ message = "Carregando..." }: LoadingScreenProps) {
  const colors = useColors();
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0.6);

  useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1.1, { duration: 600, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 600, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );
    opacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 600 }),
        withTiming(0.6, { duration: 600 })
      ),
      -1,
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <View
      className="flex-1 items-center justify-center bg-background"
      style={{ backgroundColor: colors.background }}
    >
      <Animated.View style={animatedStyle}>
        <View
          className="w-20 h-20 rounded-full items-center justify-center"
          style={{ backgroundColor: colors.primary + "20" }}
        >
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </Animated.View>
      <Text
        className="text-base font-medium mt-6"
        style={{ color: colors.muted }}
      >
        {message}
      </Text>
    </View>
  );
}

interface LoadingOverlayProps {
  visible: boolean;
  message?: string;
}

export function LoadingOverlay({ visible, message }: LoadingOverlayProps) {
  const colors = useColors();

  if (!visible) return null;

  return (
    <View
      className="absolute inset-0 items-center justify-center z-50"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <View
        className="bg-surface rounded-2xl p-6 items-center min-w-[150px]"
        style={{ backgroundColor: colors.surface }}
      >
        <ActivityIndicator size="large" color={colors.primary} />
        {message && (
          <Text
            className="text-sm font-medium mt-3 text-center"
            style={{ color: colors.foreground }}
          >
            {message}
          </Text>
        )}
      </View>
    </View>
  );
}

interface SkeletonProps {
  width?: DimensionValue;
  height?: number;
  borderRadius?: number;
  className?: string;
}

export function Skeleton({
  width = "100%",
  height = 20,
  borderRadius = 8,
  className,
}: SkeletonProps) {
  const colors = useColors();
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.7, { duration: 800 }),
        withTiming(0.3, { duration: 800 })
      ),
      -1,
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      className={className}
      style={[
        {
          width,
          height,
          borderRadius,
          backgroundColor: colors.border,
        },
        animatedStyle,
      ]}
    />
  );
}

export function SkeletonCard() {
  return (
    <View className="bg-surface rounded-lg p-4 mb-3 border border-border">
      <View className="flex-row justify-between items-start">
        <View className="flex-1 gap-2">
          <Skeleton width="60%" height={16} />
          <Skeleton width="40%" height={12} />
        </View>
        <Skeleton width={60} height={24} borderRadius={12} />
      </View>
    </View>
  );
}

export function SkeletonList({ count = 5 }: { count?: number }) {
  return (
    <View className="gap-3">
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </View>
  );
}

export function SkeletonDashboard() {
  return (
    <View className="gap-4">
      <View className="flex-row gap-3">
        <View className="flex-1 bg-surface rounded-lg p-4 border border-border">
          <Skeleton width="50%" height={12} />
          <Skeleton width="70%" height={28} className="mt-2" />
        </View>
        <View className="flex-1 bg-surface rounded-lg p-4 border border-border">
          <Skeleton width="50%" height={12} />
          <Skeleton width="70%" height={28} className="mt-2" />
        </View>
      </View>
      <View className="flex-row gap-3">
        <View className="flex-1 bg-surface rounded-lg p-4 border border-border">
          <Skeleton width="50%" height={12} />
          <Skeleton width="70%" height={28} className="mt-2" />
        </View>
        <View className="flex-1 bg-surface rounded-lg p-4 border border-border">
          <Skeleton width="50%" height={12} />
          <Skeleton width="70%" height={28} className="mt-2" />
        </View>
      </View>
      <View className="mt-4">
        <Skeleton width="40%" height={20} className="mb-4" />
        <SkeletonList count={3} />
      </View>
    </View>
  );
}
