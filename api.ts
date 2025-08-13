import { Developer, DeveloperDetail, Interview, Question } from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

const API_BASE_URL =
  Platform.OS === "android" ? "http://10.0.2.2:8080" : "http://localhost:8080";

// Request and Response bodies for Authentication
export interface AuthRequest {
  username?: string;
  password?: string;
}

export interface AuthResponse {
  token: string;
}

// This interface matches the developer object from your API documentation.
interface ApiDeveloper {
  id: number;
  name: string;
  skills: string[];
}

// This interface matches the detailed developer object from your API.
interface ApiInterview {
  interviewId: number;
  clientName: string;
  feedback: string;
}

interface ApiDeveloperDetail extends ApiDeveloper {
  id: number;
  name: string;
  interviews: ApiInterview[];
}

// Retrieves the token from platform-specific storage.
export const getToken = async (): Promise<string | null> => {
  try {
    if (Platform.OS === "web") {
      return await AsyncStorage.getItem("jwt_token");
    } else {
      return await SecureStore.getItemAsync("jwt_token");
    }
  } catch (error) {
    console.error("Error retrieving token:", error);
    return null;
  }
};

// Securely saves the token, using AsyncStorage on web and SecureStore on mobile.
export const saveToken = async (token: string) => {
  try {
    if (Platform.OS === "web") {
      // Use AsyncStorage for web since SecureStore is not available.
      await AsyncStorage.setItem("jwt_token", token);
    } else {
      await SecureStore.setItemAsync("jwt_token", token);
    }
    console.log("Token stored successfully.");
  } catch (error) {
    console.error("Error saving token:", error);
    throw new Error("Failed to store authentication token.");
  }
};

// Deletes the token from platform-specific storage.
export const deleteToken = async () => {
  try {
    if (Platform.OS === "web") {
      await AsyncStorage.removeItem("jwt_token");
    } else {
      await SecureStore.deleteItemAsync("jwt_token");
    }
    console.log("Token deleted successfully.");
  } catch (error) {
    console.error("Error deleting token:", error);
    throw new Error("Failed to delete authentication token.");
  }
};

// Maps the API developer object to the project's existing Developer type.
const mapApiDeveloperToDeveloper = (apiDeveloper: ApiDeveloper): Developer => {
  return {
    id: apiDeveloper.id.toString(),
    name: apiDeveloper.name,
    techStack: apiDeveloper.skills,
    // The API doesn't provide the following fields, so we use placeholders
    // to match the existing DeveloperCard component structure.
    photo: `https://i.pravatar.cc/150?u=${apiDeveloper.id}`,
    yearsOfExperience: Math.floor(Math.random() * 10) + 1, // e.g., 1-10 years
    location: "Remote",
    available: "Yes",
    project: "",
  };
};

// Maps the detailed API developer object to the project's DeveloperDetail type.
const mapApiDeveloperToDeveloperDetail = (
  apiDeveloper: ApiDeveloperDetail
): DeveloperDetail => {
  return {
    ...mapApiDeveloperToDeveloper(apiDeveloper), // Reuse existing mapping for common fields
    interviews: apiDeveloper.interviews.map(
      (i): Interview => ({
        id: i.interviewId.toString(),
        clientName: i.clientName,
        feedback: i.feedback,
      })
    ),
  };
};

export const loginApi = async (
  authRequest: AuthRequest
): Promise<AuthResponse> => {
  // The documentation mentions both /api/v1/auth/authenticate and /api/v1/auth/register.
  // We'll use /authenticate as it is more conventional for logging in.
  const url = `${API_BASE_URL}/api/v1/auth/authenticate`;
  const headers = {
    "Content-Type": "application/json",
  };
  const body = JSON.stringify(authRequest);

  console.log("--- API Request: Authenticate ---");
  console.log("URL:", url);
  console.log("Headers:", headers);
  console.log("Body:", body);

  const response = await fetch(url, {
    method: "POST",
    headers,
    body,
  });

  const responseBody = await response.json();

  console.log("--- API Response: Authenticate ---");
  console.log("Status:", response.status);
  console.log("Body:", responseBody);

  if (!response.ok) {
    // Assuming the error response has a 'message' field
    throw new Error(
      responseBody.message ||
        "Authentication failed. Please check your credentials."
    );
  }
  return responseBody;
};

export const registerApi = async (
  authRequest: AuthRequest
): Promise<AuthResponse> => {
  const url = `${API_BASE_URL}/api/v1/auth/register`;
  const headers = {
    "Content-Type": "application/json",
  };
  const body = JSON.stringify(authRequest);

  console.log("--- API Request: Register ---");
  console.log("URL:", url);
  console.log("Headers:", headers);
  console.log("Body:", body);

  const response = await fetch(url, { method: "POST", headers, body });
  const responseBody = await response.json();

  console.log("--- API Response: Register ---");
  console.log("Status:", response.status);
  console.log("Body:", responseBody);

  if (!response.ok) {
    throw new Error(responseBody.message || "Registration failed.");
  }
  return responseBody;
};

export const findDevelopersBySkills = async (
  skills: string
): Promise<Developer[]> => {
  const token = await getToken();
  if (!token) {
    throw new Error("Authentication token not found. Please log in again.");
  }

  // The API expects a comma-separated list of skills.
  // We clean up the input to ensure it's in the correct format.
  const skillsQuery = skills
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean) // Remove any empty strings
    .join(",");

  //   const url = `${API_BASE_URL}/api/v1/developers?skills=${encodeURIComponent(
  //     skillsQuery
  //   )}&match=any`;

  const url = `${API_BASE_URL}/api/v1/developers/all`;

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  console.log("--- API Request: Find Developers ---");
  console.log("URL:", url);
  console.log("Headers:", headers);

  const response = await fetch(url, { method: "GET", headers });
  const responseBody = await response.json();

  console.log("--- API Response: Find Developers ---");
  console.log("Status:", response.status);
  console.log("Body:", responseBody);

  if (!response.ok) {
    throw new Error(responseBody.message || "Failed to find developers.");
  }

  const apiDevelopers: ApiDeveloper[] = responseBody;
  return apiDevelopers.map(mapApiDeveloperToDeveloper);
};

export const getDeveloperById = async (
  id: string
): Promise<DeveloperDetail> => {
  const token = await getToken();
  if (!token) {
    throw new Error("Authentication token not found. Please log in again.");
  }

  const url = `${API_BASE_URL}/api/v1/developers/${id}`;
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  console.log("--- API Request: Get Developer By ID ---");
  console.log("URL:", url);
  console.log("Headers:", headers);

  const response = await fetch(url, { method: "GET", headers });
  const responseBody = await response.json();

  console.log("--- API Response: Get Developer By ID ---");
  console.log("Status:", response.status);
  console.log("Body:", responseBody);

  if (!response.ok) {
    throw new Error(
      responseBody.message || `Failed to get developer with id ${id}.`
    );
  }

  return mapApiDeveloperToDeveloperDetail(responseBody);
};

export const generateInterviewQuestions = async (
  technologies: string[]
): Promise<Question[]> => {
  const token = await getToken();
  if (!token) {
    throw new Error("Authentication token not found. Please log in again.");
  }

  const url = `${API_BASE_URL}/api/v1/interviews/generate-questions`;
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
  const body = JSON.stringify({ technologies });

  console.log("--- API Request: Generate Questions ---");
  console.log("URL:", url);
  console.log("Headers:", headers);
  console.log("Body:", body);

  const response = await fetch(url, { method: "POST", headers, body });
  const responseBody = await response.json();

  console.log("--- API Response: Generate Questions ---");
  console.log("Status:", response.status);
  console.log("Body:", responseBody);

  if (!response.ok) {
    throw new Error(responseBody.message || "Failed to generate questions.");
  }

  console.log("Type of questions:", typeof responseBody.questions);

  // The API is expected to return an array of question objects.
  // We map them to the Question type used by the evaluation screen.
  const apiQuestions: { question: string }[] = responseBody.questions;

  const questionsJsonObject = JSON.parse(responseBody.questions);

  const questions = questionsJsonObject.map(
    (q: { question: string }, index: number) => ({
      id: (index + 1).toString(),
      question: q.question,
    })
  );

  return questions;
};

export const generateFeedback = async (
  questions: Question[],
  answers: { [key: string]: string }
): Promise<string> => {
  const token = await getToken();
  if (!token) {
    throw new Error("Authentication token not found. Please log in again.");
  }

  const interviewTranscript = questions
    .map(
      (q) => `Question: ${q.question} Answer: ${answers[q.id]?.trim() || ""}`
    )
    .join(" \n ");

  const url = `${API_BASE_URL}/api/v1/interviews/generate-feedback`;
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
  const body = JSON.stringify({ interviewTranscript });

  console.log("--- API Request: Generate Feedback ---");
  console.log("URL:", url);
  console.log("Headers:", headers);
  console.log("Body:", body);

  const response = await fetch(url, { method: "POST", headers, body });
  // Try to parse the response as JSON. It might be null if body is empty or not valid JSON.
  const responseBody = await response.json().catch(() => null);

  console.log("--- API Response: Generate Feedback ---");
  console.log("Status:", response.status);
  console.log("Body:", responseBody);

  if (!response.ok) {
    throw new Error(
      (responseBody as any)?.message ||
        "An error occurred while submitting the evaluation."
    );
  }

  if (typeof (responseBody as any)?.feedback !== "string") {
    throw new Error("Invalid feedback response from the server.");
  }

  return (responseBody as any).feedback;
};

export const createInterview = async (
  developerId: string,
  feedback: string
): Promise<void> => {
  const token = await getToken();
  if (!token) {
    throw new Error("Authentication token not found. Please log in again.");
  }

  // As per the API spec, a clientId is required.
  // The source for this ID is not clear from the current context.
  // I am using a hardcoded value of 2 based on the example in the documentation.
  // This should be replaced with the actual logged-in user's ID when available.
  const clientId = 2;

  const url = `${API_BASE_URL}/api/v1/interviews`;
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
  const body = JSON.stringify({
    developerId: parseInt(developerId, 10),
    clientId,
    feedback,
  });

  console.log("--- API Request: Create Interview ---");
  console.log("URL:", url);
  console.log("Headers:", headers);
  console.log("Body:", body);

  const response = await fetch(url, { method: "POST", headers, body });

  console.log("--- API Response: Create Interview ---");
  console.log("Status:", response.status);

  if (!response.ok) {
    const responseBody = await response.json().catch(() => ({}));
    console.log("Body:", responseBody);
    throw new Error(
      (responseBody as any)?.message || "Failed to create interview record."
    );
  }
};
