import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface NudgeProps {
  category: string;
  severity: 'low' | 'medium' | 'high';
  title: string;
  message: string;
  timestamp: number;
  onDismiss: () => void;
}

const BehaviorNudge: React.FC<NudgeProps> = ({
  category,
  severity,
  title,
  message,
  onDismiss,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Fade in animation
    setTimeout(() => setIsVisible(true), 100);

    // Auto-dismiss after duration based on severity
    const duration = severity === 'high' ? 15000 : severity === 'medium' ? 10000 : 7000;
    const timer = setTimeout(() => {
      handleDismiss();
    }, duration);

    return () => clearTimeout(timer);
  }, [severity]);

  const handleDismiss = () => {
    setIsExiting(true);
    setTimeout(() => {
      onDismiss();
    }, 300);
  };

  const getSeverityColor = () => {
    switch (severity) {
      case 'high':
        return 'from-orange-500/90 to-red-500/90';
      case 'medium':
        return 'from-yellow-500/90 to-orange-500/90';
      case 'low':
        return 'from-blue-500/90 to-indigo-500/90';
      default:
        return 'from-gray-500/90 to-gray-600/90';
    }
  };

  const getIcon = () => {
    switch (category) {
      case 'doomscrolling':
        return '🧘';
      case 'binge-watching':
        return '👀';
      case 'shopping-loops':
        return '🛒';
      case 'tab-hoarding':
        return '📑';
      case 'distracted-browsing':
        return '🎯';
      default:
        return '💭';
    }
  };

  return createPortal(
    <div
      className={`
        kaizen-nudge-container
        fixed top-6 right-6 z-[999999]
        transition-all duration-300 ease-out
        ${isVisible && !isExiting ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
      `}
      style={{
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      <div
        className={`
          bg-gradient-to-br ${getSeverityColor()}
          backdrop-blur-lg
          rounded-2xl shadow-2xl
          p-5 max-w-md
          border border-white/20
        `}
      >
        <div className="flex items-start gap-3">
          <div className="text-3xl flex-shrink-0" aria-hidden="true">
            {getIcon()}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-semibold text-lg mb-1 leading-tight">
              {title}
            </h3>
            <p className="text-white/95 text-sm leading-relaxed">
              {message}
            </p>
          </div>
          <button
            onClick={handleDismiss}
            className="
              flex-shrink-0 text-white/80 hover:text-white
              transition-colors p-1 rounded-lg hover:bg-white/10
            "
            aria-label="Dismiss notification"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M5 5l10 10M15 5l-10 10" />
            </svg>
          </button>
        </div>
        
        {/* Progress bar for auto-dismiss */}
        <div className="mt-3 h-1 bg-white/20 rounded-full overflow-hidden">
          <div
            className={`h-full bg-white/50 rounded-full transition-all ease-linear`}
            style={{
              animation: `shrink ${severity === 'high' ? '15s' : severity === 'medium' ? '10s' : '7s'} linear`,
            }}
          />
        </div>
      </div>
    </div>,
    document.body
  );
};

export default BehaviorNudge;
