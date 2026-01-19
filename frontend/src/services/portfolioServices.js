import api from "./api";

// Get logged-in user's portfolio
export const getMyPortfolio = async () => {
  const res = await api.get("/portfolio/me");
  return res.data;
};

// Get portfolio by userId (public)
export const getPortfolio = async (userId) => {
  const res = await api.get(`/portfolio/${userId}`);
  return res.data;
};

// Create or update portfolio
export const upsertPortfolio = async (portfolioData) => {
  const res = await api.post("/portfolio", portfolioData);
  return res.data;
};

// Delete portfolio
export const deletePortfolio = async () => {
  const res = await api.delete("/portfolio");
  return res.data;
};
