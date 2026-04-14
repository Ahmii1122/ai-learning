import React, { useState, useEffect } from "react";
// import Spinner from "../../components/common/Spinner";
import progressService from "../../services/progressService";
import toast from "react-hot-toast";
import {
  FileText,
  BookOpen,
  BrainCircuit,
  TrendingUp,
  Clock,
  Divide,
} from "lucide-react";

const DashboardPage = () => {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const data = await progressService.getDashboardData();
        setDashboardData(data);
        // console.log("dashboard data", data);
      } catch (error: any) {
        const errormessage =
          error.response?.data?.error ||
          error.message ||
          "Failed to fetch dashboard data";
        setError(errormessage);
        toast.error(errormessage);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50/50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-teal-500/20 border-t-teal-500 rounded-full animate-spin"></div>
          <p className="text-slate-500 font-medium animate-pulse">
            Loading your dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (!dashboardData || !dashboardData.data) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl">
          Failed to load dashboard data. Please try again later.
        </div>
      </div>
    );
  }

  const { overview, recentActivity } = dashboardData.data;

  const stats = [
    {
      label: "TOTAL DOCUMENTS",
      value: overview?.totalDocuments || 0,
      icon: FileText,
      gradient: "from-blue-400 to-blue-500",
      iconColor: "text-white",
      shadowColor: "shadow-blue-500/20",
    },
    {
      label: "TOTAL FLASHCARDS",
      value: overview?.totalFlashcards || 0,
      icon: BookOpen,
      gradient: "from-purple-400 to-pink-500",
      iconColor: "text-white",
      shadowColor: "shadow-purple-500/20",
    },
    {
      label: "TOTAL QUIZZES",
      value: overview?.totalQuizzes || 0,
      icon: BrainCircuit,
      gradient: "from-teal-400 to-emerald-500",
      iconColor: "text-white",
      shadowColor: "shadow-teal-500/20",
    },
  ];

  // Prepare activities
  const allActivities = [
    ...(recentActivity?.documents || []).map((doc: any) => ({
      id: doc._id,
      title: doc.title,
      type: "document",
      timestamp: doc.lastAccessed || doc.updatedAt || doc.createdAt,
      description: `Accessed Document: ${doc.title}`,
      link: `/documents/${doc._id}`,
    })),
    ...(recentActivity?.quizzes || []).map((quiz: any) => ({
      id: quiz._id,
      title: quiz.title,
      type: "quiz",
      timestamp: quiz.createdAt,
      description: `Attempted Quiz: ${quiz.title}`,
      link: `/quizzes/${quiz._id}`,
    })),
  ].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
  );

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            Dashboard
          </h1>
          <p className="text-slate-500 font-medium">
            Track your learning progress and activity
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-[24px] p-8 shadow-sm border border-slate-100 flex justify-between items-center group transition-all duration-300 hover:shadow-md hover:border-slate-200"
            >
              <div className="space-y-2">
                <p className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">
                  {stat.label}
                </p>
                <p className="text-4xl font-bold text-slate-900">
                  {stat.value}
                </p>
              </div>
              <div
                className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.gradient} ${stat.shadowColor} shadow-lg flex items-center justify-center transition-transform duration-300 group-hover:scale-110`}
              >
                <stat.icon size={28} className={stat.iconColor} />
              </div>
            </div>
          ))}
        </div>

        {/* Recent Activity Card */}
        <div className="bg-white rounded-[24px] shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-8 space-y-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                <Clock className="text-blue-500" size={20} />
              </div>
              <h2 className="text-xl font-bold text-slate-900">
                Recent Activity
              </h2>
            </div>

            <div className="space-y-4">
              {allActivities.length > 0 ? (
                allActivities.map((activity, index) => (
                  <div
                    key={activity.id || index}
                    className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-slate-50/50 border border-transparent hover:border-slate-200 hover:bg-white transition-all duration-200"
                  >
                    <div className="flex items-start gap-4">
                      <div className="mt-1.5 flex flex-col items-center">
                        <div
                          className={`w-2.5 h-2.5 rounded-full ${
                            activity.type === "document"
                              ? "bg-blue-400"
                              : "bg-teal-400"
                          } ring-4 ring-white shadow-sm`}
                        />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                          <span className="text-slate-500 font-medium">
                            {activity.type === "document"
                              ? "Accessed Document:"
                              : "Attempted Quiz:"}
                          </span>
                          {activity.title}
                        </h4>
                        <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">
                          {activity.timestamp &&
                          !isNaN(new Date(activity.timestamp).getTime())
                            ? new Date(activity.timestamp).toLocaleString()
                            : "Recently"}
                        </p>
                      </div>
                    </div>
                    <button className="mt-4 sm:mt-0 text-teal-600 text-xs font-bold hover:text-teal-700 transition-colors flex items-center gap-1 group/btn px-4 py-2 rounded-lg bg-teal-50 sm:bg-transparent">
                      View
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 space-y-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-50">
                    <TrendingUp className="text-slate-300" size={32} />
                  </div>
                  <div className="space-y-1">
                    <p className="text-slate-900 font-bold text-lg">
                      No recent activity yet
                    </p>
                    <p className="text-slate-500 text-sm max-w-xs mx-auto">
                      Start your learning journey to track your progress
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
