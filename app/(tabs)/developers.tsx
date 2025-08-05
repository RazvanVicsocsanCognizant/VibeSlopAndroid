import { Image } from "expo-image";
import { Stack, useLocalSearchParams } from "expo-router";
import Checkbox from "expo-checkbox";
import {
  FlatList,
  Pressable,
  StyleSheet,
  View,
  useWindowDimensions,
  Button,
  Platform,
} from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Developer } from "@/types";
import { useState } from "react";

function DeveloperCard({
  developer,
  onSelect,
  isSelected,
}: {
  developer: Developer;
  onSelect: (id: string) => void;
  isSelected: boolean;
}) {
  const colorScheme = useColorScheme();
  const cardBackgroundColor = Colors[colorScheme ?? "light"].card;
  const availabilityColor =
    developer.available === "Yes" ? "#4CAF50" : "#F44336";

  return (
    <Pressable
      style={[
        styles.card,
        { backgroundColor: cardBackgroundColor },
        Platform.OS === "web" && styles.webCard,
      ]}
      onPress={() => onSelect(developer.id)}
    >
      <Checkbox
        value={isSelected}
        onValueChange={() => onSelect(developer.id)}
        style={styles.checkbox}
      />
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

async function evaluateDevelopers(developers: Developer[]) {
  console.log("Submitting developers for evaluation:", developers);

  // Simulate a POST request to a mock endpoint
  try {
    const response: { ok: boolean; json: () => Promise<any> } = await new Promise((resolve) =>
      setTimeout(() => {
        resolve({
          ok: true,
          json: () =>
            Promise.resolve({ message: "Evaluation submitted successfully!" }),
        });
      }, 1000)
    );

    if (!response.ok) {
      throw new Error("Failed to submit evaluation.");
    }

    const result = await response.json();
    console.log("Evaluation result:", result);
    alert(result.message);
  } catch (error) {
    console.error("Evaluation error:", error);
    alert("Failed to submit evaluation. Please try again.");
  }
}

export default function DeveloperListScreen() {
  const params = useLocalSearchParams();
  const { width } = useWindowDimensions();
  const developersString = params.developers as string;
  const [selectedDeveloperIds, setSelectedDeveloperIds] = useState<string[]>([]);
  let developers: Developer[] = [];

  try {
    if (developersString) {
      developers = JSON.parse(developersString);
    }
  } catch (e) {
    console.error("Failed to parse developers from params:", e);
  }

  const handleSelectDeveloper = (id: string) => {
    setSelectedDeveloperIds((prev) =>
      prev.includes(id) ? prev.filter((devId) => devId !== id) : [...prev, id]
    );
  };

  const handleEvaluate = () => {
    const selectedDevelopers = developers.filter((dev) =>
      selectedDeveloperIds.includes(dev.id)
    );
    evaluateDevelopers(selectedDevelopers);
  };

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
        renderItem={({ item }) => (
          <DeveloperCard
            developer={item}
            onSelect={handleSelectDeveloper}
            isSelected={selectedDeveloperIds.includes(item.id)}
          />
        )}
        contentContainerStyle={styles.listContentContainer}
      />
      {selectedDeveloperIds.length > 0 && (
        <View style={styles.evaluateButtonContainer}>
          <Button title="Evaluate" onPress={handleEvaluate} />
        </View>
      )}
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
    paddingBottom: 80,
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
  webCard: {
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    shadowColor: "transparent", // Reset native shadow
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
  checkbox: {
    marginRight: 10,
    alignSelf: "center",
  },
  evaluateButtonContainer: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
  },
});
