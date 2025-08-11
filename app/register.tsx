import { registerApi, saveToken } from "@/api";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Button } from "@/components/ui/Button";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Stack, useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import { StyleSheet, TextInput } from "react-native";

export default function RegisterScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const passwordInputRef = useRef<TextInput>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async () => {
    if (isLoading) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await registerApi({ username, password });
      await saveToken(response.token);
      // Replace to home so user can't go back to register page
      router.replace("/(tabs)/home");
    } catch (e: any) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  const textInputStyle = {
    borderColor: Colors[colorScheme ?? "light"].icon,
    color: Colors[colorScheme ?? "light"].text,
  };

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen options={{ title: "Register" }} />
      <ThemedText type="title" style={styles.title}>
        Create an Account
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
        onSubmitEditing={handleRegister}
      />
      <Button
        onPress={handleRegister}
        loading={isLoading}
        disabled={!username || !password}
      >
        Register
      </Button>
      {error && <ThemedText style={styles.errorText}>{error}</ThemedText>}
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
    marginTop: 10,
  },
});
