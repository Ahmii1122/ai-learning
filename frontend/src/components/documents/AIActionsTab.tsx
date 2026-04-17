import React, { useState } from "react";
import { Sparkles, FileText, BrainCircuit, BookOpen, Lightbulb, ExternalLink } from "lucide-react";
import aiService from "../../services/aiService";
import Button from "../common/Button";
import toast from "react-hot-toast";
import MarkdownRenderer from "../common/MarkdownRenderer";

interface AIActionsTabProps {
  documentId: string;
}

const AIActionsTab: React.FC<AIActionsTabProps> = ({ documentId }) => {
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [summary, setSummary] = useState<string | null>(null);
  const [conceptResult, setConceptResult] = useState<string | null>(null);
  const [conceptQuery, setConceptQuery] = useState("");

  const handleGenerateSummary = async () => {
    setLoadingAction("summary");
    try {
      const res = await aiService.generateSummary(documentId);
      setSummary(res.data?.summary || res.data);
      toast.success("Summary generated successfully");
    } catch (error: any) {
      toast.error(error?.message || "Failed to generate summary");
    } finally {
      setLoadingAction(null);
    }
  };

  const handleGenerateFlashcards = async () => {
    setLoadingAction("flashcards");
    try {
      await aiService.generateFlashcards(documentId, { numCards: 5 });
      toast.success("Flashcards generated successfully!");
      // Ideally redirect to flashcards or tell them to check the tab
    } catch (error: any) {
      toast.error(error?.message || "Failed to generate flashcards");
    } finally {
      setLoadingAction(null);
    }
  };

  const handleGenerateQuiz = async () => {
    setLoadingAction("quiz");
    try {
      await aiService.generateQuiz(documentId, { numQuestions: 5, difficulty: "medium" });
      toast.success("Quiz generated successfully!");
      // Ideally redirect to quizzes or tell them to check the tab
    } catch (error: any) {
      toast.error(error?.message || "Failed to generate quiz");
    } finally {
      setLoadingAction(null);
    }
  };

  const handleExplainConcept = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!conceptQuery.trim()) return;

    setLoadingAction("concept");
    try {
      const res = await aiService.explainConcept(documentId, conceptQuery);
      setConceptResult(res.data?.explanation || res.data);
      toast.success("Concept explained");
    } catch (error: any) {
      toast.error(error?.message || "Failed to explain concept");
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Generate Summary */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-500/5 transition-all">
          <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center mb-4">
            <FileText className="w-6 h-6 text-emerald-600" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-2">Summarize</h3>
          <p className="text-slate-500 text-sm mb-6 h-10">Get a concise summary of the entire document.</p>
          <Button 
            className="w-full text-sm" 
            onClick={handleGenerateSummary} 
            disabled={loadingAction !== null}
          >
            {loadingAction === "summary" ? "Generating..." : "Generate Summary"}
          </Button>
        </div>

        {/* Generate Flashcards */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-teal-200 hover:shadow-lg hover:shadow-teal-500/5 transition-all">
          <div className="w-12 h-12 bg-teal-50 rounded-xl flex items-center justify-center mb-4">
            <BookOpen className="w-6 h-6 text-teal-600" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-2">Flashcards</h3>
          <p className="text-slate-500 text-sm mb-6 h-10">Automatically extract key terms and concepts.</p>
          <Button 
            className="w-full text-sm bg-teal-600 hover:bg-teal-700 shadow-teal-500/25" 
            onClick={handleGenerateFlashcards} 
            disabled={loadingAction !== null}
          >
            {loadingAction === "flashcards" ? "Generating..." : "Generate Set"}
          </Button>
        </div>

        {/* Generate Quiz */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-500/5 transition-all">
          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4">
            <BrainCircuit className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-2">Test Knowledge</h3>
          <p className="text-slate-500 text-sm mb-6 h-10">Create a 5-question quiz to test your retention.</p>
          <Button 
            className="w-full text-sm bg-blue-600 hover:bg-blue-700 shadow-blue-500/25" 
            onClick={handleGenerateQuiz} 
            disabled={loadingAction !== null}
          >
            {loadingAction === "quiz" ? "Generating..." : "Create Quiz"}
          </Button>
        </div>
      </div>

      {/* Results Section */}
      {summary && (
        <div className="bg-emerald-50/50 p-6 rounded-2xl border border-emerald-100 mt-8 relative overflow-hidden">
           <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
             <Sparkles className="w-32 h-32 text-emerald-500" />
           </div>
           <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
             <FileText className="w-5 h-5 text-emerald-600" /> Document Summary
           </h3>
           <div className="prose prose-slate max-w-none prose-sm text-slate-700 leading-relaxed overflow-auto">
             <MarkdownRenderer content={summary} />
           </div>
        </div>
      )}

      {/* Explain Concept Section */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 mt-8">
         <h3 className="text-lg font-bold text-slate-800 mb-2 flex items-center gap-2">
           <Lightbulb className="w-5 h-5 text-amber-500" /> Explain Concept
         </h3>
         <p className="text-slate-500 text-sm mb-6">Type any term or concept from the document, and AI will explain it plainly.</p>
         
         <form onSubmit={handleExplainConcept} className="flex gap-4 mb-6">
           <input 
             type="text" 
             value={conceptQuery}
             onChange={(e) => setConceptQuery(e.target.value)}
             placeholder="e.g., Photosynthesis"
             className="flex-1 px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
           />
           <Button type="submit" disabled={!conceptQuery.trim() || loadingAction !== null}>
             {loadingAction === "concept" ? "Explaining..." : "Explain"}
           </Button>
         </form>

         {conceptResult && (
           <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
             <h4 className="text-sm font-bold text-slate-800 mb-2">Explanation:</h4>
             <div className="prose prose-sm text-slate-700">
               {conceptResult}
             </div>
           </div>
         )}
      </div>
    </div>
  );
};

export default AIActionsTab;
