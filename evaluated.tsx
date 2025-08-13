import { findDevelopersBySkills, getDeveloperById } from "@/api";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Interview } from "@/types";
import { Image } from "expo-image";
import { Stack, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  View,
} from "react-native";

// This interface combines interview data with essential developer info for display.
interface InterviewWithDeveloper extends Interview {
  developerName: string;
  developerPhoto: string;
  developerId: string;
}

async function fetchAllInterviews(): Promise<InterviewWithDeveloper[]> {
  // 1. Get all developers
  const developers = await findDevelopersBySkills("");

  // 2. Get details for each developer in parallel
  const developerDetailsPromises = developers.map((dev) =>
    getDeveloperById(dev.id)
  );
  const allDeveloperDetails = await Promise.all(developerDetailsPromises);

  // 3. Flatten interviews and add developer info
  const allInterviews = allDeveloperDetails.flatMap((devDetail) =>
    devDetail.interviews.map((interview) => ({
      ...interview,
      developerName: devDetail.name,
      developerPhoto: devDetail.photo,
      developerId: devDetail.id,
    }))
  );

  return allInterviews;
}

function InterviewCard({ interview }: { interview: InterviewWithDeveloper }) {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const cardBackgroundColor = Colors[colorScheme ?? "light"].card;

  return (
    <Pressable
      style={[styles.card, { backgroundColor: cardBackgroundColor }]}
      onPress={() =>
        router.push({
          pathname: "/interview-details",
          params: { interview: JSON.stringify(interview) },
        })
      }
    >
      <Image source={{ uri: interview.developerPhoto }} style={styles.photo} />
      <View style={styles.infoContainer}>
        <ThemedText type="subtitle">
          {`${interview.clientName} - ${interview.developerName}`}
        </ThemedText>
        <ThemedText style={styles.feedback}>"{interview.feedback}"</ThemedText>
      </View>
    </Pressable>
  );
}

export default function EvaluatedScreen() {
  const [interviews, setInterviews] = useState<InterviewWithDeveloper[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    fetchAllInterviews()
      .then(setInterviews)
      .catch((err) => {
        console.error("Failed to fetch interviews:", err);
        setError(err.message || "An error occurred while fetching interviews.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return (
      <ThemedView style={styles.centered}>
        <ActivityIndicator size="large" />
        <ThemedText style={{ marginTop: 8 }}>
          Loading interview history...
        </ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen options={{ title: "Interview History" }} />
      <FlatList
        data={interviews}
        keyExtractor={(item) => `${item.developerId}-${item.id}`}
        renderItem={({ item }) => <InterviewCard interview={item} />}
        ListEmptyComponent={
          <ThemedView style={styles.centered}>
            <ThemedText>No interviews found.</ThemedText>
          </ThemedView>
        }
        contentContainerStyle={
          interviews.length === 0 ? { flex: 1 } : styles.listContentContainer
        }
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContentContainer: {
    paddingHorizontal: 8,
    paddingTop: 16,
    paddingBottom: 16,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    flex: 1,
    flexDirection: "row",
    marginVertical: 8,
    marginHorizontal: 8,
    padding: 12,
    borderRadius: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  photo: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
  infoContainer: {
    flex: 1,
    gap: 4,
  },
  feedback: {
    fontStyle: "italic",
    opacity: 0.8,
  },
});
