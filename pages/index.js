import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Loading from "./Loading/index"
export default function Home() {
  const router = useRouter();
  const [isAnimating, setIsAnimating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 4000);
    return () => clearTimeout(timer); 
  }, []);

  const handleClick = (route) => {

    let typeArray = route.split("/")

    let type = typeArray[2];

    console.log(type);

    localStorage.setItem("resumeType", type);

    setIsAnimating(true);
    setTimeout(() => {
      router.push(route);
    }, 500);
  };



  if (isLoading) {
    return (
      <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-r from-purple-300 via-pink-200 to-blue-300">
      <div className="absolute inset-0 bg-white opacity-70 blur-sm"></div>
      <div className="text-white font-semibold text-xl relative z-10">
        <Loading />
      </div>
    </div>
    );
  }

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-purple-300 via-pink-200 to-blue-300 p-4 overflow-hidden">
      {/* Floating Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Existing Floating Elements */}
        <div className="absolute bg-blue-400 rounded-full opacity-20 w-36 h-36 -top-10 left-12 animate-float" />
        <div className="absolute bg-green-400 rounded-full opacity-20 w-28 h-28 top-24 -right-16 animate-float-reverse" />
        <div className="absolute bg-pink-400 rounded-full opacity-20 w-32 h-32 bottom-10 left-20 animate-float" />
        <div className="absolute bg-purple-500 rounded-full opacity-20 w-40 h-40 -bottom-16 right-24 animate-float-reverse" />
        <div className="absolute bg-yellow-400 rounded-full opacity-20 w-24 h-24 top-40 left-40 animate-float" />

        {/* New Floating Bubbles */}
        <div className="absolute bg-blue-300 rounded-full opacity-30 w-18 h-18 top-10 left-1/4 animate-float" />
        <div className="absolute bg-yellow-500 rounded-full opacity-30 w-22 h-22 top-1/4 left-3/4 animate-float-reverse" />
        <div className="absolute bg-purple-300 rounded-full opacity-30 w-20 h-20 top-5 right-1/4 animate-float" />
        <div className="absolute bg-green-500 rounded-full opacity-30 w-25 h-25 bottom-1/4 left-1/4 animate-float-reverse" />
        <div className="absolute bg-pink-500 rounded-full opacity-30 w-28 h-28 top-60 left-1/8 animate-float" />
        <div className="absolute bg-indigo-400 rounded-full opacity-30 w-30 h-30 bottom-1/4 right-1/4 animate-float-reverse" />
        <div className="absolute bg-teal-400 rounded-full opacity-30 w-25 h-25 bottom-5 left-3/4 animate-float" />
        <div className="absolute bg-orange-400 rounded-full opacity-30 w-32 h-32 top-1/4 left-1/2 animate-float-reverse" />
        <div className="absolute bg-lime-300 rounded-full opacity-30 w-14 h-14 top-3/4 right-1/4 animate-float" />
        <div className="absolute bg-red-400 rounded-full opacity-30 w-20 h-20 bottom-10 left-1/4 animate-float-reverse" />
        
        {/* More Bubbles for Balance */}
        <div className="absolute bg-teal-400 rounded-full opacity-30 w-20 h-20 top-20 left-1/8 animate-float-fast" />
        <div className="absolute bg-pink-400 rounded-full opacity-30 w-22 h-22 bottom-5 left-2/3 animate-float-fast" />
        <div className="absolute bg-orange-300 rounded-full opacity-30 w-30 h-30 bottom-10 right-1/8 animate-float-fast" />

        {/* Smaller Center Bubbles */}
        <div className="absolute bg-blue-100 rounded-full opacity-40 w-12 h-12 animate-float center-bubble" />
        <div className="absolute bg-yellow-200 rounded-full opacity-40 w-14 h-14 animate-float center-bubble" />
        <div className="absolute bg-green-300 rounded-full opacity-40 w-16 h-16 animate-float center-bubble" />
      </div>

      <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800 text-center mb-10 relative z-10">
        Welcome to Resume Builder
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-5xl relative z-10">
        {/* Resume Cards */}
        <div
          onClick={() => handleClick("/create-resume")}
          className="relative bg-gradient-to-r from-blue-500 to-green-400 rounded-lg p-6 shadow-lg cursor-pointer transform hover:scale-105 transition-transform duration-300 ease-out hover:shadow-2xl overflow-hidden"
        >
          <div className="absolute inset-0 bg-blue-500 opacity-30 rounded-lg"></div>
          <div className="relative z-10 text-white">
            <h2 className="text-lg font-semibold mb-1">Technical Resume</h2>
            <p className="text-xs mb-3">
              Ideal for tech roles, emphasizing skills, projects, and certifications.
            </p>
            <span className="font-semibold hover:underline text-xs">Get Started →</span>
          </div>
        </div>

        <div
          onClick={() => handleClick("/create-resume")}
          className="relative bg-gradient-to-r from-pink-500 to-yellow-400 rounded-lg p-6 shadow-lg cursor-pointer transform hover:scale-105 transition-transform duration-300 ease-out hover:shadow-2xl overflow-hidden"
        >
          <div className="absolute inset-0 bg-pink-500 opacity-30 rounded-lg"></div>
          <div className="relative z-10 text-white">
            <h2 className="text-lg font-semibold mb-1">Creative Resume</h2>
            <p className="text-xs mb-3">
              Perfect for arts, design, and media roles, showcasing portfolio and projects.
            </p>
            <span className="font-semibold hover:underline text-xs">Get Started →</span>
          </div>
        </div>

        <div
          onClick={() => handleClick("/create-resume")}
          className="relative bg-gradient-to-r from-purple-500 to-indigo-400 rounded-lg p-6 shadow-lg cursor-pointer transform hover:scale-105 transition-transform duration-300 ease-out hover:shadow-2xl overflow-hidden"
        >
          <div className="absolute inset-0 bg-purple-500 opacity-30 rounded-lg"></div>
          <div className="relative z-10 text-white">
            <h2 className="text-lg font-semibold mb-1">Professional Resume</h2>
            <p className="text-xs mb-3">
              Suited for business roles, focusing on experience, leadership, and soft skills.
            </p>
            <span className="font-semibold hover:underline text-xs">Get Started →</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        /* Floating animation keyframes */
        @keyframes float {
          0% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-30px);
          }
          100% {
            transform: translateY(0px);
          }
        }

        @keyframes float-reverse {
          0% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(30px);
          }
          100% {
            transform: translateY(0px);
          }
        }

        /* Faster Floating animation keyframes */
        @keyframes float-fast {
          0% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-50px);
          }
          100% {
            transform: translateY(0px);
          }
        }

        /* Apply animations to elements */
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-float-reverse {
          animation: float-reverse 6s ease-in-out infinite;
        }

        .animate-float-fast {
          animation: float-fast 3s ease-in-out infinite;
        }

        /* Center Bubbles Animation */
        .center-bubble {
          animation: float 10s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
