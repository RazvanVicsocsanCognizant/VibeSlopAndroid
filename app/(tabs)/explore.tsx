import { useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, TextInput } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Developer } from "@/types";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function ExploreScreen() {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const [description, setDescription] = useState("");
  const [technologies, setTechnologies] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const textInputStyle = {
    borderColor: Colors[colorScheme ?? "light"].icon,
    color: Colors[colorScheme ?? "light"].text,
    backgroundColor: Colors[colorScheme ?? "light"].background,
  };

  const buttonStyle = {
    backgroundColor: Colors[colorScheme ?? "light"].tint,
  };

  const scale = useSharedValue(1);

  const animatedButtonStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: withSpring(isLoading ? 0.95 : scale.value) }],
      opacity: isLoading ? 0.7 : 1,
    };
  });

  const mockSubmitProject = async (project: { description: string; technologies: string }): Promise<Developer[]> => {
    console.log('--- Mock API POST Request ---');
    console.log('Endpoint: /api/developers/find');
    console.log('Body:', project);
  
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));
  
    const mockDevelopers: Developer[] = [
      {
        id: '1',
        name: 'Alice Johnson',
        photo: 'https://i.pravatar.cc/150?u=alice',
        yearsOfExperience: 5,
        location: 'San Francisco, CA',
        techStack: ['React', 'Node.js', 'TypeScript'],
        available: 'Yes',
        project: '',
      },
      {
        id: '2',
        name: 'Bob Williams',
        photo: 'https://i.pravatar.cc/150?u=bob',
        yearsOfExperience: 8,
        location: 'New York, NY',
        techStack: ['Angular', 'Firebase', 'Java'],
        available: 'Yes',
        project: '',
      },
      {
        id: '3',
        name: 'Charlie Brown',
        photo: 'https://i.pravatar.cc/150?u=charlie',
        yearsOfExperience: 3,
        location: 'Chicago, IL',
        techStack: ['Vue', 'Python', 'Django'],
        available: 'Yes',
        project: '',
      },
      {
        id: '4',
        name: 'Diana Prince',
        photo: 'https://i.pravatar.cc/150?u=diana',
        yearsOfExperience: 10,
        location: 'Themyscira',
        techStack: ['Swift', 'Kotlin', 'React Native'],
        available: 'No',
        project: 'Justice League App',
      },
      {
        id: '5',
        name: 'Ethan Hunt',
        photo: 'https://i.pravatar.cc/150?u=ethan',
        yearsOfExperience: 12,
        location: 'Global',
        techStack: ['C++', 'Unreal Engine', 'Security'],
        available: 'Yes',
        project: '',
      },
      {
        id: '6',
        name: 'Frank Castle',
        photo: 'https://i.pravatar.cc/150?u=frank',
        yearsOfExperience: 7,
        location: 'New York, NY',
        techStack: ['Firearms', 'Tactics'],
        available: 'No',
        project: 'War Journal',
      },
      {
        id: '7',
        name: 'Gwen Stacy',
        photo: 'https://i.pravatar.cc/150?u=gwen',
        yearsOfExperience: 2,
        location: 'New York, NY',
        techStack: ['React', 'Web Sockets'],
        available: 'Yes',
        project: '',
      },
      {
        id: '8',
        name: 'Hank Pym',
        photo: 'https://i.pravatar.cc/150?u=hank',
        yearsOfExperience: 20,
        location: 'San Francisco, CA',
        techStack: ['Quantum Physics', 'Robotics'],
        available: 'No',
        project: 'Pym Particles',
      },
      {
        id: '9',
        name: 'Ivy Pepper',
        photo: 'https://i.pravatar.cc/150?u=ivy',
        yearsOfExperience: 4,
        location: 'Gotham City',
        techStack: ['Botany', 'Toxicolgy'],
        available: 'Yes',
        project: '',
      },
      {
        id: '10',
        name: 'John Wick',
        photo: 'https://i.pravatar.cc/150?u=john',
        yearsOfExperience: 15,
        location: 'Continental',
        techStack: ['Gun-fu', 'Driving'],
        available: 'No',
        project: 'Retirement',
      },
      {
        id: '11',
        name: 'Kara Danvers',
        photo: 'https://i.pravatar.cc/150?u=kara',
        yearsOfExperience: 10,
        location: 'National City',
        techStack: ['Journalism', 'Kryptonian Tech'],
        available: 'Yes',
        project: '',
      },
      {
        id: '12',
        name: 'Luke Skywalker',
        photo: 'https://i.pravatar.cc/150?u=luke',
        yearsOfExperience: 5,
        location: 'Tatooine',
        techStack: ['Piloting', 'The Force'],
        available: 'Yes',
        project: '',
      },
      {
        id: '13',
        name: 'Matt Murdock',
        photo: 'https://i.pravatar.cc/150?u=matt',
        yearsOfExperience: 6,
        location: "Hell's Kitchen, NY",
        techStack: ['Law', 'Acrobatics'],
        available: 'Yes',
        project: '',
      },
      {
        id: '14',
        name: 'Natasha Romanoff',
        photo: 'https://i.pravatar.cc/150?u=natasha',
        yearsOfExperience: 11,
        location: 'Global',
        techStack: ['Espionage', 'Combat'],
        available: 'No',
        project: 'Avengers Initiative',
      },
      {
        id: '15',
        name: 'Oliver Queen',
        photo: 'https://i.pravatar.cc/150?u=oliver',
        yearsOfExperience: 8,
        location: 'Star City',
        techStack: ['Archery', 'Gadgets'],
        available: 'Yes',
        project: '',
      },
    ];
  
    console.log('--- Mock API Response ---');
    console.log('Received developers:', mockDevelopers);
  
    return mockDevelopers;
  };

  const handleSubmit = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const developers = await mockSubmitProject({ description, technologies });
      router.push({ pathname: '/developers', params: { developers: JSON.stringify(developers) } });
      setDescription("");
      setTechnologies("");
    } catch (error) {
      console.error("Failed to submit project:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ThemedView style={[styles.pageContainer, { paddingTop: insets.top }]}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <ThemedView style={styles.container}>
          <ThemedView style={styles.inputContainer}>
            <ThemedText style={styles.label}>Project description</ThemedText>
            <TextInput
              style={[styles.textInput, styles.largeTextInput, textInputStyle]}
              value={description}
              onChangeText={setDescription}
              placeholder="Describe your project here..."
              placeholderTextColor={Colors[colorScheme ?? "light"].icon}
              multiline
              textAlignVertical="top"
            />
          </ThemedView>

          <ThemedView style={styles.inputContainer}>
            <ThemedText style={styles.label}>
              (optional) technologies you want to use
            </ThemedText>
            <TextInput
              style={[styles.textInput, textInputStyle]}
              value={technologies}
              onChangeText={setTechnologies}
              placeholder="e.g., React, Firebase, etc."
              placeholderTextColor={Colors[colorScheme ?? "light"].icon}
            />
          </ThemedView>
        </ThemedView>
      </ScrollView>
      <AnimatedPressable
        style={[
          styles.button,
          buttonStyle,
          { bottom: insets.bottom + 20 },
          animatedButtonStyle,
        ]}
        disabled={isLoading}
        onPressIn={() => (scale.value = withSpring(0.95))}
        onPress={handleSubmit}
        onPressOut={() => (scale.value = withSpring(1))}
        onHoverIn={() => (scale.value = withSpring(1.05))}
        onHoverOut={() => (scale.value = withSpring(1))}
      >
        {isLoading ? (
          <ActivityIndicator color="black" />
        ) : (
          <ThemedText style={styles.buttonText}>Submit</ThemedText>
        )}
      </AnimatedPressable>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 16,
    // Add padding to the bottom to ensure the last input is not hidden by the floating button
    paddingBottom: 120,
  },
  container: {
    // Padding is now in scrollContainer to handle the alignment correctly.
    gap: 16,
  },
  inputContainer: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
  },
  largeTextInput: {
    height: 200,
    paddingTop: 12,
  },
  button: {
    position: "absolute",
    left: 20,
    right: 20,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4, // Shadow for Android
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
