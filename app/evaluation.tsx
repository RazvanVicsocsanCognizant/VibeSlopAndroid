import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Stack } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  FlatList,
  TextInput,
  Button,
  View,
  Alert,
} from "react-native";

interface Question {
  id: string;
  question: string;
}

const mockQuestions: Question[] = [
  { id: "1", question: "What are your primary technical skills?" },
  { id: "2", question: "Describe a challenging project you've worked on." },
  {
    id: "3",
    question: "How do you stay updated with the latest industry trends?",
  },
  { id: "4", question: "What are your career goals for the next five years?" },
];

async function fetchQuestions(): Promise<Question[]> {
  // Simulate a GET request to a mock endpoint
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockQuestions);
    }, 1000);
  });
}

async function submitEvaluation(answers: { [key: string]: string }) {
  console.log("Submitting evaluation:", answers);
  // Simulate a POST request to a mock endpoint
  return new Promise<void>((resolve, reject) => {
    setTimeout(() => {
      if (Object.values(answers).every((answer) => answer.trim() !== "")) {
        resolve();
      } else {
        reject(new Error("Please answer all questions."));
      }
    }, 1000);
  });
}

export default function EvaluationScreen() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [errors, setErrors] = useState<{ [key: string]: boolean }>({});
  const [isLoading, setIsLoading] = useState(true);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    fetchQuestions().then((data) => {
      setQuestions(data);
      setIsLoading(false);
    });
  }, []);

  const handleAnswerChange = (id: string, text: string) => {
    setAnswers((prev) => ({ ...prev, [id]: text }));
    if (errors[id]) {
      setErrors((prev) => ({ ...prev, [id]: false }));
    }
  };

  const handleSubmit = async () => {
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

    try {
      await submitEvaluation(answers);
      Alert.alert("Success", "Evaluation submitted successfully!");
    } catch (e: any) {
      Alert.alert("Error", e.message);
    }
  };

  if (isLoading) {
    return (
      <ThemedView style={styles.centered}>
        <ThemedText>Loading questions...</ThemedText>
      </ThemedView>
    );
  }

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
                errors[item.id] && styles.errorInput,
              ]}
              value={answers[item.id] || ""}
              onChangeText={(text) => handleAnswerChange(item.id, text)}
              placeholder="Your answer"
            />
          </View>
        )}
        ListFooterComponent={
          <Button title="Submit Evaluation" onPress={handleSubmit} />
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
  },
  questionContainer: {
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    marginTop: 8,
    borderRadius: 4,
  },
  errorInput: {
    borderColor: "red",
  },
});
