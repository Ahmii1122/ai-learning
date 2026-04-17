import React, { useState, useEffect } from "react";
import quizService from "../../services/quizService";
import { BrainCircuit, Trophy, ChevronRight, Target, LayoutGrid, List } from "lucide-react";
import { Link } from "react-router-dom";
import Spinner from "../common/Spinner";
import Button from "../common/Button";

interface QuizzesTabProps {
  documentId: string;
}

const QuizzesTab: React.FC<QuizzesTabProps> = ({ documentId }) => {
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        setLoading(true);
        const res = await quizService.getQuizzesForDocument(documentId);
        setQuizzes(res.data || []);
      } catch {
        setQuizzes([]);
      } finally {
        setLoading(false);
      }
    };
    fetchQuizzes();
  }, [documentId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <Spinner />
      </div>
    );
  }

  if (quizzes.length === 0) {
    return (
      <div className="bg-slate-50 border border-slate-100 rounded-2xl p-12 text-center flex flex-col items-center">
        <BrainCircuit className="w-12 h-12 text-slate-300 mb-4" />
        <h3 className="text-slate-800 font-bold text-lg mb-2">No Quizzes Yet</h3>
        <p className="text-slate-500 text-sm max-w-sm">
          Use the AI Actions tab to generate a quiz from this document to test your knowledge.
        </p>
      </div>
    );
  }

  const ScoreBadge = ({ percentage }: { percentage: number }) => (
    <span
      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
        percentage >= 80
          ? "bg-emerald-100 text-emerald-700"
          : percentage >= 50
          ? "bg-amber-100 text-amber-700"
          : "bg-red-100 text-red-700"
      }`}
    >
      {percentage}% Score
    </span>
  );

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500 font-medium">
          {quizzes.length} {quizzes.length === 1 ? "Quiz" : "Quizzes"} found
        </p>
        <div className="flex items-center gap-1 bg-slate-100 rounded-xl p-1">
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 rounded-lg transition-all ${viewMode === "list" ? "bg-white shadow-sm text-teal-600" : "text-slate-400 hover:text-slate-600"}`}
            title="List view"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded-lg transition-all ${viewMode === "grid" ? "bg-white shadow-sm text-teal-600" : "text-slate-400 hover:text-slate-600"}`}
            title="Grid view"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* List View */}
      {viewMode === "list" && (
        <div className="space-y-3">
          {quizzes.map((quiz) => {
            const isCompleted = quiz.userAnswers && quiz.userAnswers.length > 0;
            const percentage = quiz.score !== undefined ? quiz.score : 0;
            return (
              <div
                key={quiz._id}
                className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col sm:flex-row items-center justify-between gap-4 hover:shadow-lg hover:border-teal-200 transition-all"
              >
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${isCompleted ? "bg-blue-50" : "bg-teal-50"}`}>
                    {isCompleted ? (
                      <Trophy className="w-6 h-6 text-blue-600" />
                    ) : (
                      <BrainCircuit className="w-6 h-6 text-teal-600" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-slate-900 font-bold line-clamp-1">{quiz.title}</h4>
                    <div className="flex items-center gap-3 mt-1">
                      <p className="text-slate-500 text-sm flex items-center gap-1">
                        <Target className="w-3.5 h-3.5" /> {quiz.totalQuestions} Questions
                      </p>
                      {isCompleted && <ScoreBadge percentage={percentage} />}
                    </div>
                  </div>
                </div>
                <Link to={isCompleted ? `/quizzes/${quiz._id}/results` : `/quizzes/${quiz._id}`} className="w-full sm:w-auto">
                  <Button
                    className={`w-full sm:w-auto px-6 text-sm ${isCompleted ? "bg-blue-600 hover:bg-blue-700 shadow-blue-500/25" : "bg-teal-600 hover:bg-teal-700 shadow-teal-500/25"}`}
                  >
                    {isCompleted ? "View Results" : "Take Quiz"}{" "}
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </div>
            );
          })}
        </div>
      )}

      {/* Grid View */}
      {viewMode === "grid" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {quizzes.map((quiz) => {
            const isCompleted = quiz.userAnswers && quiz.userAnswers.length > 0;
            const percentage = quiz.score !== undefined ? quiz.score : 0;
            return (
              <div
                key={quiz._id}
                className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col gap-4 hover:shadow-lg hover:border-teal-200 transition-all"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isCompleted ? "bg-blue-50" : "bg-teal-50"}`}>
                  {isCompleted ? (
                    <Trophy className="w-6 h-6 text-blue-600" />
                  ) : (
                    <BrainCircuit className="w-6 h-6 text-teal-600" />
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="text-slate-900 font-bold line-clamp-2 mb-1">{quiz.title}</h4>
                  <p className="text-slate-500 text-sm flex items-center gap-1 mb-2">
                    <Target className="w-3.5 h-3.5" /> {quiz.totalQuestions} Questions
                  </p>
                  {isCompleted && <ScoreBadge percentage={percentage} />}
                </div>
                <Link to={isCompleted ? `/quizzes/${quiz._id}/results` : `/quizzes/${quiz._id}`} className="w-full mt-auto">
                  <Button
                    className={`w-full text-sm ${isCompleted ? "bg-blue-600 hover:bg-blue-700 shadow-blue-500/25" : "bg-teal-600 hover:bg-teal-700 shadow-teal-500/25"}`}
                  >
                    {isCompleted ? "View Results" : "Take Quiz"}{" "}
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default QuizzesTab;
