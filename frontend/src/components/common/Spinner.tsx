import React from "react";

interface SpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const Spinner = ({ size = "md", className = "" }: SpinnerProps) => {
  const sizeMap = {
    sm: { dims: "w-5 h-5", border: "border-2" },
    md: { dims: "w-8 h-8", border: "border-[3px]" },
    lg: { dims: "w-12 h-12", border: "border-4" },
    xl: { dims: "w-16 h-16", border: "border-4" },
  };

  const config = sizeMap[size] || sizeMap.md;

  return (
    <div className={`flex items-center justify-center p-2 ${className}`}>
      <div className="relative">
        {/* Track circle (bg) */}
        <div
          className={`${config.dims} ${config.border} rounded-full border-4 border-slate-200`}
        />
        {/* Rotating loader thumb */}
        <div
          className={`absolute top-0 left-0 ${config.dims} ${config.border} rounded-full border-emerald-600 border-t-transparent animate-spin`}
        />
      </div>
    </div>
  );
};

export default Spinner;
