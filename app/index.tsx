import { Button } from "@/components/ui/Button";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import { StyleSheet, TextInput } from "react-native";

// Mock authentication function. Replace this with your actual API call.
const mockLoginApi = (user: string, pass: string) => {
  return new Promise<void>((resolve, reject) => {
    setTimeout(() => {
      if (user && pass) {
        resolve();
      } else {
        reject(new Error("Invalid username or password"));
      }
    }, 1000);
  });
};

export default function LoginScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const passwordInputRef = useRef<TextInput>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    if (isLoading) return;
    setIsLoading(true);
    setError(null);
    try {
      await mockLoginApi(username, password);
      // On successful login, navigate to the home screen within the tabs layout
      router.replace("/(tabs)/home");
    } catch (e: any) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      // Reset form state every time the screen comes into focus
      setUsername("");
      setPassword("");
      setError(null);
      setIsLoading(false);
      passwordInputRef.current?.clear();
    }, [])
  );

  const textInputStyle = {
    borderColor: Colors[colorScheme ?? "light"].icon,
    color: Colors[colorScheme ?? "light"].text,
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        Welcome Back
      </ThemedText>
      <TextInput
        style={[styles.input, textInputStyle]}
        placeholder="Username"
        placeholderTextColor={Colors[colorScheme ?? "light"].icon}
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
        editable={!isLoading}
        returnKeyType="next"
        onSubmitEditing={() => passwordInputRef.current?.focus()}
      />
      <TextInput
        style={[styles.input, textInputStyle]}
        placeholder="Password"
        placeholderTextColor={Colors[colorScheme ?? "light"].icon}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        editable={!isLoading}
        ref={passwordInputRef}
        returnKeyType="done"
        onSubmitEditing={handleLogin}
      />
      {error && <ThemedText style={styles.errorText}>{error}</ThemedText>}
      <Button onPress={handleLogin} loading={isLoading}>
        Login
      </Button>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    gap: 16,
  },
  title: {
    textAlign: "center",
    marginBottom: 24,
  },
  input: {
    height: 50,
    borderWidth: 1,
    paddingHorizontal: 16,
    borderRadius: 8,
    fontSize: 16,
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginBottom: 10,
  },
});
