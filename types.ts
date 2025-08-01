export interface Developer {
  id: string;
  name: string;
  photo: string;
  yearsOfExperience: number;
  location: string;
  techStack: string[];
  available: "Yes" | "No";
  project: string;
}
