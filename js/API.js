import { API_KEY } from './config.js';

const baseUrl = 'https://api.themoviedb.org/3';
const baseLanguage = 'ko-KR';
const url = `${baseUrl}/movie/top_rated?language=${baseLanguage}&page=${1}`;

const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${ API_KEY }`
  }
};

const getTopLated = async () => {
  try{
    const response = await fetch(url, options);
    const json = await response.json();

    return json;
  } catch (err) {
    console.error(err)
  }
}

export { getTopLated }