import { Image } from "expo-image";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Developer } from "@/types";
import { Stack, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, Pressable, StyleSheet, View } from "react-native";

async function fetchEvaluatedDevelopers(): Promise<Developer[]> {
  // Simulate a GET request to fetch evaluated developers
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: "1",
          name: "Alicia Martin",
          photo: "https://randomuser.me/api/portraits/women/1.jpg",
          yearsOfExperience: 5,
          location: "San Francisco, CA",
          techStack: ["React", "Node.js", "TypeScript"],
          available: "No",
          project: "E-commerce Platform",
          evaluated: true,
          evaluationResult: "Alicia is a strong candidate with excellent React skills.",
        },
        {
          id: "2",
          name: "John Doe",
          photo: "https://randomuser.me/api/portraits/men/2.jpg",
          yearsOfExperience: 8,
          location: "New York, NY",
          techStack: ["Angular", "Java", "Spring"],
          available: "Yes",
          project: "",
          evaluated: false,
          evaluationResult: "John has a solid background but lacks recent experience with our tech stack.",
        },
      ]);
    }, 1000);
  });
}

function EvaluatedDeveloperCard({ developer }: { developer: Developer }) {
  const router = useRouter();

  return (
    <Pressable
      style={styles.card}
      onPress={() =>
        router.push({
          pathname: "/developer-details",
          params: { developer: JSON.stringify(developer) },
        })
      }
    >
      <Image source={{ uri: developer.photo }} style={styles.photo} />
      <View style={styles.infoContainer}>
        <ThemedText type="subtitle">{developer.name}</ThemedText>
        <ThemedText>{developer.evaluated ? "Passed" : "Failed"}</ThemedText>
      </View>
    </Pressable>
  );
}

export default function EvaluatedScreen() {
  const [developers, setDevelopers] = useState<Developer[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchEvaluatedDevelopers().then((data) => {
      setDevelopers(data);
      setIsLoading(false);
    });
  }, []);

  if (isLoading) {
    return (
      <ThemedView style={styles.centered}>
        <ThemedText>Loading evaluated developers...</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen options={{ title: "Evaluated Developers" }} />
      <FlatList
        data={developers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <EvaluatedDeveloperCard developer={item} />}
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
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  photo: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
  infoContainer: {
    flex: 1,
  },
});
