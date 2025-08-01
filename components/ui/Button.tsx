import { ComponentProps } from "react";
import { ActivityIndicator, Pressable, StyleSheet } from "react-native";
import Animated from "react-native-reanimated";

import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type ButtonProps = ComponentProps<typeof AnimatedPressable> & {
  loading?: boolean;
  children: React.ReactNode;
};

export function Button({
  children,
  loading,
  style,
  disabled,
  ...rest
}: ButtonProps) {
  const colorScheme = useColorScheme();

  const themedButtonStyle = {
    backgroundColor: Colors[colorScheme ?? "light"].tint,
    opacity: disabled || loading ? 0.7 : 1,
  };

  return (
    <AnimatedPressable
      style={[styles.button, themedButtonStyle, style]}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : typeof children === "string" ? (
        <ThemedText style={styles.buttonText}>{children}</ThemedText>
      ) : (
        children
      )}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4, // Shadow for Android
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
