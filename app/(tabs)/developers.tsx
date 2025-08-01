import { Image } from "expo-image";
import { Stack, useLocalSearchParams } from "expo-router";
import {
  FlatList,
  Pressable,
  StyleSheet,
  View,
  useWindowDimensions,
} from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Developer } from "@/types";

function DeveloperCard({ developer }: { developer: Developer }) {
  const colorScheme = useColorScheme();
  const cardBackgroundColor = Colors[colorScheme ?? "light"].card;
  const availabilityColor =
    developer.available === "Yes" ? "#4CAF50" : "#F44336";

  return (
    <Pressable style={[styles.card, { backgroundColor: cardBackgroundColor }]}>
      <Image source={{ uri: developer.photo }} style={styles.photo} />
      <View style={styles.infoContainer}>
        <ThemedText type="subtitle" style={styles.nameText}>
          Name: {developer.name}
        </ThemedText>
        <ThemedText style={styles.locationText}>
          Location: {developer.location}
        </ThemedText>
        <ThemedText style={styles.experienceText}>
          Experience: {developer.yearsOfExperience} yrs
        </ThemedText>
        <ThemedText style={styles.techStackText}>
          Tech Stack: {developer.techStack.join(", ")}
        </ThemedText>
        {!!developer.project && (
          <ThemedText style={styles.projectText}>
            Project: {developer.project}
          </ThemedText>
        )}
        <ThemedText
          style={[styles.availabilityText, { color: availabilityColor }]}
        >
          Available: {developer.available}
        </ThemedText>
      </View>
    </Pressable>
  );
}

export default function DeveloperListScreen() {
  const params = useLocalSearchParams();
  const { width } = useWindowDimensions();
  const developersString = params.developers as string;
  let developers: Developer[] = [];

  try {
    if (developersString) {
      developers = JSON.parse(developersString);
    }
  } catch (e) {
    console.error("Failed to parse developers from params:", e);
  }

  const numColumns = width > 768 ? 3 : 1;

  if (!developers.length) {
    return (
      <ThemedView style={styles.centered}>
        <Stack.Screen options={{ title: "No Developers Found" }} />
        <ThemedText>Could not find any developers.</ThemedText>
      </ThemedView>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: "Available Developers" }} />
      <FlatList
        data={developers}
        keyExtractor={(item) => item.id}
        numColumns={numColumns}
        key={numColumns}
        renderItem={({ item }) => <DeveloperCard developer={item} />}
        contentContainerStyle={styles.listContentContainer}
      />
    </View>
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
  listContentContainer: {
    paddingHorizontal: 8,
    paddingTop: 16,
  },
  card: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-start",
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
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 12,
  },
  infoContainer: {
    flex: 1,
    gap: 2,
  },
  nameText: {
    fontSize: 16,
    fontWeight: "600",
  },
  locationText: {
    fontSize: 14,
    opacity: 0.7,
  },
  experienceText: {
    fontSize: 12,
    fontStyle: "italic",
  },
  techStackText: {
    fontSize: 12,
    opacity: 0.8,
  },
  projectText: {
    fontSize: 12,
    fontStyle: "italic",
    opacity: 0.6,
  },
  availabilityText: {
    fontSize: 12,
    fontWeight: "bold",
  },
});
