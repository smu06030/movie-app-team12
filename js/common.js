import { getTopLated, getMoviesByCategory } from './API.js';
import { formattedMovieData }  from './formatMovie.js';

let movieLists = [];

// 영화 데이터 가져오기
const fetchMovieData = async () => {
  try{
    const { results: movies } = await getTopLated('top_rated');
    
    movieLists.push(...formattedMovieData(movies))
    
    return movieLists;
  } catch (err){
    console.log(err);
  }  
}

// 영화 카드 그리기
const createMovieCards = async (filteredMovies = null) => {
  const movieLists = filteredMovies || await fetchMovieData();

  const ul = document.querySelector('.movieCards');
  ul.innerHTML = '';
  
  movieLists.map(movie => {
    const { id, koTitle, enTitle, imgUrl, overview, rating, date }= movie
    
    const li = document.createElement('li');
    li.setAttribute('class', 'movie');
    li.innerHTML = `
      <a href="./detail.html?id=${id}">
        <div class="movieWrapper">
          <span class="moviePoster">
            <img src="https://image.tmdb.org/t/p/w500${imgUrl}" alt="${koTitle}">
          </span>
          <div class="movieKoTitle">${koTitle}</div>
          <div class="movieEnTitle">(${enTitle})</div>
          <div class="movieOverview">${overview}</div>
          <div class="movieInfo">
            <h4 class="movieYear">${date}</h4>
            <div class="movieRating">
              <img src="./images/star.png" alt="별">
              <p>
                <span class="movieGrade">${rating}</span>
                <span class="movieTotal"> / 10</span>
              </p>
            </div>
          </div>
        </div>
      </a>
    `;
    ul.appendChild(li);
    
  })
}

// 버튼 클릭 or 엔터 입력 시 영화 검색
const form = document.getElementById('searchForm');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const input = document.getElementById('search').value.trim()
  
  input.length 
    ? createMovieCards(filterNames(input)) 
    : createMovieCards(movieLists)
})

// 이름 필터
const filterNames = (input) => {
  const value = input.toLowerCase();
  return value  
      ? movieLists.filter(movie => {
          const check = movie.koTitle.includes(value) || movie.enTitle.includes(value);
          return check
        }) 
      : []
}

// 카테고리 클릭 이벤트
document.getElementById('popularMovies').addEventListener('click', async (e) => {
  e.preventDefault();
  localStorage.setItem('selectedCategory', 'popular');
  const movies = await getMoviesByCategory('popular');
  movieLists = formattedMovieData(movies);
  createMovieCards(movieLists);
});

document.getElementById('nowPlayingMovies').addEventListener('click', async (e) => {
  e.preventDefault();
  localStorage.setItem('selectedCategory', 'now_playing');
  const movies = await getMoviesByCategory('now_playing');
  movieLists = formattedMovieData(movies);
  createMovieCards(movieLists);
});

document.getElementById('upcomingMovies').addEventListener('click', async (e) => {
  e.preventDefault();
  localStorage.setItem('selectedCategory', 'upcoming');
  const movies = await getMoviesByCategory('upcoming');
  movieLists = formattedMovieData(movies);
  createMovieCards(movieLists);
});

// 로컬스토리지에 카테고리가 저장되어 있으면 저장된 카테고리 보여주고 없으면 메인 보여주기
const initializeMovies = async () => {
  const selectedCategory = localStorage.getItem('selectedCategory');

  if (selectedCategory) {
    const movies = await getMoviesByCategory(selectedCategory);
    movieLists = formattedMovieData(movies);
    createMovieCards(movieLists);
  } else {
    const movies = await fetchMovieData();
    createMovieCards(movies);
  }
}

initializeMovies();


// 로고 클릭하면 로컬스토리지 비우기
document.querySelector('.logo a').addEventListener('click', (e) => {
  localStorage.removeItem('selectedCategory');
});