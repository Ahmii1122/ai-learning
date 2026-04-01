import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";

const getQuizzesForDocument = async (documentId: string) => {
  try {
    const response = await axiosInstance.get(
      API_PATHS.QUIZZES.GET_QUIZZES_FOR_DOC(documentId),
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error || { message: "Failed to get quizzes for document" };
  }
};

const getQuizById = async (quizId: string) => {
  try {
    const response = await axiosInstance.get(
      API_PATHS.QUIZZES.GET_QUIZ_BY_ID(quizId),
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error || { message: "Failed to get quiz by id" };
  }
};
const submitQuiz = async (quizId: string, answers: string[]) => {
  try {
    const response = await axiosInstance.post(
      API_PATHS.QUIZZES.SUBMIT_QUIZ(quizId),
      { answers },
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error || { message: "Failed to submit quiz" };
  }
};

const getQuizResults = async (quizId: string) => {
  try {
    const response = await axiosInstance.get(
      API_PATHS.QUIZZES.GET_QUIZ_RESULTS(quizId),
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error || { message: "Failed to get quiz results" };
  }
};

const deleteQuiz = async (quizId: string) => {
  try {
    const response = await axiosInstance.delete(
      API_PATHS.QUIZZES.DELETE_QUIZ(quizId),
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error || { message: "Failed to delete quiz" };
  }
};

const quizService = {
  getQuizzesForDocument,
  getQuizById,
  submitQuiz,
  getQuizResults,
  deleteQuiz,
};

export default quizService;
