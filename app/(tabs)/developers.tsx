import { findDevelopersBySkills, generateInterviewQuestions } from "@/api";
import { Button } from "@/components/ui/Button";
import Checkbox from "expo-checkbox";
import { Image } from "expo-image";
import {
  Stack,
  useFocusEffect,
  useLocalSearchParams,
  useRouter,
} from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Platform,
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

function DeveloperCard({
  developer,
  onSelect,
  isSelected,
}: {
  developer: Developer;
  onSelect: (id: string) => void;
  isSelected: boolean;
}) {
  const router = useRouter();
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
      <View style={styles.pressableContent}>
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
      </View>
    </Pressable>
  );
}

export default function DeveloperListScreen() {
  const params = useLocalSearchParams();
  const { width } = useWindowDimensions();
  const skills = (params.skills as string) || "";
  const router = useRouter();
  const [developers, setDevelopers] = useState<Developer[]>([]);
  const [selectedDeveloperId, setSelectedDeveloperId] = useState<string | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      const fetchDevelopers = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const result = await findDevelopersBySkills(skills);
          if (isActive) {
            setDevelopers(result);
          }
        } catch (err: any) {
          if (isActive) {
            setError(
              err.message || "An error occurred while fetching developers."
            );
          }
        } finally {
          if (isActive) setIsLoading(false);
        }
      };
      fetchDevelopers();
      return () => {
        isActive = false;
      };
    }, [skills])
  );

  if (isLoading) {
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

  const handleSelectDeveloper = (id: string) => {
    setSelectedDeveloperId((currentSelectedId) => {
      // If the developer clicked is the one already selected, we deselect it by returning null.
      if (currentSelectedId === id) {
        return null;
      }
      // Otherwise, we select the new developer by returning their id.
      return id;
    });
  };

  const handleEvaluate = async () => {
    if (!selectedDeveloperId || isEvaluating) return;

    const selectedDeveloper = developers.find(
      (dev) => dev.id === selectedDeveloperId
    );

    if (!selectedDeveloper) {
      Alert.alert("Error", "Selected developer not found.");
      return;
    }

    setIsEvaluating(true);
    try {
      const questions = await generateInterviewQuestions(
        selectedDeveloper.techStack
      );
      console.log("Generated questions:", questions);
      router.push({
        pathname: "/evaluation",
        params: {
          questions: JSON.stringify(questions),
          developerId: selectedDeveloperId,
        },
      });
    } catch (error: any) {
      Alert.alert("Error", error.message || "Could not generate questions.");
    } finally {
      setIsEvaluating(false);
    }
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
    <ThemedView style={styles.container}>
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
            isSelected={selectedDeveloperId === item.id}
          />
        )}
        contentContainerStyle={styles.listContentContainer}
      />
      {selectedDeveloperId && (
        <View style={styles.evaluateButtonContainer}>
          <Button onPress={handleEvaluate} loading={isEvaluating}>
            Evaluate
          </Button>
        </View>
      )}
    </ThemedView>
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
    borderRadius: 99, // Make it look like a radio button for single selection
  },
  evaluateButtonContainer: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
  },
  pressableContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
});
