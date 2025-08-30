// CourseCompletionPopup.tsx
// Complete component with inline styles - copy this entire file into your project

import React, { useState, useEffect } from 'react';

interface CourseCompletionPopupProps {
  isOpen: boolean;
  onClose: () => void;
  courseData?: {
    modules: number;
    timeSpent: string;
    score: string;
  };
  onDownloadCertificate?: () => void;
  onViewNextCourse?: () => void;
}

const CourseCompletionPopup: React.FC<CourseCompletionPopupProps> = ({ 
  isOpen, 
  onClose, 
  courseData = {
    modules: 12,
    timeSpent: '2.5h',
    score: '94%'
  },
  onDownloadCertificate,
  onViewNextCourse 
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose?.();
    }, 200);
  };

  const handleDownloadCertificate = () => {
    onDownloadCertificate?.();
  };

  const handleViewNextCourse = () => {
    onViewNextCourse?.();
  };

  if (!isOpen) return null;

  // All styles as JavaScript objects for inline styling
  const styles = {
    overlay: {
      position: 'fixed' as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.4)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backdropFilter: 'blur(8px)',
      zIndex: 1000,
      animation: isVisible ? 'fadeIn 0.3s ease-out' : 'fadeOut 0.2s ease-out'
    },
    popup: {
      background: 'white',
      borderRadius: '16px',
      padding: '48px',
      maxWidth: '480px',
      width: '90%',
      boxShadow: '0 25px 50px rgba(0, 0, 0, 0.15)',
      textAlign: 'center' as const,
      position: 'relative' as const,
      animation: 'slideUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
      overflow: 'hidden',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif'
    },
    iconContainer: {
      marginBottom: '32px',
      position: 'relative' as const
    },
    completionIcon: {
      width: '80px',
      height: '80px',
      background: 'linear-gradient(135deg, #10a37f, #1a9472)',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto',
      position: 'relative' as const,
      animation: 'glow 2s ease-in-out infinite'
    },
    checkmark: {
      color: 'white',
      fontSize: '36px',
      fontWeight: '300'
    },
    sparkles: {
      position: 'absolute' as const,
      width: '100%',
      height: '100%',
      pointerEvents: 'none' as const
    },
    sparkle: {
      position: 'absolute' as const,
      width: '4px',
      height: '4px',
      background: '#10a37f',
      borderRadius: '50%',
      animation: 'sparkle 2s ease-in-out infinite'
    },
    title: {
      fontSize: '28px',
      fontWeight: '600',
      color: '#202123',
      marginBottom: '12px',
      letterSpacing: '-0.02em'
    },
    subtitle: {
      fontSize: '16px',
      color: '#6e6e80',
      marginBottom: '32px',
      lineHeight: '1.5',
      fontWeight: '400'
    },
    stats: {
      display: 'flex',
      justifyContent: 'space-around',
      marginBottom: '32px',
      padding: '24px',
      background: 'rgba(16, 163, 127, 0.05)',
      borderRadius: '12px',
      border: '1px solid rgba(16, 163, 127, 0.1)'
    },
    stat: {
      textAlign: 'center' as const
    },
    statNumber: {
      fontSize: '24px',
      fontWeight: '600',
      color: '#10a37f',
      display: 'block',
      marginBottom: '4px'
    },
    statLabel: {
      fontSize: '13px',
      color: '#8e8ea0',
      textTransform: 'uppercase' as const,
      letterSpacing: '0.05em'
    },
    actions: {
      display: 'flex',
      gap: '12px',
      justifyContent: 'center'
    },
    btn: {
      padding: '12px 24px',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: '500',
      textDecoration: 'none',
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      fontFamily: 'inherit',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px'
    },
    btnPrimary: {
      background: '#10a37f',
      color: 'white'
    },
    btnSecondary: {
      background: 'transparent',
      color: '#6e6e80',
      border: '1px solid #e5e5e5'
    },
    closeBtn: {
      position: 'absolute' as const,
      top: '20px',
      right: '20px',
      background: 'none',
      border: 'none',
      color: '#8e8ea0',
      cursor: 'pointer',
      fontSize: '20px',
      width: '32px',
      height: '32px',
      borderRadius: '6px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.2s ease'
    }
  };

  // CSS animations as a style tag (since we need keyframes)
  const animations = `
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes fadeOut {
      from { opacity: 1; }
      to { opacity: 0; }
    }
    @keyframes slideUp {
      from { 
        opacity: 0;
        transform: translateY(20px) scale(0.95);
      }
      to { 
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }
    @keyframes sparkle {
      0%, 100% { opacity: 0; transform: scale(0); }
      50% { opacity: 1; transform: scale(1); }
    }
    @keyframes glow {
      0%, 100% { box-shadow: 0 0 20px rgba(16, 163, 127, 0.3); }
      50% { box-shadow: 0 0 40px rgba(16, 163, 127, 0.5); }
    }
    .btn-primary:hover {
      background: #0d8a6b !important;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(16, 163, 127, 0.3);
    }
    .btn-secondary:hover {
      background: #f7f7f8 !important;
      border-color: #d0d0d0 !important;
    }
    .close-btn:hover {
      background: #f0f0f0 !important;
      color: #202123 !important;
    }
    @media (max-width: 640px) {
      .popup-mobile {
        padding: 32px 24px !important;
        margin: 20px !important;
      }
      .title-mobile {
        font-size: 24px !important;
      }
      .actions-mobile {
        flex-direction: column !important;
      }
      .btn-mobile {
        width: 100% !important;
        justify-content: center !important;
      }
    }
  `;

  const sparklePositions = [
    { top: '20%', left: '20%', animationDelay: '0s' },
    { top: '30%', right: '25%', animationDelay: '0.3s' },
    { bottom: '25%', left: '30%', animationDelay: '0.6s' },
    { bottom: '20%', right: '20%', animationDelay: '0.9s' },
    { top: '50%', left: '10%', animationDelay: '1.2s' },
    { top: '50%', right: '10%', animationDelay: '1.5s' }
  ];

  return (
    <>
      <style>{animations}</style>
      <div style={styles.overlay}>
        <div 
          style={styles.popup} 
          className="popup-mobile"
        >
          <button 
            style={styles.closeBtn} 
            className="close-btn"
            onClick={handleClose}
          >
            ×
          </button>
          
          <div style={styles.iconContainer}>
            <div style={styles.completionIcon}>
              <span style={styles.checkmark}>✓</span>
            </div>
            <div style={styles.sparkles}>
              {sparklePositions.map((pos, index) => (
                <div
                  key={index}
                  style={{
                    ...styles.sparkle,
                    ...pos
                  }}
                />
              ))}
            </div>
          </div>
          
          <h1 style={styles.title} className="title-mobile">
            Course Complete
          </h1>
          <p style={styles.subtitle}>
            You've successfully mastered the fundamentals of AI. Ready to build something extraordinary?
          </p>
          
          <div style={styles.stats}>
            <div style={styles.stat}>
              <span style={styles.statNumber}>{courseData.modules}</span>
              <span style={styles.statLabel}>Modules</span>
            </div>
            <div style={styles.stat}>
              <span style={styles.statNumber}>{courseData.timeSpent}</span>
              <span style={styles.statLabel}>Time Spent</span>
            </div>
            <div style={styles.stat}>
              <span style={styles.statNumber}>{courseData.score}</span>
              <span style={styles.statLabel}>Score</span>
            </div>
          </div>
          
          <div style={styles.actions} className="actions-mobile">
            <button 
              style={{...styles.btn, ...styles.btnPrimary}} 
              className="btn-primary btn-mobile"
              onClick={handleDownloadCertificate}
            >
              Download Certificate
            </button>
            <button 
              style={{...styles.btn, ...styles.btnSecondary}} 
              className="btn-secondary btn-mobile"
              onClick={handleViewNextCourse}
            >
              Explore More
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CourseCompletionPopup;