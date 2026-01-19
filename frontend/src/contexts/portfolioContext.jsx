// src/contexts/PortfolioContext.jsx
import { createContext, useContext, useState } from "react";
import { getPortfolio, upsertPortfolio } from "../services/portfolioServices";

const PortfolioContext = createContext();
export const usePortfolio = () => useContext(PortfolioContext);

export const PortfolioProvider = ({ children }) => {
  const [portfolio, setPortfolio] = useState(null);

  // 🔹 Backend se fetch
  const loadPortfolio = async (userId) => {
    try {
      const data = await getPortfolio(userId);
      setPortfolio(data.portfolio); 
    } catch (err) {
      console.error("Error loading portfolio:", err);
    }
  };

  // 🔹 Save/Update
  const savePortfolio = async (portfolioData) => {
    try {
      const data = await upsertPortfolio(portfolioData);
      // backend save hone ke baad fresh data reload kar lo
      await loadPortfolio(portfolioData.userId);
    } catch (err) {
      console.error("Error saving portfolio:", err);
    }
  };

  return (
    <PortfolioContext.Provider value={{ portfolio, loadPortfolio, savePortfolio }}>
      {children}
    </PortfolioContext.Provider>
  );
};
