const BASE_URL = "https://elvina-semijuridical-ungloweringly.ngrok-free.dev";
const VIDEO_URL = "https://wearisome-halle-marbly.ngrok-free.dev";

export const resetHistory = async (): Promise<void> => {
  await fetch(`${VIDEO_URL}/reset-history`, {
    method: "POST",
    headers: {
      "ngrok-skip-browser-warning": "true",
    },
  });
};

export interface RouterResponse {
  question: string;
  response: {
    explanation_needed: boolean;
    visualization_needed: boolean;
    manim_prompt: string | null;
  };
}

export interface LLMResponse {
  llm_response: string;
}

export interface SetSubjectResponse {
  message: string;
}

export const setSubject = async (subject: "physics" | "mathematics"): Promise<SetSubjectResponse> => {
  const response = await fetch(`${BASE_URL}/api/set-subject`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "ngrok-skip-browser-warning": "true",
    },
    body: JSON.stringify({ subject }),
  });
  
  if (!response.ok) {
    throw new Error("Failed to set subject");
  }
  
  return response.json();
};

export const routerResponse = async (question: string): Promise<RouterResponse> => {
  const response = await fetch(`${BASE_URL}/api/router_response`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "ngrok-skip-browser-warning": "true",
    },
    body: JSON.stringify({ question }),
  });
  
  if (!response.ok) {
    throw new Error("Failed to get router response");
  }
  
  return response.json();
};

export const llmResponse = async (question: string): Promise<LLMResponse> => {
  const response = await fetch(`${BASE_URL}/api/llm_response`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "ngrok-skip-browser-warning": "true",
    },
    body: JSON.stringify({ question }),
  });
  
  if (!response.ok) {
    throw new Error("Failed to get LLM response");
  }
  
  return response.json();
};

export const generateVideo = async (manimPrompt: string): Promise<string> => {
  const response = await fetch(`${VIDEO_URL}/generate-video`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "ngrok-skip-browser-warning": "true",
    },
    body: JSON.stringify({ manim_prompt: manimPrompt }),
  });
  
  if (!response.ok) {
    throw new Error("Failed to generate video");
  }
  
  // Backend returns video file directly, create blob URL
  const blob = await response.blob();
  return URL.createObjectURL(blob);
};
