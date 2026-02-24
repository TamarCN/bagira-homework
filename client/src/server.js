import axios from './axios';

export const fetchUnitChildren = async(parentId) => {
  const res = await axios.get(`/forces/${parentId || "null"}`);
  return res.data;
};

export const searchForces = async (term) => {
  const res = await axios.get(`/forces/search/${encodeURIComponent(term)}`);
  return res.data;
};