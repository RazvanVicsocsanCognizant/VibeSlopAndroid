import { createInterview, generateFeedback } from "@/api";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Question } from "@/types";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  FlatList,
  TextInput,
  Button,
  View,
  Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function EvaluationScreen() {
  const params = useLocalSearchParams();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [errors, setErrors] = useState<{ [key: string]: boolean }>({});
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEvaluated, setIsEvaluated] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generatedFeedback, setGeneratedFeedback] = useState<string | null>(
    null
  );
  const [isReturning, setIsReturning] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const colorScheme = useColorScheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const questionsParam = params.questions as string;
    setIsLoading(true);
    setError(null);
    if (questionsParam) {
      try {
        const parsedQuestions = JSON.parse(questionsParam);
        if (Array.isArray(parsedQuestions) && parsedQuestions.length > 0) {
          setQuestions(parsedQuestions);
        } else {
          setError("No questions were provided for the evaluation.");
        }
      } catch (e) {
        console.error("Failed to parse questions from params:", e);
        setError("Could not load questions. The data format is incorrect.");
      } finally {
        setIsLoading(false);
      }
    } else {
      setError("No questions were provided for the evaluation.");
      setIsLoading(false);
    }
  }, [params.questions]);

  const handleAnswerChange = (id: string, text: string) => {
    setAnswers((prev) => ({ ...prev, [id]: text }));
    if (errors[id]) {
      setErrors((prev) => ({ ...prev, [id]: false }));
    }
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;

    const newErrors: { [key: string]: boolean } = {};
    let firstErrorIndex = -1;

    questions.forEach((q, index) => {
      if (!answers[q.id]?.trim()) {
        newErrors[q.id] = true;
        if (firstErrorIndex === -1) {
          firstErrorIndex = index;
        }
      }
    });

    setErrors(newErrors);

    if (firstErrorIndex !== -1) {
      flatListRef.current?.scrollToIndex({ index: firstErrorIndex });
      return;
    }

    setIsSubmitting(true);
    try {
      const feedback = await generateFeedback(questions, answers);
      setGeneratedFeedback(feedback);
      setIsEvaluated(true);
    } catch (e: any) {
      Alert.alert("Error", e.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReturn = async () => {
    if (isReturning || !generatedFeedback) return;

    const developerId = params.developerId as string;
    if (!developerId) {
      Alert.alert("Error", "Developer ID is missing. Cannot save interview.", [
        { text: "OK", onPress: () => router.back() },
      ]);
      return;
    }

    setIsReturning(true);
    try {
      await createInterview(developerId, generatedFeedback);
      router.back();
    } catch (e: any) {
      Alert.alert(
        "Save Failed",
        `Could not save the interview record. ${e.message}`,
        [{ text: "OK", onPress: () => router.back() }]
      );
    } finally {
      setIsReturning(false);
    }
  };

  if (isLoading) {
    return (
      <ThemedView style={styles.centered}>
        <ThemedText>Loading...</ThemedText>
      </ThemedView>
    );
  }

  if (error) {
    return (
      <ThemedView style={styles.centered}>
        <ThemedText type="subtitle">Error</ThemedText>
        <ThemedText style={styles.subtitle}>{error}</ThemedText>
      </ThemedView>
    );
  }

  if (isEvaluated) {
    return (
      <ThemedView style={styles.centered}>
        <ThemedText type="title">Thank You!</ThemedText>
        <ThemedText style={styles.subtitle}>
          Thanks for taking the time to submit the evaluation.
        </ThemedText>
        <View
          style={[styles.returnButtonContainer, { bottom: insets.bottom + 20 }]}
        >
          <Button
            title={isReturning ? "Saving..." : "Return"}
            onPress={handleReturn}
            disabled={isReturning}
          />
        </View>
      </ThemedView>
    );
  }

  const textInputStyle = {
    borderColor: Colors[colorScheme ?? "light"].icon,
    color: Colors[colorScheme ?? "light"].text,
  };

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen options={{ title: "Evaluation" }} />
      <FlatList
        ref={flatListRef}
        data={questions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.questionContainer}>
            <ThemedText>{item.question}</ThemedText>
            <TextInput
              style={[
                styles.input,
                textInputStyle,
                errors[item.id] && styles.errorInput,
              ]}
              value={answers[item.id] || ""}
              onChangeText={(text) => handleAnswerChange(item.id, text)}
              placeholder="Your answer"
              placeholderTextColor={Colors[colorScheme ?? "light"].icon}
            />
          </View>
        )}
        ListFooterComponent={
          <Button
            title={isSubmitting ? "Submitting..." : "Submit Evaluation"}
            onPress={handleSubmit}
            disabled={isSubmitting}
          />
        }
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  subtitle: {
    marginTop: 8,
    textAlign: "center",
  },
  questionContainer: {
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    padding: 8,
    marginTop: 8,
    borderRadius: 4,
  },
  errorInput: {
    borderColor: "red",
  },
  returnButtonContainer: {
    position: "absolute",
    left: 16,
    right: 16,
  },
});
