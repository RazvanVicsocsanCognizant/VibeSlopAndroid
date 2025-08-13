import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Interview } from "@/types";
import { Image } from "expo-image";
import { Stack, useLocalSearchParams } from "expo-router";
import { ScrollView, StyleSheet, View } from "react-native";

interface InterviewWithDeveloper extends Interview {
  developerName: string;
  developerPhoto: string;
  developerId: string;
}

export default function InterviewDetailsScreen() {
  const { interview: interviewString } = useLocalSearchParams();
  const colorScheme = useColorScheme();

  if (!interviewString || typeof interviewString !== "string") {
    return (
      <ThemedView style={styles.centered}>
        <ThemedText>Interview data not found.</ThemedText>
      </ThemedView>
    );
  }

  const interview: InterviewWithDeveloper = JSON.parse(
    interviewString as string
  );

  const screenTitle = `${interview.clientName} & ${interview.developerName}`;
  const feedbackCardColor = Colors[colorScheme ?? "light"].card;
  const feedbackTextColor = Colors[colorScheme ?? "light"].text;
  const borderColor = Colors[colorScheme ?? "light"].icon;

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen options={{ title: screenTitle }} />
      <ScrollView>
        <ThemedView style={[styles.header, { borderBottomColor: borderColor }]}>
          <Image
            source={{ uri: interview.developerPhoto }}
            style={styles.photo}
          />
          <ThemedText type="title">{interview.developerName}</ThemedText>
          <ThemedText type="subtitle">
            Interview for: {interview.clientName}
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.feedbackSection}>
          <ThemedText type="subtitle" style={styles.feedbackTitle}>
            Evaluation Feedback
          </ThemedText>
          <View
            style={[
              styles.feedbackCard,
              { backgroundColor: feedbackCardColor },
            ]}
          >
            <ThemedText
              style={[styles.feedbackText, { color: feedbackTextColor }]}
            >
              "{interview.feedback}"
            </ThemedText>
          </View>
        </ThemedView>
      </ScrollView>
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
  header: {
    alignItems: "center",
    padding: 24,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  photo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  feedbackSection: {
    padding: 24,
  },
  feedbackTitle: {
    marginBottom: 20,
  },
  feedbackCard: {
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  feedbackText: {
    fontSize: 20,
    lineHeight: 30,
    fontStyle: "italic",
  },
});
