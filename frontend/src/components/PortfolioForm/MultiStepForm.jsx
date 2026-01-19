import React, { useState } from "react";
import Step1Home from "./Step1Home";
import toast from 'react-hot-toast';
import Step2About from "./Step2About";
import Step3Resume from "./Step3Resume";
import Step4Projects from "./Step4Projects";
import Step5Contact from "./Step5Contact";
import { upsertPortfolio } from "../../services/portfolioServices";
import './MultiStepForm.scss'

const MultiStepForm = () => {
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    home: { fullName: "", tagline: "", profileImage: "" },
    about: { bio: "", skills: [] },
    resume: { education: [], experience: [] },
    projects: [{ title: "", description: "", link: "", techStack: [] }],
    contact: { email: "", phone: "", linkedin: "", github: "", twitter: "", website: "" },
  });

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const handleChange = (section, field, value) => {
    if (field === null) {
      // Direct assignment for the section (e.g. replacing an array)
      setFormData({ ...formData, [section]: value });
    } else {
      setFormData({
        ...formData,
        [section]: { ...formData[section], [field]: value },
      });
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await upsertPortfolio(formData);
      toast.success(response.message || "Portfolio saved successfully!");
      console.log("Saved Portfolio:", response);
    } catch (error) {
      console.error("Error saving portfolio:", error);
      toast.error("Failed to save portfolio");
    }
  };


  return (
    <div className="multi-step-form">
      {/* Progress Bar */}
      <div className="progress-bar">
        <div className="progress" style={{ width: `${(step / 5) * 100}%` }} />
      </div>

      {/* Step container */}
      <div className="step-container">
        {step === 1 && <Step1Home data={formData.home} handleChange={handleChange} nextStep={nextStep} />}
        {step === 2 && <Step2About data={formData.about} handleChange={handleChange} nextStep={nextStep} prevStep={prevStep} />}
        {step === 3 && <Step3Resume data={formData.resume} handleChange={handleChange} nextStep={nextStep} prevStep={prevStep} />}
        {step === 4 && <Step4Projects data={formData.projects} handleChange={handleChange} nextStep={nextStep} prevStep={prevStep} />}
        {step === 5 && <Step5Contact data={formData.contact} handleChange={handleChange} prevStep={prevStep} handleSubmit={handleSubmit} />}
      </div>

      {/* Navigation Buttons */}
      <div className="btn-group">
        {step > 1 && <button className="btn" onClick={prevStep}>Back</button>}
        {step < 5 && <button className="btn" onClick={nextStep}>Next</button>}
        {step === 5 && <button className="btn" onClick={handleSubmit}>Submit</button>}
      </div>
    </div>
  );
};

export default MultiStepForm;
