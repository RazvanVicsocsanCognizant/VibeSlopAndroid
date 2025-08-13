import { Stack } from "expo-router";
import React from "react";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="evaluation" />
      <Stack.Screen name="register" />
      <Stack.Screen name="interview-details" />
      <Stack.Screen name="[id]" />
    </Stack>
  );
}
