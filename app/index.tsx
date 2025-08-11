import { loginApi, saveToken } from "@/api";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Button } from "@/components/ui/Button";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import { Pressable, StyleSheet, TextInput, View } from "react-native";

const mockDeveloperLoginApi = (developerId: string) => {
  return new Promise<void>((resolve, reject) => {
    setTimeout(() => {
      if (developerId.match(/^\d{7}$/)) {
        resolve();
      } else {
        reject(new Error("Invalid Developer ID"));
      }
    }, 1000);
  });
};

export default function LoginScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const passwordInputRef = useRef<TextInput>(null);
  const [loginMode, setLoginMode] = useState<"user" | "developer">("user");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [developerId, setDeveloperId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    if (isLoading) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await loginApi({ username, password });
      await saveToken(response.token);
      router.replace("/(tabs)/home");
    } catch (e: any) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeveloperLogin = async () => {
    if (isLoading) return;
    setIsLoading(true);
    setError(null);
    try {
      await mockDeveloperLoginApi(developerId);
      router.push("/evaluation");
    } catch (e: any) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      setUsername("");
      setPassword("");
      setDeveloperId("");
      setError(null);
      setIsLoading(false);
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
      <View style={styles.toggleContainer}>
        <Pressable
          style={[
            styles.toggleButton,
            loginMode === "user" && styles.activeToggleButton,
          ]}
          onPress={() => setLoginMode("user")}
        >
          <ThemedText>User</ThemedText>
        </Pressable>
        <Pressable
          style={[
            styles.toggleButton,
            loginMode === "developer" && styles.activeToggleButton,
          ]}
          onPress={() => setLoginMode("developer")}
        >
          <ThemedText>Developer</ThemedText>
        </Pressable>
      </View>

      {loginMode === "user" ? (
        <>
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
          <Button
            onPress={handleLogin}
            loading={isLoading}
            disabled={!username || !password}
          >
            Login
          </Button>
        </>
      ) : (
        <>
          <TextInput
            style={[styles.input, textInputStyle]}
            placeholder="7-Digit Developer ID"
            placeholderTextColor={Colors[colorScheme ?? "light"].icon}
            value={developerId}
            onChangeText={setDeveloperId}
            keyboardType="numeric"
            maxLength={7}
            editable={!isLoading}
            returnKeyType="done"
            onSubmitEditing={handleDeveloperLogin}
          />
          <Button
            onPress={handleDeveloperLogin}
            loading={isLoading}
            disabled={!developerId}
          >
            Login as Developer
          </Button>
        </>
      )}
      {loginMode === "user" && (
        <Pressable onPress={() => router.push("/register")}>
          <ThemedText style={styles.registerText}>
            Don't have an account? Register
          </ThemedText>
        </Pressable>
      )}
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
    marginBottom: 10,
  },
  toggleContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  toggleButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
  activeToggleButton: {
    backgroundColor: "#ccc",
  },
  registerText: {
    textAlign: "center",
    marginTop: 16,
    color: Colors.light.tint,
  },
});
