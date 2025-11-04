import React, { useRef, useState, useEffect } from "react";
import { useReactToPrint } from "react-to-print";
import { useRouter } from "next/router";
// import * as htmlDocx from "html-docx-js/dist/html-docx.js";
// import { PencilIcon } from "@heroicons/react/solid";

const ResumeBuilder = () => {
  const resumeRef = useRef();
  const [selectedTemplate, setSelectedTemplate] = useState();
  const [profileImage, setProfileImage] = useState(null);
  const [resumeData, setResumeData] = useState({});
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(true); // Modal state
  const [resumeSections, setResumeSections] = useState([]);
  const [underlineColor, setUnderlineColor] = useState(
    `text-teal-500 border-b-2 border-teal-500`
  );

  const [isAnimating, setIsAnimating] = useState(false);
  const [selectedColor, setSelectedColor] = useState("teal");
  const [scale, setScale] = useState(1);
  // const [downloadOption, setDownloadOption] = useState("pdf");

  // const handleDownloadChange = (e) => {
  //   setDownloadOption(e.target.value);
  // };

  // useEffect(() => {
  //   const handleResize = () => {
  //     if (window.innerWidth < 1024) {
  //       setScale(0.5);
  //     } else {
  //       setScale(1);
  //     }
  //   };

  //   window.addEventListener("resize", handleResize);
  //   handleResize();

  //   return () => window.removeEventListener("resize", handleResize);
  // }, []);

  useEffect(() => {
    const storedData = localStorage.getItem("resumeSections");
    if (storedData) {
      setResumeSections(JSON.parse(storedData));
    }
  }, []);

  const handleClick = (route) => {
    setIsAnimating(true);
    setTimeout(() => {
      router.push(route);
    }, 500);
  };

  useEffect(() => {
    const storedImage = localStorage.getItem("profileImage");
    if (storedImage) {
      setProfileImage(storedImage);
    }

    const savedData = localStorage.getItem("formData");
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      const resumeData = {
        name: parsedData.name || "",
        jobTitle: parsedData.jobTitle || "",
        portfolio: parsedData.portfolio || "",
        hobbies: parsedData.hobbies || "",
        achievements: parsedData.achievements || "",
        certifications: parsedData.certifications || "",
        email: parsedData.email || "",
        phone: parsedData.phone || "",
        linkedin: parsedData.linkedin || "",
        education: Array.isArray(parsedData.educations)
          ? parsedData.educations
          : [],
        technical_skills: parsedData.technicalSkills.replace(/\"/g, "").trim(),
        soft_skills: parsedData.softSkills.replace(/\"/g, "").trim(),
        projects: Array.isArray(parsedData.projects) ? parsedData.projects : [],
        summary: parsedData.summary || "",
        experiences: Array.isArray(parsedData.experiences)
          ? parsedData.experiences
          : [{ company: "", role: "", duration: "", details: "" }],
      };

      setResumeData(resumeData);
    } else {
      console.log("No resume data found in localStorage.");
    }
  }, []);

  const resumeTemplates = [
    {
      id: 1,
      title: "Template 1",
      img: "/images/resume1.png",
      content: (
        <div className="w-[794px] h-[1123px]  mx-auto p-4 shadow-md bg-white">
          {/* Resume Content */}
          <div className="flex flex-col items-start p-6 space-y-4">
            {/* Header */}
            <div className="flex justify-between w-full items-center border-b-2 border-gray-300 pb-2">
              <div>
                <h1 className={`text-2xl font-bold `}>{resumeData.name}</h1>
                <p className="text-gray-600 text-sm">
                  {resumeData.jobTitle || "Frontend Developer"}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">{resumeData.email}</p>
                <p className="text-sm text-gray-600">{resumeData.phone}</p>
                {resumeData.linkedin && (
                  <p className="text-sm text-gray-600">{resumeData.linkedin}</p>
                )}
                {resumeData.github && (
                  <p className="text-sm text-gray-600">{resumeData.github}</p>
                )}
                {resumeData.website && (
                  <p className="text-sm text-gray-600">{resumeData.website}</p>
                )}
                {resumeData.website && (
                  <p className="text-sm text-gray-600">{resumeData.website}</p>
                )}
                {resumeData.portfolio && (
                  <a
                    href={resumeData.portfolio}
                    // target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm underline text-gray-600"
                  >
                    {resumeData.name}_portfolio
                  </a>
                )}
              </div>
            </div>

            {/* Summary Section */}
            {resumeData.summary && (
              <div className="w-full">
                <h2
                  className={`text-lg font-semibold text-${underlineColor}-500 border-b-2 border-${underlineColor}-500 pb-1`}
                >
                  Summary
                </h2>
                <p className="text-gray-700 pt-2 text-sm">
                  {resumeData.summary}
                </p>
              </div>
            )}

            {/* Experience Section */}
            {resumeData.technical_skills && (
              <div className="mb-3">
                <h2
                  className={`text-lg font-semibold text-${underlineColor}-500 border-b-2 border-${underlineColor}-500 pb-1`}
                >
                  Technical Skills
                </h2>
                <div className="flex flex-wrap mt-2">
                  {/* {console.log(resumeData.technical_skills)} */}

                  {resumeData.technical_skills &&
                    resumeData.technical_skills
                      .split(",")
                      .map((skill, index) => (
                        <span
                          key={index}
                          className="bg-gray-200 text-gray-800 p-1.5 text-sm rounded-md mr-2 mb-2"
                        >
                          {skill}
                        </span>
                      ))}
                </div>
              </div>
            )}

            {/* Soft Skills Section */}
            {resumeData.soft_skills && (
              <div className="mb-3">
                <h2
                  className={`text-lg font-semibold text-${underlineColor}-500 border-b-2 border-${underlineColor}-500 pb-1`}
                >
                  Soft Skills
                </h2>
                <div className="flex flex-wrap mt-2">
                  {resumeData.soft_skills &&
                    resumeData.soft_skills.split(",").map((skill, index) => (
                      <span
                        key={index}
                        className="bg-gray-200 text-gray-800 p-1.5 text-sm rounded-md mr-2 mb-2"
                      >
                        {skill}
                      </span>
                    ))}
                </div>
              </div>
            )}

            {resumeData.experiences && resumeData.experiences.length > 0 && (
              <div className="w-full">
                <h2
                  className={`text-lg font-semibold text-${selectedColor}-500 border-b-2 border-${selectedColor}-500 pb-1`}
                >
                  Experience
                </h2>
                <div className="flex flex-col space-y-1">
                  {resumeData.experiences.map((job, index) => (
                    <div key={index} className="mt-2">
                      <h3 className="font-semibold text-gray-800">
                        {job.role}
                      </h3>
                      <p className="text-sm font-semibold text-gray-600">
                        {job.company} ({job.duration})
                      </p>
                      <p className="list-disc mt-1 list-inside text-gray-700 text-sm">
                        {job.details}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education Section */}
            {resumeData.education && resumeData.education.length > 0 && (
              <div className="w-full">
                <h2
                  className={`text-lg font-semibold text-${selectedColor}-500 border-b-2 border-${selectedColor}-500 pb-1`}
                >
                  Education
                </h2>
                {resumeData.education.map((edu, index) => (
                  <div key={index} className="text-sm text-gray-700 mt-2">
                    <p>
                      {edu.qualification}{" "}
                      <span className="text-gray-600">({edu.year})</span>
                    </p>
                    <span className="text-gray-600">{edu.location}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Projects Section */}
            {resumeData.projects && resumeData.projects.length > 0 && (
              <div className="w-full">
                <h2
                  className={`text-lg font-semibold text-${selectedColor}-500 border-b-2 border-${selectedColor}-500 pb-1`}
                >
                  Projects
                </h2>
                <div className="space-y-1">
                  {resumeData.projects.map((project, index) => (
                    <div key={index}>
                      <h3 className="font-semibold text-gray-800">
                        {project.title}
                      </h3>
                      <p className="text-sm text-gray-700">{project.details}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {resumeData.achievements && (
              <div className="w-full">
                <h2
                  className={`text-lg font-semibold text-${underlineColor}-500 border-b-2 border-${underlineColor}-500 pb-1`}
                >
                  Achievements
                </h2>
                <p className="text-gray-700 pt-2 text-sm">
                  {resumeData.achievements}
                </p>
              </div>
            )}
          </div>
        </div>
      ),
      style: "text-gray-900 p-4 rounded-lg shadow-lg ",
      previewStyle: "text-gray-900 p-6 rounded-lg shadow-md overflow-auto",
    },

    ,
    {
      id: 2,
      title: "Template 2",
      img: "/images/resume2.png",
      content: (
        <div className="w-[794px] h-[1123px] mx-auto p-4 shadow-md bg-white">
          <div className="bg-white text-gray-800 p-4 rounded-lg max-w-screen-md w-full flex">
            {/* Left Section - 30% */}
            <div className="w-2/5 bg-gray-200 text-gray-800 p-4 rounded-lg">
              {/* Profile Image */}
              <div className="flex justify-center items-center mb-4">
                <img
                  src={profileImage}
                  alt="Profile"
                  className="w-32 h-32 rounded-full border-2 border-gray-400"
                />
              </div>

              {/* Contact Details */}
              <h2
                className={`text-lg font-semibold text-${selectedColor}-500 border-b-2 border-${selectedColor}-500 pb-2 mb-3 mt-5`}
              >
                Contact Details
              </h2>
              {resumeData.email && (
                <p className="text-sm mb-1 text-gray-600">{resumeData.email}</p>
              )}
              {resumeData.phone && (
                <p className="text-sm mb-1 text-gray-600">{resumeData.phone}</p>
              )}
              {resumeData.linkedin && (
                <p className="text-sm mb-1  text-gray-600">
                  {resumeData.linkedin}
                </p>
              )}

              {resumeData.github && (
                <p className="text-sm mb-1 text-gray-600">
                  {resumeData.github}
                </p>
              )}
              {resumeData.portfolio && (
                <a
                  href={resumeData.portfolio}
                  // target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm mb-1 underline text-gray-600"
                >
                  {resumeData.name}_portfolio
                </a>
              )}

              {/* Education */}
              {resumeData.education && resumeData.education.length > 0 && (
                <div className="w-full mt-5">
                  <h2
                    className={`text-lg font-semibold text-${selectedColor}-500 border-b-2 border-${selectedColor}-500 pb-2 mb-3`}
                  >
                    Education
                  </h2>
                  {resumeData.education.map((edu, index) => (
                    <div key={index} className="text-sm text-gray-700">
                      <p>
                        <span className="text-sm font-semibold text-gray-700">
                          {edu.qualification}
                        </span>
                        <span className="text-gray-600 ml-3">({edu.year})</span>
                      </p>
                      <p className="text-sm text-gray-600 mb-3">
                        {edu.location}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Skills */}
              <h2
                className={`text-lg mt-5 font-semibold text-${selectedColor}-500 border-b-2 border-${selectedColor}-500 pb-2`}
              >
                Skills
              </h2>
              {resumeData.technical_skills && (
                <div className="w-full mb-2">
                  <h3 className="text-sm font-semibold text-teal-600 mt-3 mb-2">
                    Technical Skills:
                  </h3>
                  <div className="flex flex-wrap text-gray-700 text-sm">
                    {resumeData.technical_skills
                      .split(",")
                      .map((skill, index) => {
                        const trimmedSkill = skill
                          .replace(/['"]+/g, "")
                          .replace(":", "")
                          .trim();
                        return (
                          <span key={index} className="mr-2 mb-1">
                            {trimmedSkill}
                            {index <
                              resumeData.technical_skills.split(",").length -
                                1 && ","}
                          </span>
                        );
                      })}
                  </div>
                </div>
              )}

              {resumeData.soft_skills && (
                <div className="w-full mb-2">
                  <h3 className="text-sm font-semibold text-teal-600 mb-1">
                    Soft Skills:
                  </h3>
                  <p className="list-disc list-inside text-gray-700 text-sm">
                    {resumeData.soft_skills
                      .split(",")
                      .map((skill, index, arr) => (
                        <span key={index}>
                          {skill.replace(":", "").trim()}
                          {index < arr.length - 1 && ", "}
                        </span>
                      ))}
                  </p>
                </div>
              )}

              {resumeData.achievements && (
                <div className="w-full mt-5">
                  <h2
                    className={`text-lg font-semibold text-${selectedColor}-500 border-b-2 border-${selectedColor}-500 pb-2 mb-3`}
                  >
                    Achievements
                  </h2>
                  <p className="text-sm mb-1 text-gray-600">
                    {resumeData.achievements}
                  </p>
                </div>
              )}

              {resumeData.hobbies && (
                <div className="w-full mt-5">
                  <h2
                    className={`text-lg font-semibold text-${selectedColor}-500 border-b-2 border-${selectedColor}-500 pb-2 mb-3`}
                  >
                    Hobbies
                  </h2>
                  <p className="text-sm mb-1 text-gray-600">
                    {resumeData.hobbies}
                  </p>
                </div>
              )}
            </div>

            {/* Right Section - 70% */}
            <div className="w-3/5 bg-white text-gray-800 p-4 rounded-lg ml-4">
              {/* Name */}
              <div className="mb-5 items-center">
                <h1 className={`text-2xl font-bold`}>{resumeData.name}</h1>
                <p className="text-gray-600 text-sm">
                  {resumeData.jobTitle || "Frontend Developer"}
                </p>
              </div>

              {/* Summary */}
              <h2
                className={`text-lg font-semibold text-${selectedColor}-500 border-b-2 border-${selectedColor}-500 pb-2 mb-3`}
              >
                Summary
              </h2>
              <p className="text-sm mb-3 text-gray-700">{resumeData.summary}</p>

              {/* Experience */}
              {resumeData.experiences && resumeData.experiences.length > 0 && (
                <div className="w-full mb-3">
                  <h2
                    className={`text-lg font-semibold text-${selectedColor}-500 border-b-2 border-${selectedColor}-500 pb-1`}
                  >
                    Experience
                  </h2>
                  <div className="flex flex-col space-y-1">
                    {resumeData.experiences.map((job, index) => (
                      <div key={index}>
                        <h3 className="font-semibold text-gray-800">
                          {job.role}
                        </h3>
                        <p className="text-sm font-semibold text-gray-600">
                          {job.company} ({job.duration})
                        </p>
                        <ul className="list-disc mt-1 mb-3 text-sm text-gray-700">
                          {job.details}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Projects */}
              <h2
                className={`text-lg font-semibold mt-5 text-${selectedColor}-500 border-b-2 border-${selectedColor}-500 pb-2 mb-3`}
              >
                Projects
              </h2>
              {resumeData.projects && resumeData.projects.length > 0 && (
                <div className="w-full">
                  <div className="space-y-1">
                    {resumeData.projects.map((project, index) => (
                      <div key={index}>
                        <h3 className="font-semibold text-gray-800">
                          {project.title}
                        </h3>
                        <p className="text-sm text-gray-700">
                          {project.details}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Additional Custom Sections */}
              {/* {resumeSections.map((section, index) => (
                <div key={index} className="mb-3 rounded-md">
                  <h2 className="text-xl font-semibold text-blue-600 mb-2">
                    {section.heading || "Untitled Section"}
                  </h2>
                  <p className="text-gray-700">
                    {section.textParagraph || "No description available."}
                  </p>
                </div>
              ))} */}
            </div>
          </div>
        </div>
      ),
      style: "bg-gray-50 text-gray-800 p-4 rounded-lg shadow-lg",
      previewStyle: "text-gray-900 p-6 rounded-lg overflow-auto",
    },
    {
      id: 3,
      title: "Template 3",
      img: "/images/resume3.png",
      content: (
        <div className="w-[794px] h-[1123px] mx-auto pl-8 pr-8 pt-4 shadow-md bg-white">
          <div>
            {/* Name & Title */}
            <div className="flex flex-col items-center mb-3">
              <h1 className="text-3xl font-bold text-gray-900">
                {resumeData.name || "John Doe"}
              </h1>
              <p className="text-gray-600 text-lg">
                {resumeData.jobTitle || "Front-End Developer"}
              </p>
            </div>

            {/* Contact Details */}
            <div className="text-center mb-3">
              {(resumeData.email ||
                resumeData.phone ||
                resumeData.linkedin ||
                resumeData.website ||
                resumeData.portfolio) && (
                <p className="text-sm font-medium text-gray-700">
                  {resumeData.email && (
                    <>
                      {resumeData.email}{" "}
                      <span className="mx-2 text-gray-500">&bull;</span>
                    </>
                  )}
                  {resumeData.phone && (
                    <>
                      {resumeData.phone}{" "}
                      <span className="mx-2 text-gray-500">&bull;</span>
                    </>
                  )}
                  {resumeData.linkedin && (
                    <>
                      {resumeData.linkedin}{" "}
                      <span className="mx-2 text-gray-500">&bull;</span>
                    </>
                  )}
                  {resumeData.portfolio && (
                    <a
                      href={resumeData.portfolio}
                      // target="_blank"
                      className="mx-2 underline text-gray-500"
                    >
                      {resumeData.name} Portfolio
                    </a>
                  )}
                </p>
              )}
            </div>

            {/* Summary */}
            {resumeData.summary && (
              <div className="mb-3">
                <h2
                  className={`text-lg font-semibold text-${selectedColor}-500 border-b-2 border-${selectedColor}-500 pb-1`}
                >
                  Summary
                </h2>
                <p className="text-gray-700 pt-2 text-sm">
                  {resumeData.summary ||
                    "Results-driven Front-End Developer with over 3 years of experience..."}
                </p>
              </div>
            )}

            {/* Education Section */}
            {resumeData.education && resumeData.education.length > 0 && (
              <div className="mb-3">
                <h2
                  className={`text-lg font-semibold text-${selectedColor}-500 border-b-2 border-${selectedColor}-500 pb-1`}
                >
                  Education
                </h2>
                {resumeData.education.map((edu, index) => (
                  <div key={index} className="mb-4">
                    <p className="text-sm font-semibold text-gray-800">
                      {edu.qualification} ({edu.year})
                    </p>
                    <p className="text-sm text-gray-600">{edu.location}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Experience Section */}
            {resumeData.experiences && resumeData.experiences.length > 0 && (
              <div className="w-full mb-3">
                <h2
                  className={`text-lg font-semibold text-${selectedColor}-500 border-b-2 border-${selectedColor}-500 pb-1`}
                >
                  Experience
                </h2>
                <div className="flex flex-col space-y-1">
                  {resumeData.experiences.map((job, index) => (
                    <div key={index}>
                      <h3 className="font-semibold text-gray-800">
                        {job.role}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {job.company} ({job.duration})
                      </p>

                      <ul className="list-disc mt-1 mb-3 text-sm text-gray-700">
                        {job.details}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Projects Section */}
            {resumeData.projects && resumeData.projects.length > 0 && (
              <div className="mb-3">
                <h2
                  className={`text-lg font-semibold text-${selectedColor}-500 border-b-2 border-${selectedColor}-500 pb-1`}
                >
                  Projects
                </h2>
                {resumeData.projects.map((project, index) => (
                  <div key={index} className="mb-4">
                    <h3 className="font-semibold text-gray-800">
                      {project.title}
                    </h3>
                    <p className="text-sm text-gray-700">{project.details}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Technical Skills Section */}
            {resumeData.technical_skills && (
              <div className="mb-3">
                <h2
                  className={`text-lg font-semibold text-${selectedColor}-500 border-b-2 border-${selectedColor}-500 pb-1`}
                >
                  Technical Skills
                </h2>
                <div className="flex flex-wrap mt-2">
                  {resumeData.technical_skills
                    .split(",")
                    .map((skill, index) => (
                      <span
                        key={index}
                        className="bg-gray-200 text-gray-800 p-2 text-sm rounded-md mr-2 mb-2"
                      >
                        {skill}
                      </span>
                    ))}
                </div>
              </div>
            )}

            {/* Soft Skills Section */}
            {resumeData.soft_skills && (
              <div className="mb-3">
                <h2
                  className={`text-lg font-semibold text-${selectedColor}-500 border-b-2 border-${selectedColor}-500 pb-1`}
                >
                  Soft Skills
                </h2>
                <div className="flex flex-wrap mt-2">
                  {resumeData.soft_skills.split(",").map((skill, index) => (
                    <span
                      key={index}
                      className="bg-gray-200 text-gray-800 p-2 text-sm rounded-md mr-2 mb-2"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Achievements Section */}
            {resumeData.achievements && (
              <div className="mb-3">
                <h2
                  className={`text-lg font-semibold text-${selectedColor}-500 border-b-2 border-${selectedColor}-500 pb-1`}
                >
                  Achievements
                </h2>
                <p className="text-gray-700 pt-2 text-sm">
                  {resumeData.achievements}
                </p>
              </div>
            )}

            {/* Hobbies Section */}
            {resumeData.hobbies && (
              <div className="mb-3">
                <h2
                  className={`text-lg font-semibold text-${selectedColor}-500 border-b-2 border-${selectedColor}-500 pb-1`}
                >
                  Hobbies
                </h2>
                <p className="text-gray-700 pt-2 text-sm">
                  {resumeData.hobbies}
                </p>
              </div>
            )}
          </div>
        </div>
      ),

      style: "bg-gray-50 text-gray-800 p-4 rounded-lg shadow-lg",
      previewStyle: "text-gray-900 p-6 rounded-lg overflow-auto",
    },

    {
      id: 4,
      title: "Template 4",
      img: "/images/resume4.png",
      content: (
        <div className="w-[794px] h-[1123px] mx-auto bg-white shadow-md p-4">
          {/* Header */}
          <div className="bg-gray-800 text-gray-200 p-4 rounded-b-lg mb-3 flex items-center">
            {/* Profile Image */}
            <img
              src={profileImage}
              //   src="https://imgs.search.brave.com/iQ9npTqsFQ-YU86RxY7ntkkd8Ok6nGTGMrgIHD92IBM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/ZGd2YWlzaG5hdmNv/bGxlZ2UuZWR1Lmlu/L2RndmFpc2huYXYt/Yy91cGxvYWRzLzIw/MjEvMDEvZHVtbXkt/cHJvZmlsZS1waWMt/MzAweDMwMC5qcGc"
              alt="Profile"
              className="w-36 h-36 rounded-full border-2 border-gray-400 mr-6"
            />
            {/* Name and Contact Details */}
            <div className="flex-1 ml-2">
              <h1
                className={`text-2xl font-bold text-${selectedColor}-500 border-b-2 border-${selectedColor}-500 mb-2`}
              >
                {resumeData.name}
              </h1>
              <h3 className="text-xl font-semibold text-gray-300 mb-4">
                {resumeData.jobTitle}
              </h3>
              <div>
                <p className="text-sm font-medium text-gray-300">
                  {resumeData.email && (
                    <>
                      {resumeData.email}{" "}
                      <span className="mx-2 text-gray-300">&bull;</span>
                    </>
                  )}

                  {resumeData.phone && (
                    <>
                      {resumeData.phone}{" "}
                      <span className="mx-2 text-gray-300">&bull;</span>
                    </>
                  )}
                  {resumeData.linkedin && (
                    <>
                      {resumeData.linkedin}{" "}
                      <span className="mx-2 text-gray-300">&bull;</span>
                    </>
                  )}

                  {resumeData.portfolio && (
                    <a
                      href={resumeData.portfolio}
                      // target="_blank"
                      className="mx-2 underline text-gray-300"
                    >
                      Portfolio
                    </a>
                  )}
                </p>
              </div>
            </div>
          </div>

          <div className="flex">
            {/* Left Section - 40% */}
            <div className="w-2/5 bg-gray-800 text-gray-200 p-4 rounded-lg">
              <div>
                <h2
                  className={`text-lg font-semibold text-${selectedColor}-500 border-b-2 border-${selectedColor}-500 pb-2 mb-3`}
                >
                  Summary
                </h2>
                <p className="text-sm mb-4 text-gray-300">
                  {resumeData.summary}
                </p>
              </div>
              {/* Summary */}
              {resumeData.education && resumeData.education.length > 0 && (
                <div>
                  {/* Education Section */}
                  <h2
                    className={`text-lg font-semibold text-${selectedColor}-500 border-b-2 border-${selectedColor}-500 pb-2 mb-3`}
                  >
                    Education
                  </h2>
                  {resumeData.education &&
                    resumeData.education.map((edu, index) => (
                      <>
                        <div key={index} className="flex justify-between ">
                          <span className="text-sm font-semibold text-gray-300">
                            {edu.qualification}
                          </span>
                          <span className="text-sm text-gray-400">
                            {edu.year}
                          </span>
                        </div>
                        <p className="text-sm text-gray-400 mb-4">
                          {edu.location}
                        </p>
                      </>
                    ))}
                </div>
              )}

              {/* Skills Section */}
              <h2
                className={`text-lg font-semibold text-${selectedColor}-500 border-b-2 border-${selectedColor}-500 pb-2 mb-3`}
              >
                Skills
              </h2>
              {resumeData.technical_skills && (
                <div>
                  <h3 className="text-sm font-semibold text-teal-300 mb-2">
                    Technical Skills:
                  </h3>
                  <ul className="list-disc pl-4 mb-4 text-sm text-gray-400">
                    {resumeData.technical_skills &&
                      resumeData.technical_skills
                        .split(",")
                        .map((skill, index) => <li key={index}>{skill}</li>)}
                  </ul>
                </div>
              )}
              {resumeData.soft_skills && (
                <div>
                  <h3 className="text-sm font-semibold text-teal-300 mb-2">
                    Soft Skills:
                  </h3>
                  <ul className="list-disc pl-4 mb-4 text-sm text-gray-400">
                    {resumeData.soft_skills &&
                      resumeData.soft_skills
                        .split(",")
                        .map((skill, index) => <li key={index}>{skill}</li>)}
                  </ul>
                </div>
              )}
              {/* Hobbies Section */}
              {/* <h2 className={`text-lg font-semibold text-${selectedColor}-500 border-b-2 border-${selectedColor}-500 pb-2 mb-3`}>Hobbies</h2>
                <ul className="list-disc pl-4 mb-4 text-sm text-gray-400">
                  {resumeData.hobbies && resumeData.hobbies.split(",").map((hobby, index) => (
                    <li key={index}>{hobby}</li>
                  ))}
                </ul> */}
            </div>

            {/* Right Section - 60% */}
            <div className="w-3/5 bg-white text-gray-800 p-4 rounded-lg ml-4">
              {/* Experience Section */}
              {resumeData.experiences && resumeData.experiences.length > 0 && (
                <div>
                  <h2
                    className={`text-xl font-semibold text-${selectedColor}-500 border-b-2 border-${selectedColor}-500 pb-2 mb-4`}
                  >
                    Experience
                  </h2>
                  {resumeData.experiences &&
                    resumeData.experiences.map((job, index) => (
                      <div key={index}>
                        <p className="text-sm mb-2 font-semibold text-gray-700">
                          {job.company} - {job.role}
                        </p>
                        <ul className="list-disc pl-4 mb-4 text-sm text-gray-700">
                          {job.details}
                        </ul>
                      </div>
                    ))}
                </div>
              )}
              {/* Projects Section */}

              {resumeData.projects && resumeData.projects.length > 0 && (
                <div className="mb-3">
                  <h2
                    className={`text-xl font-semibold text-${selectedColor}-500 border-b-2 border-${selectedColor}-500 pb-2 mb-4`}
                  >
                    Projects
                  </h2>
                  {resumeData.projects &&
                    resumeData.projects.map((project, index) => (
                      <div key={index}>
                        <p className="text-sm mb-2 font-semibold text-gray-700">
                          {project.title}
                        </p>
                        {/* <h3 className="font-semibold text-gray-800">{project.title}</h3> */}
                        <p className="text-sm text-gray-700">
                          {project.details}
                        </p>
                      </div>
                    ))}
                </div>
              )}

              {resumeData.achievements && (
                <div className="mb-3">
                  <h2
                    className={`text-xl font-semibold text-${selectedColor}-500 border-b-2 border-${selectedColor}-500 pb-1`}
                  >
                    Achievements
                  </h2>
                  <p className="text-gray-700 pt-2 text-sm">
                    {resumeData.achievements}
                  </p>
                </div>
              )}

              {/* Hobbies Section */}
              {resumeData.hobbies && (
                <div className="mb-3">
                  <h2
                    className={`text-lg font-semibold text-${selectedColor}-500 border-b-2 border-${selectedColor}-500 pb-1`}
                  >
                    Hobbies
                  </h2>
                  <p className="text-gray-700 pt-2 text-sm">
                    {resumeData.hobbies}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      ),
      style: "bg-gray-50 text-gray-800 p-4 rounded-lg shadow-lg",
      previewStyle: "text-gray-900 p-6 rounded-lg overflow-auto",
    },

    {
      id: 5,
      title: "Template 5",
      img: "/images/resume5.png",
      content: (
        <div className="w-[794px] h-[1123px] mx-auto bg-gray-50 shadow-md p-6">
          {/* Header */}
          <div className="bg-blue-100 text-gray-800 p-4 rounded-b-lg mb-3 flex items-center">
            {/* Profile Image */}
            <img
              src={profileImage}
              alt="Profile"
              className="w-36 h-36 rounded-full border-2 border-gray-400 mr-6"
            />
            {/* Name and Contact Details */}
            <div className="flex-1 ml-2">
              <h1
                className={`text-3xl font-bold text-${selectedColor}-500 border-b-2 border-${selectedColor}-500 mb-2`}
              >
                {resumeData.name}
              </h1>
              <h3 className="text-xl font-semibold text-gray-700 mb-4">
                {resumeData.jobTitle}
              </h3>
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {resumeData.email && (
                    <>
                      {resumeData.email}{" "}
                      <span className="mx-2 text-gray-600">&bull;</span>
                    </>
                  )}
                  {resumeData.phone && (
                    <>
                      {resumeData.phone}{" "}
                      <span className="mx-2 text-gray-600">&bull;</span>
                    </>
                  )}
                  {resumeData.linkedin && (
                    <>
                      {resumeData.linkedin}{" "}
                      <span className="mx-2 text-gray-600">&bull;</span>
                    </>
                  )}

                  {resumeData.portfolio && (
                    <a
                      href={resumeData.portfolio}
                      // target="_blank"
                      className="mx-2 underline text-gray-600"
                    >
                      Portfolio
                    </a>
                  )}
                </p>
              </div>
            </div>
          </div>

          <div className="flex lg:flex-row">
            {/* Left Section - 60% (Now Experience and Projects) */}
            <div className="w-full lg:w-2/4 bg-white text-gray-800 p-4 rounded-lg mb-3 lg:mr-4">
              {/* Experience Section */}

              {resumeData.experiences && resumeData.experiences.length > 0 && (
                <div>
                  <h2
                    className={`text-xl font-semibold text-${selectedColor}-500 border-b-2 border-${selectedColor}-500 pb-2 mb-4`}
                  >
                    Experience
                  </h2>
                  {resumeData.experiences &&
                    resumeData.experiences.map((job, index) => (
                      <div key={index}>
                        <p className="text-sm mb-2 font-semibold text-gray-700">
                          {job.company} - {job.role}
                        </p>
                        <ul className="list-disc pl-4 mb-4 text-sm text-gray-700">
                          {job.details}
                        </ul>
                      </div>
                    ))}
                </div>
              )}
              {resumeData.experiences && resumeData.experiences.length > 0 && (
                <div>
                  <h2
                    className={`text-xl font-semibold text-${selectedColor}-500 border-b-2 border-${selectedColor}-500 pb-2 mb-4`}
                  >
                    Projects
                  </h2>
                  {resumeData.projects &&
                    resumeData.projects.map((project, index) => (
                      <div key={index}>
                        <p className="text-sm mb-2 font-semibold text-gray-700">
                          {project.title}
                        </p>
                        <p className="text-sm text-gray-700">
                          {project.details}
                        </p>
                      </div>
                    ))}
                </div>
              )}
              {/* Projects Section */}
            </div>

            {/* Right Section - 40% (Now Summary, Education, Skills, etc.) */}
            <div className="w-full lg:w-2/4 bg-blue-50 text-gray-800 p-4 rounded-lg">
              {/* Summary */}

              {resumeData.summary && (
                <div>
                  <h2
                    className={`text-xl font-semibold text-${selectedColor}-500 border-b-2 border-${selectedColor}-500 pb-2 mb-4`}
                  >
                    Summary
                  </h2>
                  <p className="text-sm mb-4 text-gray-700">
                    {resumeData.summary}
                  </p>
                </div>
              )}

              {/* Education Section */}

              {resumeData.education && resumeData.education.length > 0 && (
                <div>
                  <h2
                    className={`text-xl font-semibold text-${selectedColor}-500 border-b-2 border-${selectedColor}-500 pb-2 mb-4`}
                  >
                    Education
                  </h2>
                  {resumeData.education &&
                    resumeData.education.map((edu, index) => (
                      <div key={index} className="mb-4">
                        <div className="flex justify-between">
                          <span className="text-sm font-semibold text-gray-700">
                            {edu.qualification}
                          </span>
                          <span className="text-sm text-gray-600">
                            {edu.year}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{edu.location}</p>
                      </div>
                    ))}
                </div>
              )}

              {/* Skills Section */}
              {resumeData.education && (
                <div>
                  <h2
                    className={`text-xl font-semibold text-${selectedColor}-500 border-b-2 border-${selectedColor}-500 pb-2 mb-4`}
                  >
                    Skills
                  </h2>
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-3">
                      {resumeData.technical_skills &&
                        resumeData.technical_skills
                          .split(",")
                          .map((skill, index) => (
                            <span
                              key={index}
                              className="bg-teal-100 text-gray-700 text-sm px-2 py-1.5 rounded-lg shadow-md"
                            >
                              {skill}
                            </span>
                          ))}

                      {resumeData.soft_skills &&
                        resumeData.soft_skills
                          .split(",")
                          .map((skill, index) => (
                            <span
                              key={index}
                              className="bg-teal-100 text-gray-700 text-sm px-2 py-1.5 rounded-lg shadow-md"
                            >
                              {skill}
                            </span>
                          ))}
                    </div>
                  </div>
                </div>
              )}

              {resumeData.achievements && (
                <div className="w-full mt-5">
                  <h2
                    className={`text-lg font-semibold text-${selectedColor}-500 border-b-2 border-${selectedColor}-500 pb-2 mb-3`}
                  >
                    Achievements
                  </h2>
                  <p className="text-sm mb-1 text-gray-600">
                    {resumeData.achievements}
                  </p>
                </div>
              )}

              {resumeData.hobbies && (
                <div className="w-full mt-5">
                  <h2
                    className={`text-lg font-semibold text-${selectedColor}-500 border-b-2 border-${selectedColor}-500 pb-2 mb-3`}
                  >
                    Hobbies
                  </h2>
                  <p className="text-sm mb-1 text-gray-600">
                    {resumeData.hobbies}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      ),
      style: "bg-gray-50 text-gray-800 p-4 rounded-lg shadow-lg",
      previewStyle: "text-gray-900 p-6 rounded-lg overflow-auto",
    },

    {
      id: 6,
      title: "Template 2",
      img: "/images/resume6.png",
      content: (
        <div className="w-[794px] h-[1123px] mx-auto p-4 shadow-md bg-white">
          <div className="bg-white text-gray-800 p-4 rounded-lg max-w-screen-md w-full flex">
            {/* Right Section - 70% */}
            <div className="w-3/5 bg-white text-gray-800 p-4 rounded-lg mr-4">
              {/* Name */}
              <div className="mb-5 items-center">
                <h1 className={`text-2xl font-bold`}>{resumeData.name}</h1>
                <p className="text-gray-600 text-sm">{resumeData.jobTitle}</p>
              </div>

              {/* Summary */}

              {resumeData.summary && (
                <div>
                  <h2
                    className={`text-lg font-semibold text-${selectedColor}-500 border-b-2 border-${selectedColor}-500 pb-2 mb-3`}
                  >
                    Summary
                  </h2>
                  <p className="text-sm mb-3 text-gray-700">
                    {resumeData.summary}
                  </p>
                </div>
              )}

              {/* Experience */}
              {resumeData.experiences && resumeData.experiences.length > 0 && (
                <div className="w-full mb-3">
                  <h2
                    className={`text-lg font-semibold text-${selectedColor}-500 border-b-2 border-${selectedColor}-500 pb-1`}
                  >
                    Experience
                  </h2>
                  <div className="flex flex-col space-y-1">
                    {resumeData.experiences.map((job, index) => (
                      <div key={index}>
                        <h3 className="font-semibold text-gray-800">
                          {job.role}
                        </h3>
                        <p className="text-sm font-semibold text-gray-600">
                          {job.company} ({job.duration})
                        </p>
                        <ul className="list-disc mt-1 mb-3 text-sm text-gray-700">
                          {job.details}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Projects */}

              {resumeData.projects && resumeData.projects.length > 0 && (
                <div>
                  <h2
                    className={`text-lg font-semibold mt-5 text-${selectedColor}-500 border-b-2 border-${selectedColor}-500 pb-2 mb-3`}
                  >
                    Projects
                  </h2>
                  <div className="w-full">
                    <div className="space-y-1">
                      {resumeData.projects.map((project, index) => (
                        <div key={index}>
                          <h3 className="font-semibold text-gray-800">
                            {project.title}
                          </h3>
                          <p className="text-sm text-gray-700">
                            {project.details}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Additional Custom Sections */}
              {/* {resumeSections.map((section, index) => (
                <div key={index} className="mb-3 rounded-md">
                  <h2 className="text-xl font-semibold text-blue-600 mb-2">
                    {section.heading || "Untitled Section"}
                  </h2>
                  <p className="text-gray-700">
                    {section.textParagraph || "No description available."}
                  </p>
                </div>
              ))} */}
            </div>

            {/* Left Section - 30% */}
            <div className="w-2/5 bg-gray-200 text-gray-800 p-4 rounded-lg">
              {/* Profile Image */}
              <div className="flex justify-center items-center mb-4">
                <img
                  src={profileImage}
                  alt="Profile"
                  className="w-32 h-32 rounded-full border-2 border-gray-400"
                />
              </div>

              {/* Contact Details */}
              <h2
                className={`text-lg font-semibold text-${selectedColor}-500 border-b-2 border-${selectedColor}-500 pb-2 mb-3 mt-5`}
              >
                Contact Details
              </h2>
              {resumeData.email && (
                <p className="text-sm mb-1 text-gray-600">{resumeData.email}</p>
              )}
              {resumeData.phone && (
                <p className="text-sm mb-1 text-gray-600">{resumeData.phone}</p>
              )}
              {resumeData.linkedin && (
                <p className="text-sm mb-1 text-gray-600">
                  {resumeData.linkedin}
                </p>
              )}

              {resumeData.portfolio && (
                <a
                  href={resumeData.portfolio}
                  // target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm underline text-gray-600"
                >
                  {resumeData.name}_portfolio
                </a>
              )}

              {/* Education */}
              {resumeData.education && resumeData.education.length > 0 && (
                <div className="w-full mt-5">
                  <h2
                    className={`text-lg font-semibold text-${selectedColor}-500 border-b-2 border-${selectedColor}-500 pb-2 mb-3`}
                  >
                    Education
                  </h2>
                  {resumeData.education.map((edu, index) => (
                    <div key={index} className="text-sm text-gray-700">
                      <p>
                        <span className="text-sm font-semibold text-gray-700">
                          {edu.qualification}
                        </span>
                        <span className="text-gray-600 ml-3">({edu.year})</span>
                      </p>
                      <p className="text-sm text-gray-600 mb-3">
                        {edu.location}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Skills */}

              {(resumeData.technical_skills || resumeData.soft_skills) && (
                <h2
                  className={`text-lg mt-5 font-semibold text-${selectedColor}-500 border-b-2 border-${selectedColor}-500 pb-2`}
                >
                  Skills
                </h2>
              )}

              {/* Technical Skills */}

              {resumeData.technical_skills && (
                <div className="w-full mb-2">
                  <h3 className="text-sm font-semibold text-teal-600 mt-3 mb-2">
                    Technical Skills:
                  </h3>
                  <ul className="list-disc pl-5 text-sm text-gray-700">
                    {resumeData.technical_skills
                      .split(",")
                      .map((skill, index) => {
                        const trimmedSkill = skill
                          .replace(/['"]+/g, "")
                          .replace(":", "")
                          .trim();
                        return (
                          <li key={index} className="mb-1">
                            {trimmedSkill}
                          </li>
                        );
                      })}
                  </ul>
                </div>
              )}

              {/* Soft Skills */}
              {resumeData.soft_skills && (
                <div className="w-full mb-2">
                  <h3 className="text-sm font-semibold text-teal-600 mb-1">
                    Soft Skills:
                  </h3>
                  <ul className="list-disc pl-5 text-sm text-gray-700">
                    {resumeData.soft_skills.split(",").map((skill, index) => (
                      <li key={index} className="mb-1">
                        {skill.replace(":", "").trim()}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {resumeData.achievements && (
                <div className="w-full mt-5">
                  <h2
                    className={`text-lg font-semibold text-${selectedColor}-500 border-b-2 border-${selectedColor}-500 pb-2 mb-3`}
                  >
                    Achievements
                  </h2>
                  <p className="text-sm mb-1 text-gray-600">
                    {resumeData.achievements}
                  </p>
                </div>
              )}

              {resumeData.hobbies && (
                <div className="w-full mt-5">
                  <h2
                    className={`text-lg font-semibold text-${selectedColor}-500 border-b-2 border-${selectedColor}-500 pb-2 mb-3`}
                  >
                    Hobbies
                  </h2>
                  <p className="text-sm mb-1 text-gray-600">
                    {resumeData.hobbies}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      ),
      style: "bg-gray-50 text-gray-800 p-4 rounded-lg shadow-lg",
      previewStyle: "text-gray-900 p-6 rounded-lg overflow-auto",
    },

    ,
    {
      id: 7,
      title: "Template 7",
      img: "/images/resume7.png",
      content: (
        <div className="w-[794px] h-[1123px] mx-auto bg-white shadow-md p-4">
          {/* Header */}
          <div className="flex items-center mb-4 bg-blue-100 p-4 rounded-t-lg">
            {/* Profile Image */}
            <img
              src={profileImage}
              alt="Profile"
              className="w-36 h-36 rounded-full border-2 border-gray-400 mr-6"
            />
            {/* Name and Contact Details */}
            <div className="flex-1">
              <h1
                className={`text-3xl font-bold text-${selectedColor}-500 mb-1`}
              >
                {resumeData.name}
              </h1>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                {resumeData.jobTitle}
              </h3>
              <p className="text-sm font-medium text-gray-600">
                {resumeData.email && (
                  <>
                    {resumeData.email}{" "}
                    <span className="mx-2 text-gray-600">&bull;</span>
                  </>
                )}
                {resumeData.phone && (
                  <>
                    {resumeData.phone}{" "}
                    <span className="mx-2 text-gray-600">&bull;</span>
                  </>
                )}
                {resumeData.linkedin && (
                  <>
                    {resumeData.linkedin}{" "}
                    <span className="mx-2 text-gray-600">&bull;</span>
                  </>
                )}

                {resumeData.portfolio && (
                  <a
                    href={resumeData.portfolio}
                    // target="_blank"
                    className="mx-2 underline text-gray-600"
                  >
                    Portfolio
                  </a>
                )}
              </p>
            </div>
          </div>

          {/* Content Sections */}
          <div className="w-full bg-white text-gray-800">
            {/* Summary Section */}
            <h2
              className={`text-xl font-semibold text-${selectedColor}-500 bg-${selectedColor}-50 py-2 px-4 rounded-t-lg `}
            >
              Summary
            </h2>
            <p className="text-sm text-gray-700 mb-2 px-4">
              {resumeData.summary}
            </p>

            {/* Experience Section */}
            <h2
              className={`text-xl font-semibold text-${selectedColor}-500 bg-${selectedColor}-50 py-2 px-4 rounded-t-lg `}
            >
              Experience
            </h2>
            {resumeData.experiences &&
              resumeData.experiences.map((job, index) => (
                <div key={index} className="mb-2">
                  <p className="text-sm font-semibold text-gray-700 px-4">
                    {job.company} - {job.role}
                  </p>
                  <ul className="list-disc pl-8 text-sm text-gray-700 mb-4 px-4">
                    {job.details}
                  </ul>
                </div>
              ))}

            {/* Projects Section */}
            <h2
              className={`text-xl font-semibold text-${selectedColor}-500 bg-${selectedColor}-50 py-2 px-4 rounded-t-lg `}
            >
              Projects
            </h2>
            {resumeData.projects &&
              resumeData.projects.map((project, index) => (
                <div key={index} className="mb-2">
                  <p className="text-sm font-semibold text-gray-700 px-4">
                    {project.title}
                  </p>
                  <p className="text-sm text-gray-700 px-4">
                    {project.details}
                  </p>
                </div>
              ))}

            {/* Education Section */}
            <h2
              className={`text-xl font-semibold text-${selectedColor}-500 bg-${selectedColor}-50 py-2 px-4 rounded-t-lg `}
            >
              Education
            </h2>
            {resumeData.education &&
              resumeData.education.map((edu, index) => (
                <div key={index} className="mb-2">
                  <div className="flex justify-between px-4">
                    <span className="text-sm font-semibold text-gray-700">
                      {edu.qualification}
                    </span>
                    <span className="text-sm text-gray-600">{edu.year}</span>
                  </div>
                  <p className="text-sm text-gray-600 px-4">{edu.location}</p>
                </div>
              ))}

            {/* Skills Section */}

            <h2
              className={`text-xl font-semibold text-${selectedColor}-500 bg-${selectedColor}-50 py-2 px-4 rounded-t-lg `}
            >
              Skills
            </h2>
            <div className="mb-2 px-4">
              <p className="text-sm text-gray-700">
                {resumeData.technical_skills &&
                  resumeData.technical_skills.split(",").join(", ")}
              </p>
              <p className="text-sm text-gray-700 mt-2">
                {resumeData.soft_skills &&
                  resumeData.soft_skills.split(",").join(", ")}
              </p>
            </div>

            {resumeData.achievements && (
              <div className="w-full px-4">
                <h2
                  className={`text-lg font-semibold text-${selectedColor}-500 `}
                >
                  Achievements
                </h2>
                <p className="text-sm mb-1 text-gray-600">
                  {resumeData.achievements}
                </p>
              </div>
            )}

            {resumeData.hobbies && (
              <div className="w-full px-4 ">
                <h2
                  className={`text-lg font-semibold text-${selectedColor}-500 mt-3 `}
                >
                  Hobbies
                </h2>
                <p className="text-sm mb-1 text-gray-600">
                  {resumeData.hobbies}
                </p>
              </div>
            )}
          </div>
        </div>
      ),
      style: "bg-white text-gray-800 p-4 rounded-lg shadow-lg",
      previewStyle: "text-gray-900 p-4 rounded-lg overflow-auto",
    },
  ];

  const handlePrint = useReactToPrint({
    content: () => resumeRef.current,
    documentTitle: "Resume",
    pageStyle: `
      @page { size: A4; margin-top: 0; margin-bottom: 0; }
      body { padding-top: 72px; padding-bottom: 72px; }
      #section-to-print { visibility: visible; position: absolute; left: 0; top: 0; }
    `,
  });

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const goToHomePage = () => {
    router.push("/");
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-r from-purple-300 via-pink-200 to-blue-300 ">
      {/* Header */}

      <div className="p-6 bg-gradient-to-r from-blue-600 to-indigo-700 text-white text-center font-bold text-3xl rounded-lg shadow-xl relative">
        <h1>Resume Builder</h1>
      </div>

      <div className="absolute top-6 left-8 flex space-x-4 z-20">
        <button
          onClick={goToHomePage} 
          className="bg-white text-blue-600 py-2 px-6 rounded-md shadow-md hover:bg-gray-100 transition-all duration-300 ease-in-out text-sm font-semibold"
        >
          Home
        </button>

        <button
          onClick={openModal}
          className="bg-blue-500 text-white py-2 px-6 rounded-md shadow-md hover:bg-blue-600 transition-all duration-300 ease-in-out text-sm font-semibold"
        >
          Select Template
        </button>
      </div>

      <div className="absolute top-6 right-12 flex space-x-4 z-20">
        <button
          onClick={() => handleClick("/create-resume")} // Define handleClick to navigate
          className="bg-yellow-500 text-white py-2 px-6 rounded-md shadow-md hover:bg-yellow-600 transition-all duration-300 ease-in-out text-sm font-semibold"
        >
          Edit
        </button>

        <button
          onClick={handlePrint} 
          className="bg-green-500 text-white py-2 px-6 rounded-md shadow-md hover:bg-green-600 transition-all duration-300 ease-in-out text-sm font-semibold"
        >
          Download
        </button>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-auto p-4 mt-12">

        {/* Resume Template option Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-gradient-to-r from-pink-50 via-purple-300 to-pink-200 flex justify-center items-center z-50">
            <div className="bg-gradient-to-r from-pink-50  via-purple-50 to-pink-50  p-20 rounded-lg max-w-6xl w-full overflow-y-auto max-h-[90vh] relative shadow-lg">
              <button
                className="absolute bg-slate-100 px-2 shadow-md top-8 right-8 text-gray-500 hover:text-gray-800"
                onClick={closeModal}
              >
                <span className="text-2xl">&times;</span>
              </button>

              <div className="flex flex-col items-start mb-3 pl-7">
                <h2 className="text-left text-5xl text-gray-800 font-semibold mb-2">
                  Choose a template
                </h2>
                <p className="text-left text-md mt-1 text-gray-500 ">
                  Our resume templates are based on what employers actually look
                  for in a candidate.
                  <br /> How do we know? We’ve talked with thousands of
                  employers to get the answers.
                </p>

                <h2 className="text-left text-2xl mt-16 text-purple-700 font-semibold mb-2">
                  Recommended
                </h2>
                <p className="text-left text-md mt-1 mb-4 text-gray-500 ">
                  Each template is designed for online job applications and
                  getting through the ATS software that scans your resume.
                  <br /> These templates follow the rules hiring managers are
                  looking for.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-8 overflow-auto">
                {resumeTemplates.map((template) => (
                  <div
                    key={template.id}
                    className="transition-all transform group hover:scale-95 mt-10 cursor-pointer relative"
                    onClick={() => {
                      setSelectedTemplate(template);
                      closeModal();
                    }}
                  >
                    <div className="relative group">
                      <img
                        src={template.img}
                        alt={`Template ${template.id}`}
                        className={`transition-all transform group-hover:scale-95 w-64 h-92 object-cover rounded-lg shadow-md mx-auto
                        ${
                          selectedTemplate?.id === template.id
                            ? "border-4 border-violet-600 scale-95 "
                            : "border-gray-200"
                        }
                      `}
                      />
                      <div className="absolute top-1/2 left-1/2 w-20 h-20 bg-purple-500 rounded-full opacity-0 group-hover:opacity-60 transform -translate-x-1/2 -translate-y-1/2 transition-all"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Resume Preview */}
        {selectedTemplate ? (
          <div
            className={`flex flex-col lg:flex-1 ${
              selectedTemplate.previewStyle || ""
            }`}
            style={{
              transform: `scale(${scale})`,
              transformOrigin: "top left", 
              overflow:
                scale < 0.6 && window.innerWidth < 1024 ? "visible" : "auto", 
            }}
          >
            <div className="relative w-full lg:w-3/4 lg:ml-40">
              <div ref={resumeRef} className="section-to-print -ml-3">
                {selectedTemplate.content}
              </div>
            </div>
            <div className="p-4 lg:w-1/4 flex flex-col">
              <button
                className="mb-4 p-2 bg-gray-200 text-gray-800 rounded-lg shadow lg:hidden"
                onClick={() => setSelectedTemplate(null)}
              >
                Back to Templates
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-1 items-center justify-center bg-gradient-to-r from-purple-300 via-pink-200 to-blue-300 rounded-lg shadow-md p-6">
            <div className="text-center mb-3">
              <div className="flex items-center justify-center mb-4">
                <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-10 h-10"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16 12H8m0 0l4-4m-4 4l4 4"
                    />
                  </svg>
                </div>
              </div>
              <h2 className="text-2xl font-semibold text-gray-800">
                Choose Your Perfect Template
              </h2>
              <p className="text-gray-600 mt-2">
                Select a template to preview your resume in real-time. Create a
                professional and stunning resume in just a few clicks.
              </p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-500 text-white px-6 py-3 rounded-md shadow hover:bg-blue-600 transition-all duration-200"
            >
              Get Started
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeBuilder;
