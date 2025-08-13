import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function ExploreScreen() {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const [description, setDescription] = useState("");
  const [technologies, setTechnologies] = useState("");
  const router = useRouter();

  const textInputStyle = {
    borderColor: Colors[colorScheme ?? "light"].icon,
    color: Colors[colorScheme ?? "light"].text,
    backgroundColor: Colors[colorScheme ?? "light"].background,
  };

  const buttonStyle = {
    backgroundColor: Colors[colorScheme ?? "light"].tint,
  };

  const scale = useSharedValue(1);

  const animatedButtonStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: withSpring(scale.value) }],
    };
  });

  const handleSubmit = () => {
    router.push({
      pathname: "/developers",
      params: { skills: technologies },
    });
    setDescription("");
    setTechnologies("");
  };

  return (
    <ThemedView style={[styles.pageContainer, { paddingTop: insets.top }]}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <ThemedView style={styles.container}>
          <ThemedView style={styles.inputContainer}>
            <ThemedText style={styles.label}>Project description</ThemedText>
            <TextInput
              style={[styles.textInput, styles.largeTextInput, textInputStyle]}
              value={description}
              onChangeText={setDescription}
              placeholder="Describe your project here..."
              placeholderTextColor={Colors[colorScheme ?? "light"].icon}
              multiline
              textAlignVertical="top"
            />
          </ThemedView>

          <ThemedView style={styles.inputContainer}>
            <ThemedText style={styles.label}>
              (optional) technologies you want to use
            </ThemedText>
            <TextInput
              style={[styles.textInput, textInputStyle]}
              value={technologies}
              onChangeText={setTechnologies}
              placeholder="e.g., React, Firebase, etc."
              placeholderTextColor={Colors[colorScheme ?? "light"].icon}
            />
          </ThemedView>
        </ThemedView>
      </ScrollView>
      <AnimatedPressable
        style={[
          styles.button,
          buttonStyle,
          { bottom: insets.bottom + 20 },
          animatedButtonStyle,
        ]}
        onPressIn={() => (scale.value = 0.95)}
        onPress={handleSubmit}
        onPressOut={() => (scale.value = 1)}
        onHoverIn={() => (scale.value = 1.05)}
        onHoverOut={() => (scale.value = 1)}
      >
        <ThemedText style={styles.buttonText}>Submit</ThemedText>
      </AnimatedPressable>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 16,
    // Add padding to the bottom to ensure the last input is not hidden by the floating button
    paddingBottom: 120,
  },
  container: {
    // Padding is now in scrollContainer to handle the alignment correctly.
    gap: 16,
  },
  inputContainer: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
  },
  largeTextInput: {
    height: 200,
    paddingTop: 12,
  },
  button: {
    position: "absolute",
    left: 20,
    right: 20,
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
