import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Trophy,
  Target,
  Clock,
  ArrowLeft,
  CheckCircle2,
  HelpCircle,
  BarChart3,
  RotateCcw,
} from "lucide-react";
import quizService from "../../services/quizService";
import toast from "react-hot-toast";
import Button from "../../components/common/Button";
import ConfirmModal from "../../components/common/ConfirmModal";

const QuizResultPage = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [quizResults, setQuizResults] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showRetakeModal, setShowRetakeModal] = useState(false);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        const response = await quizService.getQuizResults(quizId!);
        setQuizResults(response);
      } catch (error) {
        toast.error("Failed to load results");
        navigate("/dashboard");
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [quizId, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-teal-500/20 border-t-teal-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  const { score, totalQuestions } = quizResults.data;
  const questions = quizResults.results || [];
  const percentage = score;

  const correctCount = questions.filter((q: any) => q.isCorrect).length;

  const getScoreColor = () => {
    if (percentage >= 80) return "text-emerald-500";
    if (percentage >= 50) return "text-amber-500";
    return "text-red-500";
  };

  const getScoreBg = () => {
    if (percentage >= 80) return "bg-emerald-50";
    if (percentage >= 50) return "bg-amber-50";
    return "bg-red-50";
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <Link
        to="/dashboard"
        className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 font-semibold text-sm mb-12 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </Link>

      <div className="space-y-12">
        {/* Results Hero */}
        <div className="bg-white rounded-[40px] border border-slate-100 p-8 md:p-12 shadow-sm text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-linear-to-r from-emerald-500 via-teal-500 to-blue-500" />

          <div className="relative">
            <div
              className={`w-24 h-24 ${getScoreBg()} rounded-full flex items-center justify-center mx-auto mb-8`}
            >
              <Trophy className={`w-12 h-12 ${getScoreColor()}`} />
            </div>

            <h1 className="text-4xl font-black text-slate-900 mb-2">
              Quiz Results
            </h1>
            <p className="text-slate-500 font-medium mb-12">
              Here's how you performed in{" "}
              <span className="text-slate-900 font-bold">
                {quizResults.title}
              </span>
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto">
              <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100">
                <Target className="w-5 h-5 text-teal-500 mx-auto mb-3" />
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                  Score
                </p>
                <p className="text-2xl font-black text-slate-900">
                  {correctCount} / {totalQuestions}
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100">
                <BarChart3 className="w-5 h-5 text-blue-500 mx-auto mb-3" />
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                  Percentage
                </p>
                <p className={`text-2xl font-black ${getScoreColor()}`}>
                  {percentage}%
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100">
                <Clock className="w-5 h-5 text-amber-500 mx-auto mb-3" />
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                  Performance
                </p>
                <p className="text-2xl font-black text-slate-900">
                  {percentage >= 80
                    ? "Master"
                    : percentage >= 50
                      ? "Steady"
                      : "Keep Going"}
                </p>
              </div>
            </div>

            <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                  variant="outline"
                  className="w-full sm:w-auto px-8 gap-2"
                  onClick={() => setShowRetakeModal(true)}
                >
                  <RotateCcw className="w-4 h-4" /> Retake Quiz
              </Button>
              <Link to="/documents">
                <Button className="w-full sm:w-auto px-8">Study More</Button>
              </Link>
            </div>

            <ConfirmModal
              isOpen={showRetakeModal}
              title="Retake this Quiz?"
              message="Your previous results will be permanently overwritten with your new score. Are you sure you want to retake?"
              confirmLabel="Yes, Retake"
              cancelLabel="Cancel"
              variant="warning"
              onConfirm={() => { setShowRetakeModal(false); navigate(`/quizzes/${quizId}`); }}
              onCancel={() => setShowRetakeModal(false)}
            />
          </div>
        </div>

        {/* Detailed Breakdown */}
        <div className="space-y-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center">
              <HelpCircle className="text-white w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              Question Breakdown
            </h2>
          </div>

          <div className="space-y-6">
            {questions.map((q: any, index: number) => {
              const isCorrect = q.isCorrect;
              const userAnswer = q.selectedAnswer;

              return (
                <div
                  key={index}
                  className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="p-6 md:p-8 flex flex-col md:flex-row gap-6">
                    <div
                      className={`w-12 h-12 rounded-2xl shrink-0 flex items-center justify-center font-bold ${
                        isCorrect
                          ? "bg-emerald-50 text-emerald-600"
                          : "bg-red-50 text-red-600"
                      }`}
                    >
                      {index + 1}
                    </div>

                    <div className="flex-1 space-y-6">
                      <div className="space-y-4">
                        <h3 className="text-lg font-bold text-slate-900 leading-snug">
                          {q.question}
                        </h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div
                            className={`p-4 rounded-2xl border ${
                              isCorrect
                                ? "bg-emerald-50/50 border-emerald-100"
                                : "bg-white border-slate-100 opacity-60"
                            }`}
                          >
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                              {isCorrect ? (
                                <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                              ) : (
                                <HelpCircle className="w-3 h-3" />
                              )}
                              Your Answer
                            </p>
                            <p
                              className={`text-sm font-bold ${isCorrect ? "text-emerald-700" : "text-slate-600"}`}
                            >
                              {userAnswer || "No answer"}
                            </p>
                          </div>

                          {!isCorrect && (
                            <div className="p-4 rounded-2xl border bg-emerald-50 border-emerald-100 flex items-start gap-4">
                              <div className="space-y-1">
                                <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                                  <CheckCircle2 className="w-3 h-3" /> Correct
                                  Answer
                                </p>
                                <p className="text-sm font-black text-emerald-700">
                                  {q.correctAnswer}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="bg-slate-50/50 rounded-2xl p-6 border border-slate-100">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
                          Explanation
                        </p>
                        <p className="text-sm text-slate-600 font-medium leading-relaxed italic">
                          {q.explanation}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizResultPage;
