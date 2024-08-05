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

const generateUrls = (type, { movieId = null, page = 1 } = {}) => {
  switch (type) {
    case 'top_rated':
      return `${baseUrl}/movie/top_rated?language=${baseLanguage}&page=${page}`;
    case 'popular':
      return `${baseUrl}/movie/popular?language=${baseLanguage}&page=${page}`;
    case 'now_playing':
      return `${baseUrl}/movie/now_playing?language=${baseLanguage}&page=${page}`;
    case 'upcoming':
      return `${baseUrl}/movie/upcoming?language=${baseLanguage}&page=${page}`;
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

const getMoviesByCategory = async (category) => {
  const url = generateUrls(category);
  try {
    const response = await fetch(url, options);
    const json = await response.json();
    return json.results;
  } catch (err) {
    console.error(category + ' 영화 정보를 가져오는데 실패했습니다.' + err);
  }
}

export { getTopLated, getMovieDetail, getMoviesByCategory }