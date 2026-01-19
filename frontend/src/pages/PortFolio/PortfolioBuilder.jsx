import MultiStepForm from "../../components/PortfolioForm/MultiStepForm";
import "./PortfolioBuilder.scss";

const PortfolioBuilder = () => {
  return (
    <div className="portfolio-builder">
      <h1>Create Your Portfolio</h1>
      <div className="form-wrapper">
        <MultiStepForm />
      </div>
    </div>
  );
};

export default PortfolioBuilder;
