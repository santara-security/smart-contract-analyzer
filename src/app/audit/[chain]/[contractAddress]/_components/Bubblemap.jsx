"use client";

import React, { useState, useEffect, useRef } from "react";

const LoadingSpinner = () => (
  <div className="flex items-center justify-center py-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mr-3"></div>
    <span className="text-neutral-400">Loading Bubblemap...</span>
  </div>
);

const ErrorState = ({ onRetry }) => (
  <div className="text-center py-8">
    <div className="text-red-400 mb-4">
      <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
      </svg>
      <p className="text-neutral-400 mb-4">Failed to load Bubblemap</p>
    </div>
    <button
      onClick={onRetry}
      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
    >
      Retry
    </button>
  </div>
);

const BubblemapControls = ({ 
  isFullscreen, 
  onToggleFullscreen, 
  onRefresh, 
  onOpenExternal, 
  contractAddress, 
  chain 
}) => (
  <div className="flex items-center justify-between mb-4">
    <div className="flex items-center gap-3">
      <h3 className="text-lg font-semibold text-neutral-200">
        Token Holder Distribution
      </h3>
      <span className="px-2 py-1 text-xs rounded-full border bg-blue-600/20 text-blue-400 border-blue-500/50">
        Interactive Map
      </span>
    </div>
    
    <div className="flex items-center gap-2">
      <button
        onClick={onRefresh}
        className="p-2 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-700/50 rounded-lg transition-colors"
        title="Refresh Map"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      </button>
      
      <button
        onClick={onOpenExternal}
        className="p-2 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-700/50 rounded-lg transition-colors"
        title="Open in New Tab"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
      </button>
      
      <button
        onClick={onToggleFullscreen}
        className="p-2 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-700/50 rounded-lg transition-colors"
        title={isFullscreen ? "Close Popup" : "Open in Popup"}
      >
        {isFullscreen ? (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9V4.5M9 9H4.5M9 9L3.5 3.5M15 9v-4.5M15 9h4.5M15 9l5.5-5.5M9 15v4.5M9 15H4.5M9 15l-5.5 5.5M15 15v4.5M15 15h4.5m0 0l5.5 5.5" />
          </svg>
        ) : (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
          </svg>
        )}
      </button>
    </div>
  </div>
);

const BubblemapInfo = () => (
  <div className="mb-4 p-3 bg-neutral-700/30 rounded-lg border border-neutral-600/50">
    <div className="flex items-start gap-3">
      <svg className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <div className="text-sm text-neutral-300">
        <p className="font-medium mb-1">How to Use the Bubblemap:</p>
        <ul className="space-y-1 text-neutral-400 text-xs">
          <li>• Each bubble represents a wallet holding this token</li>
          <li>• Bubble size indicates the amount of tokens held</li>
          <li>• Click on bubbles to see wallet details and transaction history</li>
          <li>• Use mouse wheel to zoom in/out for detailed analysis</li>
        </ul>
      </div>
    </div>
  </div>
);

export const Bubblemap = ({ contractAddress, chain, activeTab }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [popupWindow, setPopupWindow] = useState(null);
  const iframeRef = useRef(null);
  const containerRef = useRef(null);

  const bubblemapUrl = `https://v2.bubblemaps.io/map?address=${contractAddress}&chain=${chain}&partnerId=regular`;

  useEffect(() => {
    if (activeTab === "bubblemap") {
      setIsLoading(true);
      setHasError(false);
    }
  }, [activeTab, contractAddress, chain]);

  // Cleanup popup on component unmount
  useEffect(() => {
    return () => {
      if (popupWindow && !popupWindow.closed) {
        popupWindow.close();
      }
    };
  }, [popupWindow]);

  const handleIframeLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleIframeError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  const handleRetry = () => {
    setIsLoading(true);
    setHasError(false);
    if (iframeRef.current) {
      iframeRef.current.src = bubblemapUrl;
    }
  };

  const handleRefresh = () => {
    if (iframeRef.current) {
      iframeRef.current.src = iframeRef.current.src;
    }
  };

  const handleOpenExternal = () => {
    window.open(bubblemapUrl, '_blank', 'noopener,noreferrer');
  };

  const toggleFullscreen = () => {
    if (isFullscreen && popupWindow) {
      // Close the popup window
      popupWindow.close();
      setPopupWindow(null);
      setIsFullscreen(false);
    } else {
      // Open popup window
      const popup = window.open(
        bubblemapUrl,
        'bubblemap-fullscreen',
        'width=1200,height=800,scrollbars=yes,resizable=yes,toolbar=no,menubar=no,location=no,status=no'
      );
      
      if (popup) {
        setPopupWindow(popup);
        setIsFullscreen(true);
        
        // Listen for popup close
        const checkClosed = setInterval(() => {
          if (popup.closed) {
            clearInterval(checkClosed);
            setIsFullscreen(false);
            setPopupWindow(null);
          }
        }, 1000);
      }
    }
  };

  const toggleInfo = () => {
    setShowInfo(!showInfo);
  };

  if (activeTab !== "bubblemap") {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="bg-neutral-800/30 rounded-lg p-4">
        <BubblemapControls
          isFullscreen={isFullscreen}
          onToggleFullscreen={toggleFullscreen}
          onRefresh={handleRefresh}
          onOpenExternal={handleOpenExternal}
          contractAddress={contractAddress}
          chain={chain}
        />

        {showInfo && <BubblemapInfo />}

        <div className="mb-4">
          <button
            onClick={toggleInfo}
            className="text-xs text-neutral-400 hover:text-neutral-300 transition-colors"
          >
            {showInfo ? "Hide Info" : "Show Info"}
          </button>
        </div>

        <div 
          ref={containerRef}
          className="relative bg-neutral-900/50 rounded-lg border border-neutral-600/50 overflow-hidden transition-all duration-300 h-[600px]"
        >
          {isLoading && (
            <div className="absolute inset-0 bg-neutral-800/90 backdrop-blur-sm flex items-center justify-center z-10">
              <LoadingSpinner />
            </div>
          )}

          {hasError ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <ErrorState onRetry={handleRetry} />
            </div>
          ) : (
            <iframe
              ref={iframeRef}
              src={bubblemapUrl}
              className="w-full h-full border-0"
              onLoad={handleIframeLoad}
              onError={handleIframeError}
              title={`Bubblemap for ${contractAddress} on ${chain}`}
              allow="fullscreen"
            />
          )}

          {isFullscreen && (
            <div className="absolute inset-0 bg-neutral-800/90 backdrop-blur-sm flex items-center justify-center z-20">
              <div className="text-center">
                <div className="text-neutral-200 mb-4">
                  <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  <p className="text-lg font-medium">Bubblemap opened in popup window</p>
                  <p className="text-sm text-neutral-400 mt-1">
                    The interactive map is now displayed in a larger window for better analysis
                  </p>
                </div>
                <button
                  onClick={toggleFullscreen}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Close Popup
                </button>
              </div>
            </div>
          )}
        </div>


      </div>
    </div>
  );
};

export default Bubblemap;
