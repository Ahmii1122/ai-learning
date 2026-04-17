import React, { useState, useEffect } from "react";
import flashcardService from "../../services/flashcardService";
import { BookOpen, Brain, ChevronRight, LayoutGrid, List } from "lucide-react";
import { Link } from "react-router-dom";
import Spinner from "../common/Spinner";
import Button from "../common/Button";

interface FlashcardsTabProps {
  documentId: string;
}

const FlashcardsTab: React.FC<FlashcardsTabProps> = ({ documentId }) => {
  const [flashcardSets, setFlashcardSets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");

  useEffect(() => {
    const fetchFlashcards = async () => {
      try {
        setLoading(true);
        const res = await flashcardService.getFlashcardsForDocument(documentId);
        setFlashcardSets(res.data || []);
      } catch {
        setFlashcardSets([]);
      } finally {
        setLoading(false);
      }
    };
    fetchFlashcards();
  }, [documentId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <Spinner />
      </div>
    );
  }

  if (flashcardSets.length === 0) {
    return (
      <div className="bg-slate-50 border border-slate-100 rounded-2xl p-12 text-center flex flex-col items-center">
        <BookOpen className="w-12 h-12 text-slate-300 mb-4" />
        <h3 className="text-slate-800 font-bold text-lg mb-2">No Flashcards Yet</h3>
        <p className="text-slate-500 text-sm max-w-sm">
          Use the AI Actions tab to generate a custom set of flashcards based on this document.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500 font-medium">
          {flashcardSets.length} {flashcardSets.length === 1 ? "Set" : "Sets"} found
        </p>
        <div className="flex items-center gap-1 bg-slate-100 rounded-xl p-1">
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 rounded-lg transition-all ${viewMode === "list" ? "bg-white shadow-sm text-emerald-600" : "text-slate-400 hover:text-slate-600"}`}
            title="List view"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded-lg transition-all ${viewMode === "grid" ? "bg-white shadow-sm text-emerald-600" : "text-slate-400 hover:text-slate-600"}`}
            title="Grid view"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* List View */}
      {viewMode === "list" && (
        <div className="space-y-3">
          {flashcardSets.map((set, index) => (
            <div
              key={set._id || index}
              className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col sm:flex-row items-center justify-between gap-4 hover:shadow-lg hover:border-emerald-200 transition-all"
            >
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center shrink-0">
                  <Brain className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <h4 className="text-slate-900 font-bold">Deck {index + 1}</h4>
                  <p className="text-slate-500 text-sm">
                    {set.cards?.length || 0} cards · Created {new Date(set.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <Link to={`/documents/${documentId}/flashcards`} className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto px-6 text-sm bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/25">
                  Study Now <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>
          ))}
        </div>
      )}

      {/* Grid View */}
      {viewMode === "grid" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {flashcardSets.map((set, index) => (
            <div
              key={set._id || index}
              className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col gap-4 hover:shadow-lg hover:border-emerald-200 transition-all"
            >
              <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center">
                <Brain className="w-6 h-6 text-emerald-600" />
              </div>
              <div className="flex-1">
                <h4 className="text-slate-900 font-bold text-lg mb-1">Deck {index + 1}</h4>
                <p className="text-slate-500 text-sm">{set.cards?.length || 0} cards</p>
                <p className="text-slate-400 text-xs mt-1">
                  {new Date(set.createdAt).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}
                </p>
              </div>
              <Link to={`/documents/${documentId}/flashcards`} className="w-full mt-auto">
                <Button className="w-full text-sm bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/25">
                  Study Now <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FlashcardsTab;
