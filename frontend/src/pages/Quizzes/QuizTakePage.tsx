import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  ArrowRight,
  HelpCircle,
  Timer,
  AlertCircle,
  XCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import quizService from "../../services/quizService";
import Button from "../../components/common/Button";

interface Question {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  difficulty: string;
}

const QuizTakePage = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState<any>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [answers, setAnswers] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [startTime] = useState(Date.now());

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        setLoading(true);
        const response = await quizService.getQuizById(quizId!);
        setQuiz(response.data);
      } catch (error) {
        toast.error("Failed to load quiz");
        navigate("/dashboard");
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [quizId, navigate]);

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
  };

  const handleNext = () => {
    if (!selectedOption) return;

    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = selectedOption;
    setAnswers(newAnswers);

    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(newAnswers[currentQuestionIndex + 1] || null);
    } else {
      handleSubmit(newAnswers);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setSelectedOption(answers[currentQuestionIndex - 1]);
    }
  };

  const handleSubmit = async (finalAnswers: string[]) => {
    setSubmitting(true);
    try {
      const timeTaken = Math.floor((Date.now() - startTime) / 1000);
      
      const formattedAnswers = finalAnswers.map((answer, index) => ({
         questionIndex: index,
         selectedAnswer: answer || "No answer"
      })).filter(a => a.selectedAnswer !== "No answer");

      await quizService.submitQuiz(quizId!, formattedAnswers as any);
      toast.success("Quiz submitted successfully!");
      navigate(`/quizzes/${quizId}/results`);
    } catch (error) {
      toast.error("Failed to submit quiz");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-teal-500/20 border-t-teal-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 min-h-screen flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link
            to="/dashboard"
            className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-slate-900 line-clamp-1">
              {quiz.title}
            </h1>
            <p className="text-sm font-medium text-slate-400">
              Question {currentQuestionIndex + 1} of {quiz.questions.length}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-2xl border border-slate-100 shadow-sm">
          <Timer className="w-4 h-4 text-slate-400" />
          <span className="text-sm font-bold text-slate-700 tabular-nums">
            {Math.floor((Date.now() - startTime) / 60000)}:
            {String(Math.floor((Date.now() - startTime) / 1000) % 60).padStart(
              2,
              "0",
            )}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 bg-slate-100 rounded-full mb-12 overflow-hidden">
        <div
          className="h-full bg-linear-to-r from-teal-500 to-emerald-500 rounded-full transition-all duration-500 ease-out shadow-sm"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-8 items-start">
        {/* Question Area */}
        <div className="flex-1 w-full space-y-8">
          <div className="bg-white rounded-[32px] border border-slate-100 p-8 md:p-12 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-teal-50/30 rounded-full -mr-20 -mt-20 blur-3xl text-teal-500" />

            <div className="relative">
              <div className="flex items-center gap-2 mb-6">
                <span
                  className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    currentQuestion.difficulty === "hard"
                      ? "bg-red-50 text-red-600"
                      : currentQuestion.difficulty === "easy"
                        ? "bg-emerald-50 text-emerald-600"
                        : "bg-teal-50 text-teal-600"
                  }`}
                >
                  {currentQuestion.difficulty}
                </span>
              </div>

              <h2 className="text-2xl md:text-3xl font-bold text-slate-800 leading-tight">
                {currentQuestion.question}
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {currentQuestion.options.map((option: string, index: number) => (
              <button
                key={index}
                onClick={() => handleOptionSelect(option)}
                className={`flex items-center justify-between p-6 rounded-2xl border-2 transition-all duration-200 text-left group ${
                  selectedOption === option
                    ? "border-teal-500 bg-teal-50/50 shadow-lg shadow-teal-500/5"
                    : "border-slate-100 bg-white hover:border-slate-200 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm transition-colors ${
                      selectedOption === option
                        ? "bg-teal-500 text-white"
                        : "bg-slate-100 text-slate-500 group-hover:bg-slate-200"
                    }`}
                  >
                    {String.fromCharCode(65 + index)}
                  </div>
                  <span
                    className={`font-semibold ${
                      selectedOption === option
                        ? "text-teal-900"
                        : "text-slate-700"
                    }`}
                  >
                    {option}
                  </span>
                </div>
                {selectedOption === option && (
                  <CheckCircle2 className="w-6 h-6 text-teal-500 animate-in zoom-in" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Sidebar Controls */}
        <div className="w-full lg:w-80 space-y-6">
          <div className="bg-white rounded-[28px] border border-slate-100 p-6 shadow-sm">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">
              Question Palette
            </h3>
            <div className="grid grid-cols-5 gap-3">
              {quiz.questions.map((_: any, index: number) => (
                <button
                  key={index}
                  onClick={() => {
                    const ans = [...answers];
                    if (selectedOption)
                      ans[currentQuestionIndex] = selectedOption;
                    setAnswers(ans);
                    setCurrentQuestionIndex(index);
                    setSelectedOption(ans[index] || null);
                  }}
                  className={`aspect-square rounded-xl flex items-center justify-center font-bold text-xs transition-all ${
                    index === currentQuestionIndex
                      ? "bg-teal-500 text-white shadow-lg shadow-teal-500/25 ring-4 ring-teal-50"
                      : answers[index]
                        ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                        : "bg-slate-50 text-slate-400 border border-slate-100 hover:border-slate-200"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>

            <div className="mt-8 pt-8 border-t border-slate-50 space-y-4">
              <Button
                onClick={handlePrev}
                disabled={currentQuestionIndex === 0}
                variant="outline"
                className="w-full h-12 rounded-xl border-slate-200 text-slate-600 font-bold"
              >
                Previous
              </Button>
              <Button
                onClick={handleNext}
                disabled={!selectedOption || submitting}
                className="w-full h-12 rounded-xl bg-teal-500 hover:bg-teal-600 text-white font-bold shadow-lg shadow-teal-500/20"
              >
                {submitting
                  ? "Submitting..."
                  : currentQuestionIndex === quiz.questions.length - 1
                    ? "Submit Quiz"
                    : "Next Question"}
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="bg-amber-50 rounded-2xl p-6 border border-amber-100">
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />
              <div className="space-y-1">
                <p className="text-xs font-bold text-amber-700 uppercase">
                  Attention
                </p>
                <p className="text-xs text-amber-600 font-medium leading-relaxed">
                  Carefully read each option before selecting. Once submitted,
                  you cannot change your answer for this session.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizTakePage;
