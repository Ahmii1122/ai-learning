import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  Brain,
  Clock,
  ChevronRight,
  Trash2,
  Search,
  Filter,
} from "lucide-react";
import toast from "react-hot-toast";
import flashcardService from "../../services/flashcardService";
import PageHeader from "../../components/common/PageHeader";
import Button from "../../components/common/Button";

interface FlashcardSet {
  _id: string;
  documentId:
    | {
        _id: string;
        title: string;
      }
    | string;
  cards: any[];
  createdAt: string;
  updatedAt: string;
}

const FlashcardsListPage = () => {
  const [sets, setSets] = useState<FlashcardSet[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchSets = async () => {
    try {
      setLoading(true);
      const response = await flashcardService.getAllFlashcards();
      setSets(response.data);
    } catch (error) {
      toast.error("Failed to fetch flashcard sets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSets();
  }, []);

  const handleDeleteSet = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this flashcard set?"))
      return;

    try {
      await flashcardService.deleteFlashcardSet(id);
      toast.success("Flashcard set deleted");
      setSets(sets.filter((set) => set._id !== id));
    } catch (error) {
      toast.error("Failed to delete set");
    }
  };

  const filteredSets = sets.filter((set) => {
    const title =
      typeof set.documentId === "object"
        ? set.documentId.title
        : "Untitled Set";
    return title.toLowerCase().includes(searchTerm.toLowerCase());
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            Flashcards
          </h1>
          <p className="text-slate-500 mt-1">
            Master your subjects with AI-generated flashcards
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search sets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all w-full md:w-64"
            />
          </div>
          <Button variant="outline" size="sm" className="hidden md:flex gap-2">
            <Filter className="w-4 h-4" /> Filter
          </Button>
        </div>
      </div>

      {filteredSets.length === 0 ? (
        <div className="bg-white rounded-[32px] border border-slate-100 p-12 text-center shadow-sm">
          <div className="w-20 h-20 bg-emerald-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <BookOpen className="w-10 h-10 text-emerald-500" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">
            No flashcards found
          </h3>
          <p className="text-slate-500 max-w-sm mx-auto mb-8">
            Upload a document and use the AI tools to generate your first
            flashcard set.
          </p>
          <Link to="/documents">
            <Button>Go to Documents</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSets.map((set) => {
            const documentTitle =
              typeof set.documentId === "object"
                ? set.documentId.title
                : "Untitled Document";
            const documentId =
              typeof set.documentId === "object"
                ? set.documentId._id
                : set.documentId;

            return (
              <Link
                key={set._id}
                to={`/documents/${documentId}/flashcards`}
                className="group bg-white rounded-[28px] border border-slate-100 p-6 shadow-sm hover:shadow-xl hover:shadow-emerald-500/5 hover:border-emerald-100 transition-all duration-300 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50/50 rounded-full -mr-16 -mt-16 group-hover:bg-emerald-100/50 transition-colors duration-300" />

                <div className="relative">
                  <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Brain className="w-6 h-6 text-emerald-600" />
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-emerald-700 transition-colors line-clamp-2">
                    {documentTitle}
                  </h3>

                  <div className="flex items-center gap-4 mt-4">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 bg-slate-50 px-2.5 py-1 rounded-lg">
                      <BookOpen className="w-3.5 h-3.5" />
                      {set.cards.length} Cards
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400">
                      <Clock className="w-3.5 h-3.5" />
                      {new Date(set.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-6 pt-6 border-t border-slate-50">
                    <span className="text-sm font-bold text-emerald-600 flex items-center gap-1 group-hover:gap-2 transition-all">
                      Study Now <ChevronRight className="w-4 h-4" />
                    </span>

                    <button
                      onClick={(e) => handleDeleteSet(set._id, e)}
                      className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default FlashcardsListPage;
