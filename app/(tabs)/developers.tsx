import { Image } from "expo-image";
import { Stack, useLocalSearchParams } from "expo-router";
import { FlatList, Pressable, StyleSheet, View } from "react-native";

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
        <ThemedText type="subtitle" style={styles.nameText} numberOfLines={1}>
          {developer.name}
        </ThemedText>
        <ThemedText style={styles.locationText} numberOfLines={1}>
          {developer.location}
        </ThemedText>
        <ThemedText style={styles.experienceText}>
          {developer.yearsOfExperience} yrs
        </ThemedText>
        <ThemedText style={styles.techStackText} numberOfLines={2}>
          {developer.techStack.join(", ")}
        </ThemedText>
        {!!developer.project && (
          <ThemedText style={styles.projectText} numberOfLines={1}>
            On: {developer.project}
          </ThemedText>
        )}
        <ThemedText
          style={[styles.availabilityText, { color: availabilityColor }]}
        >
          {developer.available}
        </ThemedText>
      </View>
    </Pressable>
  );
}

export default function DeveloperListScreen() {
  const params = useLocalSearchParams();
  const developersString = params.developers as string;
  let developers: Developer[] = [];

  try {
    if (developersString) {
      developers = JSON.parse(developersString);
    }
  } catch (e) {
    console.error("Failed to parse developers from params:", e);
  }

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
        numColumns={3}
        key={3} // Important for re-rendering on numColumns change
        renderItem={({ item }) => <DeveloperCard developer={item} />}
        contentContainerStyle={styles.listContentContainer}
        columnWrapperStyle={styles.columnWrapper}
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
  columnWrapper: {
    gap: 8,
    marginBottom: 16,
  },
  card: {
    flex: 1, // Each card takes up half the width
    alignItems: "center",
    margin: 4,
    padding: 12,
    borderRadius: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    minHeight: 220,
    justifyContent: "flex-start",
  },
  photo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 12,
  },
  infoContainer: {
    flex: 1,
    alignItems: "center",
    gap: 4,
    width: "100%",
  },
  nameText: {
    fontSize: 14,
    textAlign: "center",
    fontWeight: "600",
  },
  locationText: {
    fontSize: 12,
    opacity: 0.7,
    textAlign: "center",
  },
  experienceText: {
    fontSize: 12,
    fontStyle: "italic",
  },
  techStackText: {
    fontSize: 11,
    textAlign: "center",
    opacity: 0.8,
    marginTop: 4,
  },
  projectText: {
    fontSize: 11,
    fontStyle: "italic",
    opacity: 0.6,
    textAlign: "center",
    marginTop: 4,
  },
  availabilityText: {
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: "auto",
    paddingTop: 8,
  },
});
