import Document from "../models/Document.js";
import Flashcard from "../models/Flashcard.js";
import Quiz from "../models/Quiz.js";
import { extractTextFromPdf } from "../utils/pdfParser.js";
import { chunkText } from "../utils/textChunker.js";
import fs from "fs/promises";
import mongoose from "mongoose";

export const uploadDocument = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: "Please upload a PDF file",
        success: false,
        status: 400,
      });
    }
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({
        error: "Title is required",
        success: false,
        status: 400,
      });
    }

    const baseUrl = `http://localhost:${process.env.PORT || 8000}`;
    const fileUrl = `${baseUrl}/uploads/documents/${req.file.filename}`;

    const document = await Document.create({
      userId: req.user._id,
      title,
      filename: req.file.filename,
      filePath: fileUrl,
      fileSize: req.file.size,
      status: "processing",
    });

    processPDF(document._id, req.file.path).catch((error) => {
      console.error("Error processing PDF:", error);
    });

    res.status(201).json({
      message: "Document uploaded successfully and processing in background",
      success: true,
      status: 201,
      document,
    });
  } catch (error) {
    if (req.file) {
      await fs.unlink(req.file.path).catch(() => {});
    }
    next(error);
  }
};

const processPDF = async (documentId, filePath) => {
  try {
    const { text } = await extractTextFromPdf(filePath);

    const chunks = chunkText(text, 500, 50);

    await Document.findByIdAndUpdate(documentId, {
      extractedText: text,
      chunks: chunks,
      status: "ready",
    });

    console.log(`Dcoument ${documentId} processed successfully`);
  } catch (error) {
    console.error(`Error processing PDF for document ${documentId}:`, error);
    await Document.findByIdAndUpdate(documentId, {
      status: "failed",
    });
  }
};

export const getDocuments = async (req, res, next) => {
  try {
    const documents = await Document.aggregate([
      {
        $match: { userId: new mongoose.Types.ObjectId(req.user._id) },
      },
      {
        $lookup: {
          from: "flashcards",
          localField: "_id",
          foreignField: "documentId",
          as: "flashcards",
        },
      },
      {
        $lookup: {
          from: "quizzes",
          localField: "_id",
          foreignField: "documentId",
          as: "quizzes",
        },
      },
      {
        $addFields: {
          flashcardCount: { $size: "$flashcards" },
          quizCount: { $size: "$quizzes" },
        },
      },
      {
        $project: {
          extractedText: 0,
          chunks: 0,
          flashcards: 0,
          quizzes: 0,
        },
      },
      {
        $sort: { uploadDate: -1 },
      },
    ]);
    res.status(200).json({
      success: true,
      count: documents.length,
      data: documents,
    });
  } catch (error) {
    next(error);
  }
};

export const getDocument = async (req, res, next) => {
  try {
    const document = await Document.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!document) {
      return res.status(404).json({
        error: "Document not found",
        success: false,
        status: 404,
      });
    }

    const flashcardCount = await Flashcard.countDocuments({
      documentId: document._id,
      userId: req.user._id,
    });

    const quizCount = await Quiz.countDocuments({
      documentId: document._id,
      userId: req.user._id,
    });

    const documentData = document.toObject();
    documentData.flashcardCount = flashcardCount;
    documentData.quizCount = quizCount;

    res.status(200).json({
      success: true,
      data: documentData,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteDocument = async (req, res, next) => {
  try {
    const document = await Document.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!document) {
      return res.status(404).json({
        error: "Document not found",
        success: false,
        status: 404,
      });
    }

    await fs.unlink(document.filePath).catch(() => {});

    await document.deleteOne();

    res.status(200).json({
      success: true,
      message: "Document deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const updateDocument = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};
