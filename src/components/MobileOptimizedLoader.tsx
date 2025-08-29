'use client';

import React, { useState, useEffect } from 'react';

interface MobileOptimizedLoaderProps {
  isHydrated?: boolean;
  children: React.ReactNode;
}

/**
 * Mobile-optimized loader that prevents flashing during hydration
 * Shows a minimal loader until hydration is complete
 */
export function MobileOptimizedLoader({ isHydrated = false, children }: MobileOptimizedLoaderProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // During SSR and initial client render, always show children to prevent hydration mismatch
  if (!mounted || isHydrated) {
    return <>{children}</>;
  }

  // Only show loader after mounting and before hydration
  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-white"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
      }}
    >
      {/* Minimal, inline styles to prevent external CSS dependency */}
      <div 
        className="text-center"
        style={{
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          color: '#0B1E2D'
        }}
      >
        {/* Simple CSS-only spinner */}
        <div 
          style={{
            width: '32px',
            height: '32px',
            border: '3px solid #f3f4f6',
            borderTop: '3px solid #0057B7',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }}
        />
        <p style={{ margin: 0, opacity: 0.7 }}>Loading...</p>
      </div>
      
      {/* Inline CSS for spinner animation */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `
      }} />
    </div>
  );
}

export default MobileOptimizedLoader;
