import React from "react";
import './Step2About.scss';

const Step2About = ({ data, handleChange }) => {
  return (
    <div className="step2-about">
      <h2>Step 2: About</h2>
<textarea
  rows="4"
  placeholder="Write a short bio"
  value={data.bio}
  onChange={(e) => handleChange("about", "bio", e.target.value)}
/>
<input
  type="text"
  placeholder="Skills (comma separated)"
  value={data.skills.join(", ")}   // convert array → string
  onChange={(e) =>
    handleChange("about", "skills", e.target.value.split(",").map(s => s.trim()))
  }
/>

      {/* <div className="btn-group">
        <button className="btn" onClick={prevStep}>Back</button>
        <button className="btn" onClick={nextStep}>Next</button>
      </div> */}
    </div>
  );
};

export default Step2About;
