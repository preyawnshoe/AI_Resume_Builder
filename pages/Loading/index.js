import React, { useEffect, useState } from "react";

const Loading = () => {
  const [showGradient, setShowGradient] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowGradient(false);
    },3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex justify-center items-center min-h-screen from-purple-300 via-pink-200 to-blue-300">
      <div className="form-container p-4 bg-white rounded-lg shadow-lg w-56 space-y-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
          <div className="flex-1">
            <div className="h-4 w-3/4 bg-gray-300 rounded-md shadow-sm"></div>
            <div className="h-2 w-1/2 bg-gray-300 rounded-md shadow-sm mt-1"></div>
          </div>
        </div>

        <div className="section">
          <div className="section-heading bg-gray-300 h-2 w-3/4 rounded-md shadow-sm"></div>
          <div className="loading-big-line h-1 w-full rounded-md shadow-sm"></div>
          <div className="loading-small-line h-1 w-2/3 rounded-md shadow-sm"></div>
          <div className="loading-small-line h-1 w-1/2 rounded-md shadow-sm"></div>
        </div>

        <div className="section">
          <div className="section-heading bg-gray-300 h-2 w-3/4 rounded-md shadow-sm"></div>
          <div className="loading-big-line h-1 w-full rounded-md shadow-sm"></div>
          <div className="loading-small-line h-1 w-2/3 rounded-md shadow-sm"></div>
          <div className="loading-small-line h-1 w-1/2 rounded-md shadow-sm"></div>
          <div className="loading-small-line h-1 w-3/4 rounded-md shadow-sm"></div>
          <div className="loading-small-line h-1 w-full rounded-md shadow-sm"></div>
          <div className="loading-small-line h-1 w-3/4 rounded-md shadow-sm"></div>
          <div className="loading-small-line h-1 w-full rounded-md shadow-sm"></div>
        </div>
      </div>

      <style jsx>{`
        .form-container {
          display: flex;
          flex-direction: column;
          gap: 12px; /* Adjusted gap */
          width: 225px; /* Smaller width */
          height: 300px; /* Smaller height */
          text-align: left;
          background-color: #f7fafc; /* Soft background for the form */
          animation: scaleForm 2s ease-in-out infinite; /* Scaling animation every 2 seconds */
          transform-style: preserve-3d;
        }

        /* Section heading style */
        .section {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .section-heading {
          width: 75%;
        }

        /* Line animation */
        .loading-big-line {
          animation: fillLine 1.9s ease-in-out infinite;
          background-color: #7f4dff; /* Purple */
        }

        .loading-small-line {
          animation: fillLine 1.6s ease-in-out infinite;
          background-color: #ff6f61; /* Coral */
        }

        /* Filling animation for lines */
        @keyframes fillLine {
          0% {
            width: 0%;
          }
          50% {
            width: 50%;
          }
          100% {
            width: 100%;
          }
        }

        /* Scale animation for the form */
        @keyframes scaleForm {
          0% {
            transform: scale(1);
          }
          25% {
            transform: scale(1.05); /* Slightly bigger */
          }
          50% {
            transform: scale(1); /* Back to normal size */
          }
          75% {
            transform: scale(1.05); /* Slightly bigger */
          }
          100% {
            transform: scale(1); /* Back to normal size */
          }
        }
      `}</style>
    </div>
  );
};

export default Loading;
