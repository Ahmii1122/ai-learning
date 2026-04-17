import fs from "fs/promises";
import { PDFParse } from "pdf-parse";

export const extractTextFromPdf = async (filePath) => {
  try {
    // Check if file exists
    await fs.access(filePath);
    const dataBuffer = await fs.readFile(filePath);

    console.log(`Starting PDF extraction for: ${filePath}`);

    // The new version of pdf-parse uses a class-based API
    const parser = new PDFParse({ data: dataBuffer });
    const data = await parser.getText();

    console.log(`Successfully extracted ${data.text?.length || 0} characters`);

    return {
      text: data.text || "",
      numPages: data.total || 0,
      info: data.info || {},
    };
  } catch (error) {
    console.error("Detailed error in extractTextFromPdf:", error);
    throw error;
  }
};
