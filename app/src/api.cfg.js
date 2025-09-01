// Конфиг для API
const API_CFG = {
  BASE: process.env.REACT_APP_API_BASE || 'http://localhost:5230/api/list',
  TRACKS: '/tracks',
  ADD_TRACK: '/addtrack',
  RECENZII: '/recenzii',
  ADD_RECENZIA: '/addRecenzia'
};

export default API_CFG;
