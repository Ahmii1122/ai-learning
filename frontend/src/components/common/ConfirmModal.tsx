import React from "react";
import { AlertTriangle, X } from "lucide-react";
import Button from "./Button";

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "warning" | "info";
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "warning",
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  const variantStyles = {
    danger: {
      icon: "bg-red-100 text-red-600",
      btn: "bg-red-600 hover:bg-red-700 shadow-red-500/25",
    },
    warning: {
      icon: "bg-amber-100 text-amber-600",
      btn: "bg-amber-500 hover:bg-amber-600 shadow-amber-500/25",
    },
    info: {
      icon: "bg-blue-100 text-blue-600",
      btn: "bg-blue-600 hover:bg-blue-700 shadow-blue-500/25",
    },
  };

  const styles = variantStyles[variant];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onCancel}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onCancel}
          className="absolute top-5 right-5 w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Icon */}
        <div className={`w-16 h-16 rounded-2xl ${styles.icon} flex items-center justify-center mb-6`}>
          <AlertTriangle className="w-8 h-8" />
        </div>

        {/* Text */}
        <h2 className="text-xl font-black text-slate-900 mb-2">{title}</h2>
        <p className="text-slate-500 font-medium leading-relaxed mb-8">{message}</p>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1"
            onClick={onCancel}
          >
            {cancelLabel}
          </Button>
          <button
            onClick={onConfirm}
            className={`flex-1 px-6 py-2.5 rounded-xl text-white text-sm font-bold shadow-lg transition-all ${styles.btn}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
