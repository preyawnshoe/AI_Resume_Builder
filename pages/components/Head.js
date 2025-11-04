import React from "react";
import { useRouter } from "next/router";
import { ArrowLeftIcon } from "@heroicons/react/outline";

const Header = () => {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  const handleViewResume = () => {
    router.push("/view-resume");
  };

  return (
    <header className="flex justify-between items-center p-4 bg-white shadow-md">
      <div className="flex items-center">
        <button
          aria-label="Go Back"
          className="mr-2 p-1 hover:bg-gray-100 rounded"
          onClick={handleBack}
        >
          <ArrowLeftIcon className="h-6 w-6 text-gray-600" />
        </button>
        <h1 className="text-lg font-semibold">Back</h1>
      </div>
      <div>
        <button
         className="px-4 py-2 mr-10 text-black rounded border border-gray-1900 hover:bg-gray-300 transition"
          onClick={handleViewResume}
        >
          View Resume
        </button>
      </div>
    </header>
  );
};

export default Header;
