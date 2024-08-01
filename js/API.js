import { API_KEY } from './config.js';

const baseUrl = 'https://api.themoviedb.org/3';
const baseLanguage = 'ko-KR';

const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${ API_KEY }`
  }
};

const generateUrls = (type, { movieId = null, page=1 } = {}) => {
  switch(type){
    case 'top_rated':
      return `${baseUrl}/movie/top_rated?language=${baseLanguage}&page=${page}`;
    case 'detail':
      return `${baseUrl}/movie/${movieId}?language=${baseLanguage}`;
  }
}

const getTopLated = async (type) => {
  const url = generateUrls(type)
  try{
    const response = await fetch(url, options);
    const json = await response.json();

    return json;
  } catch (err) {
    console.error(err)
  }
}

const getMovieDetail = async (type, movieId) => {
  const url = generateUrls(type, { movieId })
  try{
    const response = await fetch(url, options);
    
    if(response.status === 200){
      const json = await response.json();
      return json;
    }else{
      throw new Error();
    }
    
  } catch (err) {
    console.error(err)
  }
}

export { getTopLated, getMovieDetail }