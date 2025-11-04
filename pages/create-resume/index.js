import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { PlusIcon, TrashIcon, MinusIcon } from "@heroicons/react/outline";
import Header from "../components/Head";

const ResumeForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    jobTitle: "",
    linkedin: "",
    educations: [{ qualification: "", year: "", location: "", details: "" }],
    technicalSkills: "",
    softSkills: "",
    projects: [{ title: "", details: "", techStack: "" }],
    summary: "",
    experiences: [
      {
        duration: "",
        company: "",
        role: "",
        details: "",
      },
    ],
    achievements: "",
    hobbies: "",
    certifications: "",
    portfolio: "",
  });

  const [profileImage, setProfileImage] = useState(null);
  const [activeSection, setActiveSection] = useState({
    basic: true,
    educations: false,
    projects: false,
    experience: true,
    technicalSkills: true,
    softSkills: true,
    summary: true,
    achievements: false,
    hobbies: false,
    certifications: false,
    portfolio: false,
  });
  const [showModal, setShowModal] = useState(false);
  const [sections, setSections] = useState([]);
  const [newSection, setNewSection] = useState({ name: "", content: "" });
  const [submitMessage, setSubmitMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDynamicChange = (section, index, e) => {
    const { name, value } = e.target;
    const updatedSection = formData[section].map((item, i) =>
      i === index ? { ...item, [name]: value } : item
    );
    setFormData({ ...formData, [section]: updatedSection });
  };

  const addSectionItem = (section) => {
    const newItem =
      section === "educations"
        ? { qualification: "", year: "", location: "", details: "" }
        : section === "projects"
        ? { title: "", details: "", techStack: "" }
        : section === "experiences"
        ? {
            // joiningDate: "",
            duration: "",
            company: "",
            role: "",
            details: "",
          }
        : { title: "" };

    setFormData({
      ...formData,
      [section]: [...formData[section], newItem],
    });
  };

  const removeSectionItem = (section, index) => {
    const updatedItems = formData[section].filter((_, i) => i !== index);
    setFormData({ ...formData, [section]: updatedItems });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setProfileImage(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        localStorage.setItem("profileImage", reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setProfileImage(null);
    localStorage.removeItem("profileImage");
  };

  useEffect(() => {
    const savedImage = localStorage.getItem("profileImage");
    if (savedImage) {
      setProfileImage(savedImage);
    }
  }, []);

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedSections = JSON.parse(localStorage.getItem("customSections"));
    if (savedSections) {
      setSections(savedSections);
    }
  }, []);

  // Save sections to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("customSections", JSON.stringify(sections));
  }, [sections]);

  // const handleInputChange1 = (e) => {
  //   const { name, value } = e.target;
  //   setNewSection({ ...newSection, [name]: value });
  // };

  // const addSection = () => {
  //   if (newSection.name.trim() && newSection.content.trim()) {
  //     setSections([...sections, newSection]);
  //     setNewSection({ name: "", content: "" }); // Reset fields
  //   }
  // };

  const displayProfileImage = () => {
    if (typeof window === "undefined") return null;

    if (profileImage instanceof window.File) {
      return (
        <img
          src={URL.createObjectURL(profileImage)}
          alt="Profile"
          className="w-32 h-32 object-cover rounded-full"
        />
      );
    } else if (typeof profileImage === "string" && profileImage !== "") {
      return (
        <img
          src={profileImage}
          alt="Profile"
          className="w-32 h-32 object-cover rounded-full"
        />
      );
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation: Check for required sections
    if (!formData.summary || formData.summary.trim() === '') {
      alert('Please provide a professional summary.');
      return;
    }

    if (!formData.educations || formData.educations.length === 0) {
      alert('Please add at least one education entry.');
      return;
    }

    if (!formData.experiences || formData.experiences.length === 0) {
      alert('Please add at least one work experience entry.');
      return;
    }

    // Validate that required fields in dynamic sections are filled
    const validateDynamicSection = (section, sectionName) => {
      return section.every((item, index) => {
        if (sectionName === 'educations') {
          return item.qualification && item.year && item.location;
        }
        if (sectionName === 'experiences') {
          return item.duration && item.company && item.role;
        }
        if (sectionName === 'projects') {
          return item.title;
        }
        return true;
      });
    };

    if (!validateDynamicSection(formData.educations, 'educations')) {
      alert('Please fill in all required fields (qualification, year, location) for all education entries.');
      return;
    }

    if (!validateDynamicSection(formData.experiences, 'experiences')) {
      alert('Please fill in all required fields (duration, company, role) for all experience entries.');
      return;
    }

    if (formData.projects && formData.projects.length > 0) {
      if (!validateDynamicSection(formData.projects, 'projects')) {
        alert('Please fill in the title for all project entries.');
        return;
      }
    }

    setIsLoading(true);
    setSubmitMessage("Generating your professional resume...");

    try {
      const response = await fetch('/api/generate-resume-ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ formData }),
      });
      if (response.ok) {
        const fieldSuggestions = await response.json();
        // Save field suggestions and original data
        localStorage.setItem("originalData", JSON.stringify(formData));
        localStorage.setItem("fieldSuggestions", JSON.stringify(fieldSuggestions));
        setSubmitMessage("AI suggestions generated! Redirecting...");
        setTimeout(() => {
          router.push("/ai-suggestions");
        }, 2000);
      } else {
        const errorData = await response.json();
        setSubmitMessage(errorData.error || "Failed to generate resume. Please try again.");
        setTimeout(() => {
          setIsLoading(false);
        }, 3000);
      }
    } catch (error) {
      console.error(error);
      setSubmitMessage("An error occurred. Please try again.");
      setTimeout(() => {
        setIsLoading(false);
      }, 3000);
    }
  };

  const clearForm = () => {
    if (window.confirm('Are you sure you want to clear all form data? This action cannot be undone.')) {
      localStorage.removeItem('formData');
      localStorage.removeItem('activeSections');
      localStorage.removeItem('customSections');
      localStorage.removeItem('profileImage');
      setFormData({
        name: "",
        email: "",
        phone: "",
        jobTitle: "",
        linkedin: "",
        educations: [{ qualification: "", year: "", location: "", details: "" }],
        technicalSkills: "",
        softSkills: "",
        projects: [{ title: "", details: "", techStack: "" }],
        summary: "",
        experiences: [
          {
            duration: "",
            company: "",
            role: "",
            details: "",
          },
        ],
        achievements: "",
        hobbies: "",
        certifications: "",
        portfolio: "",
      });
      setActiveSection({
        basic: true,
        educations: false,
        projects: false,
        experience: true,
        technicalSkills: true,
        softSkills: true,
        summary: true,
        achievements: false,
        hobbies: false,
        certifications: false,
        portfolio: false,
      });
      setProfileImage(null);
      setSections([]);
      setSubmitMessage("");
    }
  };

  const toggleSection = (section) => {
    const newActiveSection = {
      ...activeSection,
      [section]: !activeSection[section],
    };
    setActiveSection(newActiveSection);
    localStorage.setItem("activeSections", JSON.stringify(newActiveSection));
  };

  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem("formData") || "{}");
    setFormData({
      ...formData,
      ...savedData,
      educations: savedData.educations || [],
      projects: savedData.projects || [],
      experiences: savedData.experiences || [],
      portfolio: savedData.portfolio || "", // Retrieve portfolio from localStorage if exists
    });

    // Retrieve section state from localStorage
    const savedSectionState = JSON.parse(
      localStorage.getItem("activeSections")
    );
    if (savedSectionState) {
      setActiveSection(savedSectionState);
    }

    const savedImage = localStorage.getItem("profileImage");
    if (savedImage) {
      setProfileImage(savedImage);
    }
  }, []);

  return (
    <>
      <Header />
      {isLoading ? (
        <LoadingScreen message={submitMessage} />
      ) : (
        <div className="min-h-screen flex bg-gray-50">
          <div className="w-1/5 bg-purple-800 text-white p-6 space-y-6 shadow-xl h-screen overflow-y-auto">
            <h2 className="text-xl font-semibold">Sections</h2>
            {[
              "basic",
              "educations",
              "projects",
              "experiences",
              "technicalSkills",
              "softSkills",
              "summary",
              "achievements",
              "hobbies",
              "certifications",
              "portfolio",
            ].map((section) => (
              <div key={section}>
                <div
                  className={`flex justify-between items-center shadow-sm cursor-pointer py-2 px-4 rounded-md transition duration-300 ease-in-out hover:bg-purple-900 hover:scale-105 ${
                    activeSection[section] ? "bg-purple-700 shadow-2xl" : ""
                  }`}
                  onClick={() => toggleSection(section)}
                >
                  <span>
                    {section.charAt(0).toUpperCase() + section.slice(1)}
                  </span>
                  {activeSection[section] ? (
                    <MinusIcon className="w-5 h-5" />
                  ) : (
                    <PlusIcon className="w-5 h-5" />
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Main Form Area (Scrollable) */}
          <div className="w-4/5 p-8 space-y-6 overflow-y-auto h-screen">
            <h1 className="text-3xl font-semibold text-purple-600 text-center mb-6">
              Resume Builder
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information Section */}
              {activeSection.basic && (
                <div className="shadow-lg rounded-lg p-6 bg-white transition-all duration-300 hover:shadow-xl">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {["name", "email", "phone", "jobTitle"].map(
                      (field) => (
                        <div key={field}>
                          <label className="block text-gray-700 font-medium mb-2">
                            {field.charAt(0).toUpperCase() + field.slice(1)} <span className="text-red-500">*</span>
                          </label>
                          <input
                            type={field === "email" ? "email" : "text"}
                            name={field}
                            value={formData[field]}
                            onChange={handleChange}
                            className="w-full p-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600 transition duration-300 ease-in-out text-black"
                            placeholder={`Enter your ${field}`}
                            required
                          />
                        </div>
                      )
                    )}
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        Linkedin
                      </label>
                      <input
                        type="text"
                        name="linkedin"
                        value={formData.linkedin}
                        onChange={handleChange}
                        className="w-full p-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600 transition duration-300 ease-in-out text-black"
                        placeholder="Enter your linkedin profile"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Profile Image
                    </label>
                    <div className="flex flex-col items-center space-y-4">
                      {profileImage ? (
                        <div className="relative">
                          <img
                            src={typeof profileImage === 'string' ? profileImage : URL.createObjectURL(profileImage)}
                            alt="Profile"
                            className="w-32 h-32 object-cover rounded-full border-4 border-purple-200"
                          />
                          <button
                            type="button"
                            onClick={removeImage}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition-colors"
                            title="Remove image"
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-full flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
                          <svg className="w-8 h-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                          <span className="text-sm text-gray-500">Upload Image</span>
                        </div>
                      )}
                      <div className="flex space-x-2">
                        <label className="cursor-pointer bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors text-sm font-medium">
                          {profileImage ? 'Change Image' : 'Upload Image'}
                          <input
                            type="file"
                            onChange={handleImageChange}
                            accept="image/*"
                            className="hidden"
                          />
                        </label>
                        {profileImage && (
                          <button
                            type="button"
                            onClick={removeImage}
                            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors text-sm font-medium"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Dynamic Sections */}
              {["educations", "projects", "experiences"].map(
                (section) =>
                  activeSection[section] && (
                    <DynamicSection
                      key={section}
                      title={section.charAt(0).toUpperCase() + section.slice(1)}
                      items={formData[section]}
                      fields={
                        section === "educations"
                          ? ["qualification", "year", "location", "details"]
                          : section === "projects"
                          ? ["title", "details", "techStack"]
                          : [
                              // "joiningDate",
                              "duration",
                              "company",
                              "role",
                              "details",
                            ]
                      }
                      addItem={() => addSectionItem(section)}
                      removeItem={(index) => removeSectionItem(section, index)}
                      handleChange={(e, index) =>
                        handleDynamicChange(section, index, e)
                      }
                    />
                  )
              )}

              {/* Other Sections */}
              {activeSection.summary && (
                <TextAreaSection
                  label="Summary"
                  name="summary"
                  value={formData.summary}
                  onChange={handleChange}
                  charLimit={600}
                  required={true}
                />
              )}

              {activeSection.technicalSkills && (
                <TextAreaSection
                  label="Technical Skills"
                  name="technicalSkills"
                  value={formData.technicalSkills}
                  onChange={handleChange}
                  charLimit={500}
                />
              )}

              {activeSection.softSkills && (
                <TextAreaSection
                  label="Soft Skills"
                  name="softSkills"
                  value={formData.softSkills}
                  onChange={handleChange}
                  charLimit={500}
                />
              )}

              {activeSection.hobbies && (
                <TextAreaSection
                  label="Hobbies"
                  name="hobbies"
                  value={formData.hobbies}
                  onChange={handleChange}
                  charLimit={500}
                />
              )}

              {activeSection.achievements && (
                <TextAreaSection
                  label="Achievements"
                  name="achievements"
                  value={formData.achievements}
                  onChange={handleChange}
                  charLimit={500}
                />
              )}

              {activeSection.certifications && (
                <TextAreaSection
                  label="Certifications"
                  name="certifications"
                  value={formData.certifications}
                  onChange={handleChange}
                  charLimit={500}
                />
              )}

              {activeSection.portfolio && (
                <div className="shadow-lg rounded-lg p-6 bg-white transition-all duration-300 hover:shadow-xl">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Portfolio
                    </label>
                    <input
                      type="url"
                      name="portfolio"
                      value={formData.portfolio}
                      onChange={handleChange}
                      className="w-full p-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600 transition duration-300 ease-in-out text-black"
                      placeholder="Enter your portfolio link"
                    />
                  </div>
                </div>
              )}

              {submitMessage && !isLoading && (
                <div className="text-green-500 mb-4 text-center">
                  {submitMessage}
                </div>
              )}

              {/* Submit Button */}
              <div className="text-center flex justify-center space-x-4">
                <button
                  type="button"
                  onClick={clearForm}
                  className="px-6 py-3 bg-red-500 text-white font-medium text-lg rounded-md hover:bg-red-600 transition duration-300 ease-in-out"
                  disabled={isLoading}
                >
                  Clear Form
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-purple-600 text-white font-medium text-lg rounded-md hover:bg-purple-700 transition duration-300 ease-in-out"
                  disabled={isLoading}
                >
                  {isLoading ? "Generating..." : "Save Resume"}
                </button>
              </div>
            </form>


            {/* {showModal && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
                <div className="bg-white rounded-lg shadow-lg p-8 w-96 text-center transform transition-transform duration-300 ease-out animate-slide-down">
                  <div className="flex items-center justify-center mb-4">
                    <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="w-8 h-8"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 12l2 2l4-4m7 2a9 9 0 11-18 0a9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-800">
                    Success!
                  </h2>
                  <p className="text-gray-600 mt-2">
                    Your data has been saved successfully. You will be redirected
                    shortly.
                  </p>
                </div>
              </div>
            )} */}
            {/* <div className="min-h-screen bg-purple-50 flex flex-col items-center py-10">
                <h1 className="text-3xl font-bold text-gray-700 mb-6">
                  Custom Sections for Resume
                </h1>
                <div className="w-full bg-white p-6 shadow-lg rounded-lg">
                  <h2 className="text-xl font-semibold text-gray-600 mb-4">
                    Add a New Section
                  </h2>
                  <div className="space-y-6">
                    <div className="flex flex-col">
                      <label className="block text-gray-700 font-medium mb-2">
                        Section Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={newSection.name}
                        onChange={handleInputChange1}
                        className="w-full p-3 border-2 border-purple-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Enter section name"
                      />
                    </div>

                    <div className="flex flex-col">
                      <label className="block text-gray-700 font-medium mb-2">
                        Section Content
                      </label>
                      <textarea
                        name="content"
                        value={newSection.content}
                        onChange={handleInputChange1}
                        rows={6}
                        className="w-full p-3 border-2 border-purple-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Enter section content"
                      />
                    </div>

                    <div className="flex justify-start">
                      <button
                        onClick={addSection}
                        className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white font-medium rounded-md hover:bg-purple-800 transition duration-300"
                      >
                        <span className="text-xl">+</span> Add Section
                      </button>
                    </div>
                  </div>
                </div>
              </div> */}
          </div>
        </div>
      )}
    </>
  );
};

const DynamicSection = ({
  title,
  items,
  fields,
  addItem,
  removeItem,
  handleChange,
  }) => {
  // Define required fields for each section type
  const getRequiredFields = (sectionTitle) => {
    switch (sectionTitle.toLowerCase()) {
      case 'educations':
        return ['qualification', 'year', 'location'];
      case 'experiences':
        return ['duration', 'company', 'role'];
      case 'projects':
        return ['title'];
      default:
        return [];
    }
  };

  const requiredFields = getRequiredFields(title);

  return (
   <div className="shadow-lg rounded-lg p-6 bg-white transition-all duration-300 hover:shadow-xl">
    <h3 className="text-2xl font-semibold mb-4">{title}</h3>
    {items.map((item, index) => (
      <div key={index} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
          {fields.map((field) => (
            <div key={field}>
              <label className="block text-gray-700 font-medium mb-2">
                {field.charAt(0).toUpperCase() + field.slice(1)}
                {requiredFields.includes(field) && <span className="text-red-500">*</span>}
              </label>
              <textarea
                type="text"
                name={field}
                value={item[field]}
                onChange={(e) => handleChange(e, index)}
                className="w-full p-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600 transition duration-300 ease-in-out text-black"
                placeholder={`Enter ${field}`}
                required={requiredFields.includes(field)}
              />
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-4">
          <button
            type="button"
            onClick={() => removeItem(index)}
            className="bg-red-500 text-white py-1 px-4 rounded-md hover:bg-red-600 transition duration-300 ease-in-out"
          >
            Remove
          </button>
        </div>
      </div>
    ))}

    <button
      type="button"
      onClick={addItem}
      className="mt-4 flex items-center space-x-2 shadow-md bg-green-500 text-white py-1 px-4 rounded-md transition duration-300 ease-in-out"
    >
      <PlusIcon className="w-5 h-5" />
      <span>Add {title}</span>
    </button>
  </div>
  );
};

const TextAreaSection = ({ label, name, value, onChange, charLimit, required }) => {
  const handleInputChange = (e) => {
    const { value } = e.target;
    if (!charLimit || value.length <= charLimit) {
      onChange(e);
    }
  };

  return (
    <div className="shadow-lg rounded-lg p-6 bg-white transition-all duration-300 hover:shadow-xl">
      <label className="block text-gray-700 font-medium mb-2">
        {label}{required && <span className="text-red-500">*</span>}
      </label>
      <textarea
        name={name}
        value={value}
        onChange={handleInputChange}
        className="w-full p-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600 transition duration-300 ease-in-out text-black"
        rows={4}
        placeholder={`Enter your ${label.toLowerCase()}`}
        required={required}
      />
      {charLimit && (
        <p className="text-sm text-gray-500 mt-1">
          {value.length}/{charLimit} characters
        </p>
      )}
    </div>
  );
};

const LoadingScreen = ({ message }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-75 backdrop-blur-sm">
      <div className="bg-white rounded-lg p-8 shadow-2xl max-w-md w-full mx-4">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-600 border-solid mb-6"></div>
          <h2 className="text-2xl font-bold text-purple-600 mb-4">Resume Builder</h2>
          <p className="text-gray-700 text-lg font-medium mb-6">{message}</p>
          <div className="flex justify-center space-x-2 mb-4">
            <div className="w-3 h-3 bg-purple-600 rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-3 h-3 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
          <p className="text-sm text-gray-500">Please wait while we generate your AI suggestions...</p>
        </div>
      </div>
    </div>
  );
};

export default ResumeForm;
