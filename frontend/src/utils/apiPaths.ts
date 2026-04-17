export const BASE_URL = "http://localhost:8000/api";

export const API_PATHS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    GET_PROFILE: "/auth/profile",
    UPDATE_PROFILE: "/auth/profile",
    CHANGE_PASSWORD: "/auth/change-password",
  },

  DOCUMENTS: {
    GET_DOCUMENTS: "/documents",
    UPLOAD: "/documents/upload",
    GET_DOCUMENT_BY_ID: (id: string) => `/documents/${id}`,
    UPDATE_DOCUMENT: (id: string) => `/documents/${id}`,
    DELETE_DOCUMENT: (id: string) => `/documents/${id}`,
  },

  AI: {
    GENERATE_SUMMARY: "/ai/generate-summary",
    GENERATE_QUIZ: "/ai/generate-quiz",
    GENERATE_FLASHCARDS: "/ai/generate-flashcards",
    CHAT: "/ai/chat",
    EXPLAIN_CONCEPT: "/ai/explain-concept",
    GET_CHAT_HISTORY: (documentId: string) => `/ai/chat-history/${documentId}`,
  },

  FLASHCARDS: {
    GET_ALL_FLASHCARD_SETS: "/flashcards",
    GET_FLASHCARDS_FOR_DOC: (documentId: string) => `/flashcards/${documentId}`,
    REVIEW_FLASHCARD: (cardId: string) => `/flashcards/${cardId}/review`,
    TOGGLE_STAR: (cardId: string) => `/flashcards/${cardId}/star`,
    DELETE_FLASHCARD_SET: (Id: string) => `/flashcards/${Id}`,
  },

  QUIZZES: {
    GET_QUIZZES_FOR_DOC: (documentId: string) => `/quizzes/${documentId}`,
    GET_QUIZ_BY_ID: (quizId: string) => `/quizzes/quiz/${quizId}`,
    SUBMIT_QUIZ: (quizId: string) => `/quizzes/${quizId}/submit`,
    GET_QUIZ_RESULTS: (quizId: string) => `/quizzes/${quizId}/results`,
    DELETE_QUIZ: (quizId: string) => `/quizzes/${quizId}`,
  },
  PROGRESS: {
    GET_DASHBOARD: "/progress/dashboard",
  },
};
