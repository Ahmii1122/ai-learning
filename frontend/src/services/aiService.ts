import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";

const generateFlashcards = async (documentId: string, options: any) => {
  try {
    const response = await axiosInstance.post(
      API_PATHS.AI.GENERATE_FLASHCARDS,
      { documentId, ...options },
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error || { message: "Failed to generate flashcards" };
  }
};

const generateQuiz = async (documentId: string, options: any) => {
  try {
    const response = await axiosInstance.post(API_PATHS.AI.GENERATE_QUIZ, {
      documentId,
      ...options,
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error || { message: "Failed to generate quiz" };
  }
};

const generateSummary = async (documentId: string) => {
  try {
    const response = await axiosInstance.post(API_PATHS.AI.GENERATE_SUMMARY, {
      documentId,
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error || { message: "Failed to generate summary" };
  }
};

const chat = async (documentId: string, message: string) => {
  try {
    const response = await axiosInstance.post(API_PATHS.AI.CHAT, {
      documentId,
      message,
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error || { message: "Failed to chat" };
  }
};

const explainConcept = async (documentId: string, concept: string) => {
  try {
    const response = await axiosInstance.post(API_PATHS.AI.EXPLAIN_CONCEPT, {
      documentId,
      concept,
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error || { message: "Failed to explain concept" };
  }
};

const getChatHistory = async (documentId: string) => {
  try {
    const response = await axiosInstance.get(
      API_PATHS.AI.GET_CHAT_HISTORY(documentId),
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error || { message: "Failed to get chat history" };
  }
};

const aiService = {
  generateFlashcards,
  generateQuiz,
  generateSummary,
  chat,
  explainConcept,
  getChatHistory,
};

export default aiService;
