import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { BrainCircuit, Clock, ChevronRight, Trash2, Search, Filter, Trophy, Target, BarChart2 } from "lucide-react";
import toast from "react-hot-toast";
import quizService from "../../services/quizService";
import documentService from "../../services/documentService";
import Button from "../../components/common/Button";

interface Quiz {
  _id: string;
  documentId: {
    _id: string;
    title: string;
  } | string;
  title: string;
  questions: any[];
  totalQuestions: number;
  score?: number;
  userAnswers: any[];
  createdAt: string;
}

const QuizzesListPage = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      // Let's assume we fetch all quizzes across documents since we don't have a 
      // specific "getAllQuizzes" endpoint. For a robust app, we'd need that backend endpoint.
      // For now, we fallback to getting all documents and their related quizzes 
      // if specific endpoint fails or use another approach.
      const response = await documentService.getDocuments();
      const documents = response.data;
      
      const allQuizzes: Quiz[] = [];
      for (const doc of documents) {
        if (doc.quizCount && doc.quizCount > 0) {
            try {
               const qResponse = await quizService.getQuizzesForDocument(doc._id);
               if (qResponse.data && Array.isArray(qResponse.data)) {
                  allQuizzes.push(...qResponse.data.map((q: any) => ({
                      ...q,
                      documentId: { _id: doc._id, title: doc.title }
                  })));
               }
            } catch (e) {
                // Ignore individual doc fetch errors
            }
        }
      }
      
      // Sort by creation date
      allQuizzes.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setQuizzes(allQuizzes);
    } catch (error) {
      toast.error("Failed to fetch quizzes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const handleDeleteQuiz = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this quiz?")) return;

    try {
      await quizService.deleteQuiz(id);
      toast.success("Quiz deleted");
      setQuizzes(quizzes.filter(q => q._id !== id));
    } catch (error) {
      toast.error("Failed to delete quiz");
    }
  };

  const filteredQuizzes = quizzes.filter(quiz => {
    const titleMatch = quiz.title?.toLowerCase().includes(searchTerm.toLowerCase());
    const docTitle = typeof quiz.documentId === 'object' ? quiz.documentId.title : '';
    const docMatch = docTitle?.toLowerCase().includes(searchTerm.toLowerCase());
    return titleMatch || docMatch;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 border-4 border-teal-500/20 border-t-teal-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Quizzes</h1>
          <p className="text-slate-500 mt-1">Test your knowledge with AI-generated quizzes</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search quizzes..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all w-full md:w-64"
            />
          </div>
          <Button variant="outline" size="sm" className="hidden md:flex gap-2">
            <Filter className="w-4 h-4" /> Filter
          </Button>
        </div>
      </div>

      {filteredQuizzes.length === 0 ? (
        <div className="bg-white rounded-[32px] border border-slate-100 p-12 text-center shadow-sm">
          <div className="w-20 h-20 bg-teal-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <BrainCircuit className="w-10 h-10 text-teal-500" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">No quizzes found</h3>
          <p className="text-slate-500 max-w-sm mx-auto mb-8">
            Upload a document and generate your first AI Quiz to start testing your knowledge.
          </p>
          <Link to="/documents">
            <Button className="bg-teal-500 hover:bg-teal-600 shadow-teal-500/25">Go to Documents</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredQuizzes.map((quiz) => {
            const documentTitle = typeof quiz.documentId === 'object' ? quiz.documentId.title : 'Untitled Document';
            const isCompleted = quiz.userAnswers && quiz.userAnswers.length > 0;
            const percentage = quiz.score !== undefined ? Math.round((quiz.score / quiz.totalQuestions) * 100) : 0;
            
            return (
              <Link 
                key={quiz._id} 
                to={isCompleted ? `/quizzes/${quiz._id}/results` : `/quizzes/${quiz._id}`}
                className="group bg-white rounded-[28px] border border-slate-100 p-6 shadow-sm hover:shadow-xl hover:shadow-teal-500/5 hover:border-teal-100 transition-all duration-300 relative overflow-hidden flex flex-col h-full"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-teal-50/50 rounded-full -mr-16 -mt-16 group-hover:bg-teal-100/50 transition-colors duration-300 pointer-events-none" />
                
                <div className="relative flex-1 flex flex-col">
                  {/* Header Badge */}
                  <div className="flex justify-between items-start mb-4">
                     <div className={`w-12 h-12 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 ${
                         isCompleted ? 'bg-blue-50' : 'bg-teal-100'
                     }`}>
                       {isCompleted ? (
                           <Trophy className="w-6 h-6 text-blue-500" />
                       ) : (
                           <BrainCircuit className="w-6 h-6 text-teal-600" />
                       )}
                     </div>

                     {isCompleted && (
                         <div className={`px-3 py-1 rounded-full text-xs font-bold border ${
                             percentage >= 80 ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                             percentage >= 50 ? 'bg-amber-50 text-amber-600 border-amber-100' :
                             'bg-red-50 text-red-600 border-red-100'
                         }`}>
                             {percentage}% Score
                         </div>
                     )}
                  </div>
                  
                  <h3 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-teal-700 transition-colors line-clamp-2">
                    {quiz.title}
                  </h3>
                  <p className="text-sm font-medium text-slate-400 line-clamp-1 mb-4">
                    From: {documentTitle}
                  </p>
                  
                  {/* Spacer to push metrics and footer down */}
                  <div className="flex-1"></div>

                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 bg-slate-50 border border-slate-100 px-2.5 py-1.5 rounded-lg">
                      <Target className="w-3.5 h-3.5 text-slate-400" />
                      {quiz.totalQuestions} Questions
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400">
                      <Clock className="w-3.5 h-3.5" />
                      {new Date(quiz.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-6 pt-5 border-t border-slate-50">
                    <span className={`text-sm font-bold flex items-center gap-1 group-hover:gap-2 transition-all ${
                        isCompleted ? 'text-blue-600' : 'text-teal-600'
                    }`}>
                      {isCompleted ? 'View Results' : 'Start Quiz'} <ChevronRight className="w-4 h-4" />
                    </span>
                    
                    <button 
                      onClick={(e) => handleDeleteQuiz(quiz._id, e)}
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

export default QuizzesListPage;
