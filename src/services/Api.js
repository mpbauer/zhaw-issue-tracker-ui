import axios from 'axios';

export default() => {
  return axios.create({
    baseURL: `https://309bxpg45b.execute-api.eu-west-1.amazonaws.com/latest/api`,
    withCredentials: false,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  });
};
