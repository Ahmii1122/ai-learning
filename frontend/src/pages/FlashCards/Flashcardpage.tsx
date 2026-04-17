import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Star,
  Shuffle,
  Brain,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import flashcardService from "../../services/flashcardService";
import Button from "../../components/common/Button";

const FlashcardPage = () => {
  const { id: documentId } = useParams();
  const navigate = useNavigate();
  const [flashcardSet, setFlashcardSet] = useState<any>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    const fetchFlashcards = async () => {
      try {
        setLoading(true);
        const response = await flashcardService.getFlashcardsForDocument(
          documentId!,
        );
        if (response.data && response.data.length > 0) {
          setFlashcardSet(response.data[0]);
        } else {
          toast.error("No flashcards found for this document");
          navigate("/flashcards");
        }
      } catch (error) {
        toast.error("Failed to load flashcards");
        navigate("/flashcards");
      } finally {
        setLoading(false);
      }
    };
    fetchFlashcards();
  }, [documentId, navigate]);

  const handleNext = () => {
    if (currentIndex < flashcardSet.cards.length - 1) {
      setIsFlipped(false);
      setTimeout(() => {
        setCurrentIndex(currentIndex + 1);
      }, 150);
    } else {
      setIsFinished(true);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setIsFlipped(false);
      setTimeout(() => {
        setCurrentIndex(currentIndex - 1);
      }, 150);
    }
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setIsFinished(false);
  };

  const handleToggleStar = async () => {
    try {
      // In a real app, we'd call the API here
      // await flashcardService.toggleStar(flashcardSet.cards[currentIndex]._id);
      const updatedSet = { ...flashcardSet };
      updatedSet.cards[currentIndex].isStarred =
        !updatedSet.cards[currentIndex].isStarred;
      setFlashcardSet(updatedSet);
      toast.success(
        updatedSet.cards[currentIndex].isStarred
          ? "Card starred"
          : "Star removed",
      );
    } catch (error) {
      toast.error("Failed to update star");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  const currentCard = flashcardSet.cards[currentIndex];
  const progress = ((currentIndex + 1) / flashcardSet.cards.length) * 100;

  if (isFinished) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-12 flex flex-col items-center justify-center min-h-[70vh]">
        <div className="w-24 h-24 bg-emerald-100 rounded-[32px] flex items-center justify-center mb-8 animate-bounce">
          <CheckCircle2 className="w-12 h-12 text-emerald-600" />
        </div>
        <h1 className="text-4xl font-bold text-slate-900 mb-4 text-center">
          Session Complete!
        </h1>
        <p className="text-slate-500 text-lg mb-12 text-center max-w-md">
          Great job! You've reviewed all {flashcardSet.cards.length} cards in
          this set.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
          <Button
            onClick={handleReset}
            variant="outline"
            className="flex-1 max-w-[200px] gap-2"
          >
            <RotateCcw className="w-4 h-4" /> Review Again
          </Button>
          <Link to="/flashcards" className="flex-1 max-w-[200px]">
            <Button className="w-full">Back to Sets</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-8 h-full flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link
            to="/flashcards"
            className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-slate-900 line-clamp-1">
              {flashcardSet.documentId.title || "Study Session"}
            </h1>
            <p className="text-sm font-medium text-slate-400">
              Card {currentIndex + 1} of {flashcardSet.cards.length}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              /* shuffle logic */
            }}
            className="p-2.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all"
            title="Shuffle deck"
          >
            <Shuffle className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1.5 bg-slate-100 rounded-full mb-12 overflow-hidden shadow-inner">
        <div
          className="h-full bg-linear-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Card Section */}
      <div className="flex-1 flex flex-col items-center justify-center gap-12">
        <div
          className="perspective-1000 w-full max-w-2xl cursor-pointer group"
          onClick={() => setIsFlipped(!isFlipped)}
        >
          <div
            className={`relative w-full h-[400px] transition-all duration-700 preserve-3d shadow-2xl shadow-emerald-500/5 ${isFlipped ? "rotate-y-180" : ""}`}
          >
            {/* Front Side */}
            <div
              className={`absolute inset-0 backface-hidden bg-white border border-slate-100 rounded-[40px] p-12 flex flex-col items-center justify-center text-center shadow-sm overflow-y-auto ${isFlipped ? "pointer-events-none" : ""}`}
            >
              <div className="absolute top-8 left-1/2 -translate-x-1/2">
                <span className="text-[10px] font-bold text-slate-300 tracking-[0.2em] uppercase">
                  Question
                </span>
              </div>
              <p className="text-2xl font-semibold text-slate-800 leading-relaxed max-h-full">
                {currentCard.question}
              </p>
              <div className="absolute bottom-8 text-slate-400 text-xs font-medium flex items-center gap-2">
                Tap to flip <Brain className="w-3 h-3" />
              </div>
            </div>

            {/* Back Side */}
            <div
              className={`absolute inset-0 backface-hidden rotate-y-180 bg-emerald-50 border border-emerald-100 rounded-[40px] p-12 flex flex-col items-center justify-center text-center shadow-inner overflow-y-auto ${!isFlipped ? "pointer-events-none" : ""}`}
            >
              <div className="absolute top-8 left-1/2 -translate-x-1/2">
                <span className="text-[10px] font-bold text-emerald-400 tracking-[0.2em] uppercase">
                  Answer
                </span>
              </div>
              <p className="text-2xl font-bold text-emerald-900 leading-relaxed max-h-full">
                {currentCard.answer}
              </p>
              <div className="absolute bottom-8 left-8">
                <span
                  className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    currentCard.difficulty === "hard"
                      ? "bg-red-100 text-red-600"
                      : currentCard.difficulty === "easy"
                        ? "bg-emerald-100 text-emerald-600"
                        : "bg-orange-100 text-orange-600"
                  }`}
                >
                  {currentCard.difficulty || "Medium"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col items-center gap-8 w-full max-w-2xl">
          <div className="flex items-center justify-between w-full px-4">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="w-14 h-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 hover:border-slate-300 disabled:opacity-30 disabled:hover:bg-white transition-all shadow-sm"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <div className="flex gap-4">
              <button
                onClick={handleToggleStar}
                className={`w-14 h-14 rounded-2xl border flex items-center justify-center transition-all shadow-sm ${
                  currentCard.isStarred
                    ? "bg-amber-50 border-amber-200 text-amber-500"
                    : "bg-white border-slate-200 text-slate-400 hover:text-amber-500"
                }`}
              >
                <Star
                  className={`w-6 h-6 ${currentCard.isStarred ? "fill-amber-500" : ""}`}
                />
              </button>

              <button
                onClick={handleReset}
                className="w-14 h-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 transition-all shadow-sm"
              >
                <RotateCcw className="w-6 h-6" />
              </button>
            </div>

            <button
              onClick={handleNext}
              className="w-14 h-14 rounded-2xl bg-linear-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white hover:scale-110 active:scale-95 transition-all shadow-lg shadow-emerald-500/20"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 w-full px-4">
            <button className="h-12 flex items-center justify-center gap-2 bg-red-50 text-red-600 border border-red-100 rounded-2xl text-xs font-bold hover:bg-red-100 transition-colors uppercase tracking-wider">
              <XCircle className="w-4 h-4" /> Still Learning
            </button>
            <button className="h-12 flex items-center justify-center gap-2 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-2xl text-xs font-bold hover:bg-emerald-100 transition-colors uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4" /> Know it
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlashcardPage;
