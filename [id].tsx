import { getDeveloperById } from "@/api";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { DeveloperDetail } from "@/types";
import { Image } from "expo-image";
import { Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, View } from "react-native";

export default function DeveloperDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [developer, setDeveloper] = useState<DeveloperDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      setLoading(true);
      getDeveloperById(id)
        .then((data) => {
          setDeveloper(data);
        })
        .catch((err) => {
          setError(err.message);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setError("No developer ID provided.");
      setLoading(false);
    }
  }, [id]);

  if (loading) {
    return (
      <ThemedView style={styles.centered}>
        <ActivityIndicator size="large" />
      </ThemedView>
    );
  }

  if (error) {
    return (
      <ThemedView style={styles.centered}>
        <ThemedText type="subtitle">Error</ThemedText>
        <ThemedText>{error}</ThemedText>
      </ThemedView>
    );
  }

  if (!developer) {
    return (
      <ThemedView style={styles.centered}>
        <ThemedText>Developer not found.</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Stack.Screen options={{ title: developer.name }} />
      <ThemedView style={styles.header}>
        <Image source={{ uri: developer.photo }} style={styles.photo} />
        <ThemedText type="title">{developer.name}</ThemedText>
        <ThemedText style={styles.skills}>
          Skills: {developer.techStack.join(", ")}
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Interview History
        </ThemedText>
        {developer.interviews.length > 0 ? (
          developer.interviews.map((interview) => (
            <View key={interview.id} style={styles.interviewCard}>
              <ThemedText type="defaultSemiBold">
                {interview.clientName}
              </ThemedText>
              <ThemedText style={styles.feedback}>
                {interview.feedback}
              </ThemedText>
            </View>
          ))
        ) : (
          <ThemedText>No interview history available.</ThemedText>
        )}
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    alignItems: "center",
    padding: 20,
  },
  photo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
  },
  skills: {
    marginTop: 8,
    opacity: 0.8,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    marginBottom: 12,
  },
  interviewCard: {
    marginBottom: 16,
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
  },
  feedback: {
    marginTop: 4,
    fontStyle: "italic",
  },
});
