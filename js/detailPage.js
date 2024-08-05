import { getMovieDetail } from './API.js';
import { formattedDetailData }  from './formatMovie.js';

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
      throw new Error("영화 디테일 정보를 가져오는데 실패했습니다.");
    }

    return movieDetailData;
  } catch (err){
    console.error(err)
  }
}

// UI 요소 선택자
const selectors = {
  skeletons: document.querySelector('.skeletons.movieDetails'),
  movieDetails: document.querySelector('.movieDetails:not(.skeletons)'),
  genreList: document.querySelector('.genre'),
  posterDiv: document.querySelector('.movieDetails:not(.skeletons) .poster'),
  koTitleDiv: document.querySelector('.koTitle'),
  enTitleDiv: document.querySelector('.enTitle'),
  yearDiv: document.querySelector('.year'),
  runtimeDiv: document.querySelector('.runtime'),
  gradeDiv: document.querySelector('.grade'),
  totalDiv: document.querySelector('.total'),
  overviewDiv: document.querySelector('.overview:not(.skeleton)'),
  mainDiv: document.querySelector('.main'),
  starImg: document.querySelector('.star')
};

// 영화 디테일 그리기
const createMovieDetailCard = async () => {
  // 데이터가 로드되기 전 스켈레톤 UI 보여줌
  selectors.skeletons.style.display = 'flex';
  selectors.movieDetails.style.display = 'none';

  const movieDetail = await fetchMovieDetail();

  if (!movieDetail || movieDetail.length === 0) {
    console.log('들어온 데이터가 없습니다.');
    return;
  }

  // 데이터가 로드되면 스켈레톤 UI 숨김
  selectors.skeletons.style.display = 'none';
  selectors.movieDetails.style.display = 'flex';

  const {
    id, 
    koTitle, 
    enTitle, 
    genres, 
    imgUrl, 
    backdropUrl, 
    overview, 
    date, 
    rating, 
    runtime 
  } = movieDetail[0];


  // 영화 디테일 데이터 추가
  selectors.koTitleDiv.textContent = koTitle;
  selectors.enTitleDiv.textContent = enTitle;
  selectors.yearDiv.textContent = date;
  selectors.runtimeDiv.textContent = `${ runtime }분`;
  selectors.gradeDiv.textContent = rating;
  selectors.overviewDiv.textContent = overview;
  selectors.totalDiv.textContent = ' / 10';

  // 배경 이미지 설정
  selectors.mainDiv.style.backgroundImage = `url(https://image.tmdb.org/t/p/original${ backdropUrl })`;

  // 영화 포스터 추가
  const img = document.createElement('img');
  img.src = `https://image.tmdb.org/t/p/w300${ imgUrl }`;
  img.alt = koTitle
  selectors.posterDiv.appendChild(img)

  // rating 이미지 추가
  selectors.starImg.src = 'https://i.ibb.co/yFS3gHB/star.png';
  selectors.starImg.alt = '별';

  // 장르 리스트 업데이트
  selectors.genreList.innerHTML = genres.map(genre => `
    <div class="genreContainer">
      <span class="genreValue">${genre}</span>
    </div>
  `).join('');
}

// 상세에서 로고 누르면 메인으로 이동하고 로컬스토리지 비우기
document.querySelector(".logo div").addEventListener('click',() => {
  localStorage.removeItem('selectedCategory');
  window.location.href = "/";
})

createMovieDetailCard();
