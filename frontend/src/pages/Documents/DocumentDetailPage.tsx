import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import documentService from "../../services/documentService";
import Spinner from "../../components/common/Spinner";
import toast from "react-hot-toast";
import PageHeader from "../../components/common/PageHeader";
import Tabs from "../../components/common/Tabs";
import { ArrowLeft, ExternalLink, FileText } from "lucide-react";
import ChatInterface from "../../components/chat/ChatInterface";
import AIActionsTab from "../../components/documents/AIActionsTab";
import FlashcardsTab from "../../components/documents/FlashcardsTab";
import QuizzesTab from "../../components/documents/QuizzesTab";
interface Document {
  _id: string;
  title: string;
  filePath: string;
  fileSize?: number;
  flashcardCount?: number;
  quizCount?: number;
  createdAt: string;
}

const formatFileSize = (bytes: number) => {
  if (bytes === undefined || bytes === null) return "N/A";

  const units = ["B", "KB", "MB", "GB", "TB"];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  return `${size.toFixed(1)} ${units[unitIndex]}`;
};

const DocumentDetailPage = () => {
  const { id } = useParams();
  const [document, setDocument] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("content");

  useEffect(() => {
    const fetchDocumentDetails = async () => {
      try {
        setLoading(true);
        const response = await documentService.getDocumentById(id);
        setDocument(response.data);
      } catch (error) {
        toast.error("Failed to fetch document details");
      } finally {
        setLoading(false);
      }
    };
    fetchDocumentDetails();
  }, [id]);

  //helper function to get full pdf url
  const getPdfUrl = () => {
    if (!document?.filePath) return null;

    const filePath = document.filePath;

    if (filePath.startsWith("http://") || filePath.startsWith("https://")) {
      return filePath;
    }

    const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";
    return `${baseUrl}${filePath.startsWith("/") ? "" : "/"} ${filePath}`;
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-[400px]">
          {/* <Spinner size="lg" /> */}
        </div>
      );
    }
    if (!document || !document.filePath) {
      return (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <FileText className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-slate-900 mb-2">
              Document Not Found
            </h3>
            <p className="text-slate-500 mb-6">
              The document you are looking for does not exist or has been
              deleted.
            </p>
            <Link
              to="/documents"
              className="text-emerald-600 hover:text-emerald-700 font-medium"
            >
              Back to Documents
            </Link>
          </div>
        </div>
      );
    }
    const pdfUrl = getPdfUrl();

    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <span className="text-lg font-medium text-slate-900">
            Document Viewer
          </span>
          <a href={pdfUrl} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="w-4 h-4 text-slate-600" />
            <span className="text-sm font-medium text-slate-700">
              open in new tab
            </span>
          </a>
        </div>
        <div className="h-[600px] overflow-hidden rounded-xl border border-slate-200">
          <iframe
            src={pdfUrl}
            title={document.title}
            frameborder="0"
            className="w-full h-full"
          />
        </div>
      </div>
    );
  };

  const renderChat = () => {
    return <ChatInterface />;
  };
  const renderAIActions = () => {
    return <AIActionsTab documentId={id!} />;
  };

  const renderFlashcardsTab = () => {
    return <FlashcardsTab documentId={id!} />;
  };

  const renderQuizzesTab = () => {
    return <QuizzesTab documentId={id!} />;
  };

  const tabs = [
    { name: "content", label: "Content", content: renderContent() },
    { name: "Chat", label: "Chat", content: renderChat() },
    { name: "AI Actions", label: "AI Actions", content: renderAIActions() },
    { name: "Flashcards", label: "Flashcards", content: renderFlashcardsTab() },
    { name: "Quizzes", label: "Quizzes", content: renderQuizzesTab() },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        {/* <Spinner size="lg" /> */}
      </div>
    );
  }
  if (!document) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <FileText className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-slate-900 mb-2">
            Document Not Found
          </h3>
          <p className="text-slate-500 mb-6">
            The document you are looking for does not exist or has been deleted.
          </p>
          <Link
            to="/documents"
            className="text-emerald-600 hover:text-emerald-700 font-medium"
          >
            Back to Documents
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="">
      <Link
        to="/documents"
        className="inline-flex items-center gap-2 text-sm text-neutral-600 hover:text-neutral-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 text-slate-600" />
        Back to Documents
      </Link>
      <PageHeader title={document.title} />
      <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
};
export default DocumentDetailPage;
