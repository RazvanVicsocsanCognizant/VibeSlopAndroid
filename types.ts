export interface Developer {
  id: string;
  name: string;
  photo: string;
  yearsOfExperience: number;
  location: string;
  techStack: string[];
  available: "Yes" | "No";
  project: string;
  evaluated?: boolean;
  evaluationResult?: string;
}

export interface Interview {
  id: string;
  clientName: string;
  feedback: string;
}

export interface DeveloperDetail extends Developer {
  interviews: Interview[];
}

export interface Question {
  id: string;
  question: string;
}
