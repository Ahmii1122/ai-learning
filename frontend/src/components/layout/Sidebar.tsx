import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import {
  LayoutDashboard,
  FileText,
  User,
  LogOut,
  BrainCircuit,
  BookOpen,
  X,
} from "lucide-react";

interface SidebarProps {
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
}

const Sidebar = ({ toggleSidebar, isSidebarOpen }: SidebarProps) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    try {
      logout();
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  const navLinks = [
    {
      to: "/dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      to: "/documents",
      label: "Documents",
      icon: FileText,
    },
    {
      to: "/flashcards",
      label: "Flashcards",
      icon: BookOpen,
    },
    {
      to: "/profile",
      label: "Profile",
      icon: User,
    },
  ];

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/30 z-40 md:hidden transition-opacity duration-300 ${isSidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={toggleSidebar}
      ></div>
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white/90 backdrop-blur-lg border-r border-slate-200/60 z-50 flex flex-col md:relative md:w-64 md:shrink-0 md:translate-x-0 transition-transform duration-300 ease-in-out ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200/60">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
              <BrainCircuit size={20} />
            </div>
            <span className="text-xl font-bold text-slate-900">StudyAI</span>
          </div>
          <button
            onClick={toggleSidebar}
            className="md:hidden text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg p-2 transition-colors duration-200"
            aria-label="Close Sidebar"
          >
            <X size={24} />
          </button>
        </div>
        {/* Navigation Links */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={toggleSidebar}
              className={({ isActive }) =>
                `group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                  isActive
                    ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold shadow-lg shadow-emerald-500/10"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <link.icon
                    size={24}
                    strokeWidth={2.5}
                    className={`transition-transform duration-200 ${isActive ? "group-hover:scale-110" : ""}`}
                  />

                  <span>{link.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>
        {/* Logout Button */}
        <div className="px-4 py-4 border-t border-slate-200/60">
          <button
            onClick={handleLogout}
            className="group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group w-full text-slate-600 hover:bg-red-50 hover:text-red-500"
          >
            <LogOut
              className="transition-transform duration-200 group-hover:scale-110"
              size={18}
            />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
