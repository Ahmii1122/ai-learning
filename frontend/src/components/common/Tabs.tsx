import React from "react";

interface TabsProps {
  tabs: { name: string; label: string; content: React.ReactNode }[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Tabs = ({ tabs, activeTab, setActiveTab }: TabsProps) => {
  return (
    <div className="w-full">
      <div className="realtive border-b-2 border-slate-200">
        <nav className="flex gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
              className={`relative pb-4 px-2 md:px-6 font-semibold text-sm transition-al duration-200 ${
                activeTab === tab.name
                  ? "border-emerald-500 text-emerald-600"
                  : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
              }`}
            >
              <span className="relative z-10">{tab.label}</span>
              {activeTab === tab.name && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-emerald-500 to-transparent" />
              )}
              {activeTab === tab.name && (
                <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/50 to-transparent rounded-t-xl -z-10" />
              )}
            </button>
          ))}
        </nav>
      </div>
      <div className="py-6">
        {tabs.map((tab) => {
          if (tab.name === activeTab) {
            return (
              <div className="animate-in fade-in duration-300" key={tab.name}>
                {tab.content}
              </div>
            );
          }
          return null;
        })}
      </div>
    </div>
  );
};

export default Tabs;
