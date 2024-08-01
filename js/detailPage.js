import { getMovieDetail } from './API.js';
import formatMovie  from './formatMovie.js';

const urlParams = new URLSearchParams(window.location.search); // URL query parameter 가져오기
const movieId = urlParams.get('id'); // 매개변수 id 값 가져오기

const movieDetailData = [];

// 영화 디테일 정보 가져오기
const fetchMovieDetail = async () => {
  try{
    const response = await getMovieDetail('detail', movieId);
    
    if(response){
      movieDetailData.push(formattedDetailData(response))
    }else{
      throw new Error();
    }

    return movieDetailData;
  } catch (err){
    console.error(err)
  }
}

// 영화 디테일 데이터 포멧
const formattedDetailData = (details) =>{
  const basicData = formatMovie(details)
  
  const formatData = {
    ...basicData,
    runtime: details.runtime,
    backdropUrl: details.backdrop_path,
    genres: formatGenres(details.genres),
  }
  
  return formatData;
}

const formatGenres = (genres) => {
  return genres.map(genre => genre.name)
}

// 영화 디테일 그리기
const skeletons = document.querySelector('.skeletons.movieDetails');
const movieDetails = document.querySelector('.movieDetails:not(.skeletons)');

const createMovieDetailCard = async () => {
  // 데이터가 로드되기 전 스켈레톤 UI 보여줌
  skeletons.style.display = 'flex';
  movieDetails.style.display = 'none';

  const movieDetail = await fetchMovieDetail();

  if (!movieDetail || movieDetail.length === 0) {
    console.log('들어온 데이터가 없습니다.');
    return;
  }

  // 데이터가 로드되면 스켈레톤 UI 숨김
  skeletons.style.display = 'none';
  movieDetails.style.display = 'flex';

  const {id, koTitle, enTitle, genres, imgUrl, backdropUrl, overview, date, rating, runtime } = movieDetail[0];

  // 태그 가져오기
  const genreList = document.querySelector('.genre');
  const posterDiv = document.querySelector('.movieDetails:not(.skeletons) .poster');
  const koTitleDiv = document.querySelector('.koTitle');
  const enTitleDiv = document.querySelector('.enTitle');
  const yearDiv = document.querySelector('.year');
  const runtimeDiv = document.querySelector('.runtime');
  const gradeDiv = document.querySelector('.grade');
  const totalDiv = document.querySelector('.total');
  const overviewDiv = document.querySelector('.overview:not(.skeleton)');
  
  // 영화 디테일 데이터 추가
  koTitleDiv.textContent = koTitle;
  enTitleDiv.textContent = enTitle;
  yearDiv.textContent = date;
  runtimeDiv.textContent = `${ runtime }분`;
  gradeDiv.textContent = rating;
  overviewDiv.textContent = overview;
  totalDiv.textContent = ' / 10';

  // 배경 이미지 설정
  const mainDiv = document.querySelector('.main')
  mainDiv.style.backgroundImage = `url(https://image.tmdb.org/t/p/original${ backdropUrl })`;

  // 영화 포스터 추가
  const img = document.createElement('img');
  img.src = `https://image.tmdb.org/t/p/w300${ imgUrl }`;
  img.alt = koTitle
  posterDiv.appendChild(img)

  // rating 이미지 추가
  const starImg = document.querySelector('.star');
  starImg.src = 'https://i.ibb.co/yFS3gHB/star.png';
  starImg.alt = '별';

  // 장르 리스트 업데이트
  genreList.innerHTML = genres.map(genre => `
    <div class="genreContainer">
      <span class="genreValue">${genre}</span>
    </div>
  `).join('');
}

createMovieDetailCard();