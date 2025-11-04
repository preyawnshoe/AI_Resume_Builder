import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { PlusIcon, TrashIcon, MinusIcon, ReplyIcon, RefreshIcon } from "@heroicons/react/outline";
import Header from "../components/Head";

const AISuggestions = () => {
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

  const [originalData, setOriginalData] = useState({});
  const [fieldSuggestions, setFieldSuggestions] = useState({});
  const [profileImage, setProfileImage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState("Loading your resume data...");
  const [showInstructionPopup, setShowInstructionPopup] = useState(false);
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

  // Field history for undo/redo
  const [fieldHistory, setFieldHistory] = useState({});
  const [fieldRedoStack, setFieldRedoStack] = useState({});

  const router = useRouter();

  // Toggle section visibility
  const toggleSection = (section) => {
    setActiveSection(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Initialize field history
  const initializeFieldHistory = (data) => {
    const history = {};
    const flattenObject = (obj, prefix = '') => {
      Object.keys(obj).forEach(key => {
        const fullKey = prefix ? `${prefix}.${key}` : key;
        if (Array.isArray(obj[key])) {
          obj[key].forEach((item, index) => {
            if (typeof item === 'object') {
              flattenObject(item, `${fullKey}[${index}]`);
            } else {
              history[fullKey] = [item];
            }
          });
        } else if (typeof obj[key] === 'object' && obj[key] !== null) {
          flattenObject(obj[key], fullKey);
        } else {
          history[fullKey] = [obj[key]];
        }
      });
    };
    flattenObject(data);
    setFieldHistory(history);
    setFieldRedoStack({});
  };

  // Track field changes for undo/redo
  const trackFieldChange = (fieldPath, oldValue, newValue) => {
    setFieldHistory(prev => ({
      ...prev,
      [fieldPath]: [...(prev[fieldPath] || []), oldValue]
    }));
    setFieldRedoStack(prev => ({
      ...prev,
      [fieldPath]: []
    }));
  };

  // Undo field change
  const undoField = (fieldPath) => {
    setFieldHistory(prev => {
      const history = prev[fieldPath] || [];
      if (history.length === 0) return prev;

      const lastValue = history[history.length - 1];
      const newHistory = history.slice(0, -1);

      // Update form data
      updateNestedField(formData, fieldPath, lastValue);

      // Add current value to redo stack
      const currentValue = getNestedField(formData, fieldPath);
      setFieldRedoStack(prev => ({
        ...prev,
        [fieldPath]: [...(prev[fieldPath] || []), currentValue]
      }));

      return {
        ...prev,
        [fieldPath]: newHistory
      };
    });
  };

  // Redo field change
  const redoField = (fieldPath) => {
    setFieldRedoStack(prev => {
      const redoStack = prev[fieldPath] || [];
      if (redoStack.length === 0) return prev;

      const nextValue = redoStack[redoStack.length - 1];
      const newRedoStack = redoStack.slice(0, -1);

      // Update form data
      updateNestedField(formData, fieldPath, nextValue);

      // Add to history
      const currentValue = getNestedField(formData, fieldPath);
      setFieldHistory(prevHistory => ({
        ...prevHistory,
        [fieldPath]: [...(prevHistory[fieldPath] || []), currentValue]
      }));

      return {
        ...prev,
        [fieldPath]: newRedoStack
      };
    });
  };

  // Helper functions for nested field access
  const getNestedField = (obj, path) => {
    return path.split('.').reduce((current, key) => {
      const arrayMatch = key.match(/(.+)\[(\d+)\]/);
      if (arrayMatch) {
        return current[arrayMatch[1]][parseInt(arrayMatch[2])];
      }
      return current[key];
    }, obj);
  };

  const updateNestedField = (obj, path, value) => {
    const keys = path.split('.');
    const lastKey = keys.pop();
    const target = keys.reduce((current, key) => {
      const arrayMatch = key.match(/(.+)\[(\d+)\]/);
      if (arrayMatch) {
        return current[arrayMatch[1]][parseInt(arrayMatch[2])];
      }
      return current[key];
    }, obj);

    const arrayMatch = lastKey.match(/(.+)\[(\d+)\]/);
    if (arrayMatch) {
      target[arrayMatch[1]][parseInt(arrayMatch[2])] = value;
    } else {
      target[lastKey] = value;
    }
  };

  const handleChange = (e, fieldPath) => {
    const { name, value } = e.target;
    const fullPath = fieldPath || name;

    // Track change for undo
    const oldValue = getNestedField(formData, fullPath);
    if (oldValue !== value) {
      trackFieldChange(fullPath, oldValue, value);
    }

    if (fieldPath) {
      const newData = { ...formData };
      updateNestedField(newData, fieldPath, value);
      setFormData(newData);
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleDynamicChange = (section, index, e) => {
    const { name, value } = e.target;
    const fieldPath = `${section}[${index}].${name}`;

    // Track change for undo
    const oldValue = getNestedField(formData, fieldPath);
    if (oldValue !== value) {
      trackFieldChange(fieldPath, oldValue, value);
    }

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

  const applySuggestion = (fieldPath, suggestionIndex) => {
    const suggestions = getFieldSuggestions(fieldPath);
    if (suggestions && suggestions[suggestionIndex]) {
      const oldValue = getNestedField(formData, fieldPath);
      const newValue = suggestions[suggestionIndex];
      
      // Track change for undo
      trackFieldChange(fieldPath, oldValue, newValue);
      
      // Update form data
      const newData = { ...formData };
      updateNestedField(newData, fieldPath, newValue);
      setFormData(newData);
    }
  };

  const getFieldSuggestions = (fieldPath) => {
    // Handle simple fields
    if (fieldSuggestions[fieldPath]) {
      return fieldSuggestions[fieldPath];
    }
    
    // Handle array fields like experiences[0].details
    const arrayMatch = fieldPath.match(/^(\w+)\[(\d+)\]\.(\w+)$/);
    if (arrayMatch) {
      const [_, arrayName, index, field] = arrayMatch;
      const arraySuggestions = fieldSuggestions[arrayName];
      if (arraySuggestions) {
        const itemSuggestion = arraySuggestions.find(item => item.index === parseInt(index));
        return itemSuggestion ? itemSuggestion[field] : null;
      }
    }
    
    return null;
  };

  const getFieldSuggestionsForDynamic = (fieldSuggestions, arrayName, index, field) => {
    if (!fieldSuggestions[arrayName]) return [];
    const itemSuggestion = fieldSuggestions[arrayName].find(item => item.index === index);
    return itemSuggestion ? itemSuggestion[field] || [] : [];
  };

  const handleUndo = () => {
    setFormData(originalData);
    initializeFieldHistory(originalData);
  };

  const handleProceed = () => {
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

    localStorage.setItem("formData", JSON.stringify(formData));
    router.push("/view-resume");
  };

  const regenerateAISuggestions = async () => {
    setIsLoading(true);
    setLoadingMessage("Regenerating AI suggestions...");
    const startTime = Date.now();

    try {
      const response = await fetch('/api/generate-resume-ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ formData }),
      });

      if (response.ok) {
        const newFieldSuggestions = await response.json();
        setFieldSuggestions(newFieldSuggestions);
        localStorage.setItem("fieldSuggestions", JSON.stringify(newFieldSuggestions));
        setLoadingMessage("AI suggestions updated successfully!");

        // Ensure minimum loading time of 2 seconds for better UX
        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(2000 - elapsedTime, 0);
        setTimeout(() => {
          setIsLoading(false);
        }, remainingTime);
      } else {
        const errorData = await response.json();
        setLoadingMessage(`Error: ${errorData.error || "Failed to regenerate suggestions"}`);

        // Show error for 3 seconds
        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(3000 - elapsedTime, 0);
        setTimeout(() => {
          setIsLoading(false);
        }, remainingTime);
      }
    } catch (error) {
      console.error("Error regenerating suggestions:", error);
      setLoadingMessage("Error regenerating suggestions. Please try again.");

      // Show error for 3 seconds
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(3000 - elapsedTime, 0);
      setTimeout(() => {
        setIsLoading(false);
      }, remainingTime);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoadingMessage("Loading your resume data...");
        const savedFieldSuggestions = JSON.parse(localStorage.getItem("fieldSuggestions") || "{}");
        const originalData = JSON.parse(localStorage.getItem("originalData") || "{}");
        const savedImage = localStorage.getItem("profileImage");

        setFieldSuggestions(savedFieldSuggestions);
        setOriginalData(originalData);

        if (Object.keys(originalData).length > 0) {
          setFormData(originalData);
          initializeFieldHistory(originalData);
        }

        if (savedImage) {
          setProfileImage(savedImage);
        }

        const savedSectionState = JSON.parse(localStorage.getItem("activeSections"));
        if (savedSectionState) {
          setActiveSection(savedSectionState);
        }

        // Simulate loading time for better UX - longer if no data exists
        const hasData = Object.keys(originalData).length > 0;
        const loadingTime = hasData ? 1000 : 4000; // 1 second if data exists, 4 seconds if no data
        setTimeout(() => {
          setIsLoading(false);
        }, loadingTime);
      } catch (error) {
        console.error("Error loading data:", error);
        setLoadingMessage("Error loading data. Please refresh the page.");
        setTimeout(() => {
          setIsLoading(false);
        }, 2000);
      }
    };

    loadData();
  }, []);

  // Show instruction popup after loading is complete
  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => {
        setShowInstructionPopup(true);
      }, 500); // Small delay to ensure smooth transition
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  return (
    <>
      <Header />
      {isLoading ? (
        <LoadingScreen message={loadingMessage} />
      ) : (
        <>
          {showInstructionPopup && (
            <InstructionPopup onClose={() => setShowInstructionPopup(false)} />
          )}
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

          <div className="w-4/5 p-8 space-y-6 overflow-y-auto h-screen">
            <h1 className="text-3xl font-semibold text-purple-600 text-center mb-6">
              AI Suggestions - Edit Your Resume
            </h1>

            <p className="text-center text-gray-600 mb-6">
              Review and edit your resume. Click the suggestion buttons next to fields to see AI-generated alternatives.
            </p>

            <form className="space-y-6">
              {activeSection.basic && (
                <div className="shadow-lg rounded-lg p-6 bg-white transition-all duration-300 hover:shadow-xl">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {["name", "email", "phone", "jobTitle"].map(
                      (field) => (
                        <FieldWithUndoRedo
                          key={field}
                          label={field.charAt(0).toUpperCase() + field.slice(1) + " *"}
                          name={field}
                          value={formData[field]}
                          onChange={handleChange}
                          fieldPath={field}
                          type={field === "email" ? "email" : "text"}
                          placeholder={`Enter your ${field}`}
                          required
                          canUndo={(fieldHistory[field] || []).length > 0}
                          canRedo={(fieldRedoStack[field] || []).length > 0}
                          onUndo={() => undoField(field)}
                          onRedo={() => redoField(field)}
                          suggestions={getFieldSuggestions(field) || []}
                          onApplySuggestion={(index) => applySuggestion(field, index)}
                          showUndoRedo={false}
                          originalValue={originalData ? originalData[field] : ""}
                        />
                      )
                    )}
                    <FieldWithUndoRedo
                      label="Linkedin"
                      name="linkedin"
                      value={formData.linkedin}
                      onChange={handleChange}
                      fieldPath="linkedin"
                      type="text"
                      placeholder="Enter your linkedin profile"
                      canUndo={(fieldHistory.linkedin || []).length > 0}
                      canRedo={(fieldRedoStack.linkedin || []).length > 0}
                      onUndo={() => undoField("linkedin")}
                      onRedo={() => redoField("linkedin")}
                      suggestions={getFieldSuggestions("linkedin") || []}
                      onApplySuggestion={(index) => applySuggestion("linkedin", index)}
                      showUndoRedo={false}
                      originalValue={originalData ? originalData.linkedin : ""}
                    />
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
                      fieldHistory={fieldHistory}
                      fieldRedoStack={fieldRedoStack}
                      undoField={undoField}
                      redoField={redoField}
                      fieldSuggestions={fieldSuggestions}
                      applySuggestion={applySuggestion}
                      originalData={originalData}
                      getFieldSuggestionsForDynamic={getFieldSuggestionsForDynamic}
                    />
                  )
              )}

              {activeSection.summary && (
                <TextAreaSection
                  label="Summary *"
                  name="summary"
                  value={formData.summary}
                  onChange={handleChange}
                  charLimit={600}
                  required={true}
                  fieldHistory={fieldHistory}
                  fieldRedoStack={fieldRedoStack}
                  undoField={undoField}
                  redoField={redoField}
                  fieldSuggestions={fieldSuggestions}
                  applySuggestion={applySuggestion}
                  originalData={originalData}
                />
              )}

              {activeSection.technicalSkills && (
                <TextAreaSection
                  label="Technical Skills"
                  name="technicalSkills"
                  value={formData.technicalSkills}
                  onChange={handleChange}
                  charLimit={500}
                  fieldHistory={fieldHistory}
                  fieldRedoStack={fieldRedoStack}
                  undoField={undoField}
                  redoField={redoField}
                  fieldSuggestions={fieldSuggestions}
                  applySuggestion={applySuggestion}
                  originalData={originalData}
                />
              )}

              {activeSection.softSkills && (
                <TextAreaSection
                  label="Soft Skills"
                  name="softSkills"
                  value={formData.softSkills}
                  onChange={handleChange}
                  charLimit={500}
                  fieldHistory={fieldHistory}
                  fieldRedoStack={fieldRedoStack}
                  undoField={undoField}
                  redoField={redoField}
                  fieldSuggestions={fieldSuggestions}
                  applySuggestion={applySuggestion}
                  originalData={originalData}
                />
              )}

              {activeSection.hobbies && (
                <TextAreaSection
                  label="Hobbies"
                  name="hobbies"
                  value={formData.hobbies}
                  onChange={handleChange}
                  charLimit={500}
                  fieldHistory={fieldHistory}
                  fieldRedoStack={fieldRedoStack}
                  undoField={undoField}
                  redoField={redoField}
                  fieldSuggestions={fieldSuggestions}
                  applySuggestion={applySuggestion}
                  originalData={originalData}
                />
              )}

              {activeSection.achievements && (
                <TextAreaSection
                  label="Achievements"
                  name="achievements"
                  value={formData.achievements}
                  onChange={handleChange}
                  charLimit={500}
                  fieldHistory={fieldHistory}
                  fieldRedoStack={fieldRedoStack}
                  undoField={undoField}
                  redoField={redoField}
                  fieldSuggestions={fieldSuggestions}
                  applySuggestion={applySuggestion}
                  originalData={originalData}
                />
              )}

              {activeSection.certifications && (
                <TextAreaSection
                  label="Certifications"
                  name="certifications"
                  value={formData.certifications}
                  onChange={handleChange}
                  charLimit={500}
                  fieldHistory={fieldHistory}
                  fieldRedoStack={fieldRedoStack}
                  undoField={undoField}
                  redoField={redoField}
                  fieldSuggestions={fieldSuggestions}
                  applySuggestion={applySuggestion}
                  originalData={originalData}
                />
              )}

              {activeSection.portfolio && (
                <div className="shadow-lg rounded-lg p-6 bg-white transition-all duration-300 hover:shadow-xl">
                  <FieldWithUndoRedo
                    label="Portfolio"
                    name="portfolio"
                    value={formData.portfolio}
                    onChange={handleChange}
                    fieldPath="portfolio"
                    type="url"
                    placeholder="Enter your portfolio link"
                    canUndo={(fieldHistory.portfolio || []).length > 0}
                    canRedo={(fieldRedoStack.portfolio || []).length > 0}
                    onUndo={() => undoField("portfolio")}
                    onRedo={() => redoField("portfolio")}
                    suggestions={fieldSuggestions.portfolio || []}
                    onApplySuggestion={(index) => applySuggestion("portfolio", index)}
                    showUndoRedo={false}
                    originalValue={originalData ? originalData.portfolio : ""}
                  />
                </div>
              )}

              <div className="text-center flex justify-center space-x-4">
                <button
                  type="button"
                  onClick={regenerateAISuggestions}
                  disabled={isLoading}
                  className={`px-6 py-3 font-medium text-lg rounded-md transition duration-300 ease-in-out ${
                    isLoading
                      ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                  }`}
                >
                  {isLoading ? 'Regenerating...' : 'Regenerate AI Suggestions'}
                </button>
                <button
                  type="button"
                  onClick={handleUndo}
                  disabled={isLoading}
                  className={`px-6 py-3 font-medium text-lg rounded-md transition duration-300 ease-in-out ${
                    isLoading
                      ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                      : 'bg-yellow-500 text-white hover:bg-yellow-600'
                  }`}
                >
                  Undo to Original
                </button>
                <button
                  type="button"
                  onClick={handleProceed}
                  disabled={isLoading}
                  className={`px-6 py-3 font-medium text-lg rounded-md transition duration-300 ease-in-out ${
                    isLoading
                      ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                      : 'bg-green-500 text-white hover:bg-green-600'
                  }`}
                >
                  Save Resume
                </button>
              </div>
            </form>
          </div>
        </div>
        </>
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
  fieldHistory,
  fieldRedoStack,
  undoField,
  redoField,
  fieldSuggestions,
  applySuggestion,
  originalData,
  getFieldSuggestionsForDynamic,
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
          {fields.map((field) => {
            const fieldPath = `${title.toLowerCase()}[${index}].${field}`;
            const suggestions = fieldSuggestions ? getFieldSuggestionsForDynamic(fieldSuggestions, title.toLowerCase(), index, field) : [];
            const originalValue = originalData && originalData[title.toLowerCase()] && originalData[title.toLowerCase()][index] 
              ? originalData[title.toLowerCase()][index][field] 
              : "";
            return (
              <FieldWithUndoRedo
                key={field}
                label={field.charAt(0).toUpperCase() + field.slice(1) + (requiredFields.includes(field) ? " *" : "")}
                name={field}
                value={item[field]}
                onChange={(e) => handleChange(e, index)}
                fieldPath={fieldPath}
                type="textarea"
                placeholder={`Enter ${field}`}
                required={requiredFields.includes(field)}
                canUndo={(fieldHistory[fieldPath] || []).length > 0}
                canRedo={(fieldRedoStack[fieldPath] || []).length > 0}
                onUndo={() => undoField(fieldPath)}
                onRedo={() => redoField(fieldPath)}
                suggestions={suggestions}
                onApplySuggestion={(suggestionIndex) => applySuggestion(fieldPath, suggestionIndex)}
                originalValue={originalValue}
              />
            );
          })}
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

const TextAreaSection = ({
  label,
  name,
  value,
  onChange,
  charLimit,
  required,
  fieldHistory,
  fieldRedoStack,
  undoField,
  redoField,
  fieldSuggestions,
  applySuggestion,
  originalData,
}) => (
  <div className="shadow-lg rounded-lg p-6 bg-white transition-all duration-300 hover:shadow-xl">
    <FieldWithUndoRedo
      label={label}
      name={name}
      value={value}
      onChange={onChange}
      fieldPath={name}
      type="textarea"
      placeholder={`Enter your ${label.toLowerCase().replace(' *', '')}`}
      charLimit={charLimit}
      required={required}
      canUndo={(fieldHistory[name] || []).length > 0}
      canRedo={(fieldRedoStack[name] || []).length > 0}
      onUndo={() => undoField(name)}
      onRedo={() => redoField(name)}
      suggestions={fieldSuggestions ? fieldSuggestions[name] || [] : []}
      onApplySuggestion={(index) => applySuggestion(name, index)}
      originalValue={originalData ? originalData[name] : ""}
    />
  </div>
);

const FieldWithUndoRedo = ({ 
  label, 
  name, 
  value, 
  onChange, 
  fieldPath, 
  type = "text", 
  placeholder, 
  required,
  rows = 4,
  charLimit,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  suggestions = [],
  onApplySuggestion,
  showUndoRedo = true,
  originalValue
}) => {
  const [showOriginal, setShowOriginal] = React.useState(false);

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    if (!charLimit || newValue.length <= charLimit) {
      onChange(e, fieldPath);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <label className="block text-gray-700 font-medium">{label}</label>
        <div className="flex space-x-1 items-center">
          {suggestions.length > 0 && (
            <div className="flex items-center space-x-2 mr-2">
              <span className="text-xs text-purple-600 font-medium">AI Suggestions:</span>
              <div className="flex space-x-1">
                {suggestions.map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => onApplySuggestion(index)}
                    className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
                    title={`Apply suggestion ${index + 1}`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            </div>
          )}
          {showUndoRedo && (
            <>
              <button
                type="button"
                onClick={() => setShowOriginal(!showOriginal)}
                className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                title="Show original input"
              >
                👁
              </button>
              <button
                type="button"
                onClick={onUndo}
                disabled={!canUndo}
                className={`p-1 rounded ${
                  canUndo 
                    ? 'text-blue-600 hover:bg-blue-100' 
                    : 'text-gray-400 cursor-not-allowed'
                }`}
                title="Undo"
              >
                <ReplyIcon className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={onRedo}
                disabled={!canRedo}
                className={`p-1 rounded ${
                  canRedo 
                    ? 'text-green-600 hover:bg-green-100' 
                    : 'text-gray-400 cursor-not-allowed'
                }`}
                title="Redo"
              >
                <RefreshIcon className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>
      {type === "textarea" ? (
        <textarea
          name={name}
          value={value}
          onChange={handleInputChange}
          className="w-full p-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600 transition duration-300 ease-in-out text-black"
          rows={rows}
          placeholder={placeholder}
        />
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={handleInputChange}
          className="w-full p-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600 transition duration-300 ease-in-out text-black"
          placeholder={placeholder}
          required={required}
        />
      )}
      {charLimit && (
        <p className="text-sm text-gray-500 mt-1">
          {value.length}/{charLimit} characters
        </p>
      )}
      {showOriginal && originalValue && (
        <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-md">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-blue-800">Your Original Input:</span>
            <button
              type="button"
              onClick={() => setShowOriginal(false)}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              ✕
            </button>
          </div>
          <div className="text-sm text-blue-900 whitespace-pre-wrap">
            {originalValue || "No original input"}
          </div>
        </div>
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
          <h2 className="text-2xl font-bold text-purple-600 mb-4">AI Resume Assistant</h2>
          <p className="text-gray-700 text-lg font-medium mb-6">{message}</p>
          <div className="flex justify-center space-x-2 mb-4">
            <div className="w-3 h-3 bg-purple-600 rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-3 h-3 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
          <p className="text-sm text-gray-500">Please wait while we generate your suggestions...</p>
        </div>
      </div>
    </div>
  );
};

const InstructionPopup = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-gray-900 bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-lg p-8 shadow-2xl max-w-lg w-full mx-4 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl font-bold"
          aria-label="Close popup"
        >
          ✕
        </button>
        <div className="text-center">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-2xl">💡</span>
          </div>
          <h2 className="text-2xl font-bold text-purple-600 mb-4">Welcome to AI Suggestions!</h2>
          <p className="text-gray-700 text-lg mb-6">
            Click the suggestion buttons next to fields to see AI-generated alternatives.
          </p>
          <button
            onClick={onClose}
            className="bg-purple-600 text-white px-6 py-3 rounded-md hover:bg-purple-700 transition duration-300 ease-in-out font-medium"
          >
            Got it!
          </button>
        </div>
      </div>
    </div>
  );
};

export default AISuggestions;