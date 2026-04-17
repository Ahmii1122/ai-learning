import Document from "../models/Document.js";
import Flashcard from "../models/Flashcard.js";
import Quiz from "../models/Quiz.js";
import ChatHistory from "../models/ChatHistory.js";
import * as geminiService from "../utils/geminiService.js";
import { findRelevantChunks } from "../utils/textChunker.js";

export const generateFlashcards = async (req, res, next) => {
  try {
    const { documentId, count = 10 } = req.body;
    if (!documentId) {
      return res.status(400).json({
        success: false,
        statuscode: 400,
        error: "Please Provide a valid document ",
      });
    }

    const document = await Document.findOne({
      _id: documentId,
      userId: req.user._id,
      status: "ready",
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        statuscode: 404,
        error: "Document not found or not ready for AI processing",
      });
    }
    const cards = await geminiService.generateFlashcards(
      document.extractedText,
      parseInt(count),
    );

    const flashcardSet = await Flashcard.create({
      userId: req.user._id,
      documentId: document._id,
      cards: cards.map((card) => ({
        question: card.question,
        answer: card.answer,
        difficulty: card.difficulty,
        reviewCount: 0,
        isStarred: false,
      })),
    });
    res.status(201).json({
      success: true,
      data: flashcardSet,
      message: "Flashcards generated successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const generateQuiz = async (req, res, next) => {
  try {
    const { documentId, numQuestions = 5, title } = req.body;

    if (!documentId) {
      return res.status(400).json({
        success: false,
        statuscode: 400,
        error: "Please Provide a valid document ID",
      });
    }

    const document = await Document.findOne({
      _id: documentId,
      userId: req.user._id,
      status: "ready",
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        statuscode: 404,
        error: "Document not found or not ready for AI processing",
      });
    }

    const questions = await geminiService.generateQuiz(
      document.extractedText,
      parseInt(numQuestions),
    );

    const quiz = await Quiz.create({
      userId: req.user._id,
      documentId: document._id,
      title: title || `${document.title} - Quiz`,
      questions: questions,
      totalQuestions: questions.length,
      userAnswers: [],
      score: 0,
    });

    res.status(201).json({
      success: true,
      data: quiz,
      message: "Quiz generated successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const generateSummary = async (req, res, next) => {
  try {
    const { documentId } = req.body;

    if (!documentId) {
      return res.status(400).json({
        success: false,
        statuscode: 400,
        error: "Please Provide a valid document ID",
      });
    }
    const document = await Document.findOne({
      _id: documentId,
      userId: req.user._id,
      status: "ready",
    });
    if (!document) {
      return res.status(404).json({
        success: false,
        statuscode: 404,
        error: "Document not found or not ready for AI processing",
      });
    }

    const summary = await geminiService.generateSummary(document.extractedText);

    res.status(200).json({
      success: true,
      data: summary,
      message: "Summary generated successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const chat = async (req, res, next) => {
  try {
    const { documentId, message, question } = req.body;
    const query = message || question;

    if (!documentId || !query) {
      return res.status(400).json({
        success: false,
        statuscode: 400,
        error: "Please Provide a valid document ID and a message or question",
      });
    }

    const document = await Document.findOne({
      _id: documentId,
      userId: req.user._id,
    }).lean();

    if (!document) {
      return res.status(404).json({
        success: false,
        statuscode: 404,
        error: "Document not found",
      });
    }

    if (document.status !== "ready") {
      return res.status(400).json({
        success: false,
        statuscode: 400,
        error: `Document is not ready for AI processing (Current status: ${document.status})`,
      });
    }

    const relevantChunks = findRelevantChunks(document.chunks, query);
    const chunkIndices = relevantChunks.map((c) => c.chunkIndex).filter(c => c !== null && c !== undefined);

    let chatHistory = await ChatHistory.findOne({
      userId: req.user._id,
      documentId: documentId,
    });
    if (!chatHistory) {
      chatHistory = new ChatHistory({
        userId: req.user._id,
        documentId: documentId,
      });
    }

    const answer = await geminiService.chatWithContext(query, relevantChunks);

    chatHistory.messages.push(
      {
        role: "user",
        content: query,
        timestamp: new Date(),
        relevantChunks: [],
      },
      {
        role: "assistant",
        content: answer,
        timestamp: new Date(),
        relevantChunks: chunkIndices,
      },
    );

    await chatHistory.save();

    res.status(200).json({
      success: true,
      data: {
        question: query,
        answer,
        relevantChunks: chunkIndices,
        chatHistoryId: chatHistory._id,
      },
      message: "Response generated successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const explainConcept = async (req, res, next) => {
  try {
    const { documentId, concept } = req.body;

    if (!documentId || !concept) {
      return res.status(400).json({
        success: false,
        statuscode: 400,
        error: "Please Provide a valid document ID and concept",
      });
    }

    const document = await Document.findOne({
      _id: documentId,
      userId: req.user._id,
      status: "ready",
    }).lean();
    if (!document) {
      return res.status(404).json({
        success: false,
        statuscode: 404,
        error: "Document not found or not ready for AI processing",
      });
    }

    const relevantChunks = findRelevantChunks(document.chunks, concept, 3);
    if (!relevantChunks.length) {
      return res.status(200).json({
        success: true,
        data: {
          concept,
          explanation:
            "I could not find this concept in the selected document context.",
          relevantChunks: [],
        },
        message: "Concept not found in the selected document",
      });
    }
    const context = relevantChunks.map((c) => c.content).join("\n\n");

    const explanation = await geminiService.explainConcept(context, concept);

    res.status(200).json({
      success: true,
      data: {
        concept,
        explanation,
        relevantChunks: relevantChunks.map((c) => c.chunkIndex),
      },
      message: "Concept explained successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const getChatHistory = async (req, res, next) => {
  try {
    const { documentId } = req.params;

    if (!documentId) {
      return res.status(400).json({
        success: false,
        statuscode: 400,
        error: "Please Provide a valid document ID",
      });
    }

    const chatHistory = await ChatHistory.findOne({
      userId: req.user._id,
      documentId: documentId,
    }).select("messages");

    if (!chatHistory) {
      return res.status(200).json({
        success: true,
        data: [],
        message: " No chat history found",
      });
    }

    res.status(200).json({
      success: true,
      data: chatHistory.messages,
      message: "Chat history fetched successfully",
    });
  } catch (error) {
    next(error);
  }
};
