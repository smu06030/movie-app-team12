import { getTopLated, getMoviesByCategory } from "./API.js";
import { formattedMovieData } from "./formatMovie.js";

let movieLists = [];
let filteredMovies = [];

// 영화 데이터 가져오기
const fetchMovieData = async () => {
  try {
    const { results: movies } = await getTopLated('top_rated');

    // movieLists.push(...formattedMovieData(movies))
    movieLists = formattedMovieData(movies);
    filteredMovies = [...movieLists];

    return movieLists;
  } catch (err) {
    console.log(err);
  }
}

// 영화 카드 그리기
const createMovieCards = async (filteredMovies = null) => {
  const movieLists = filteredMovies || (await fetchMovieData());

  const ul = document.querySelector('.movieCards');
  ul.innerHTML = '';

  movieLists.map(movie => {
    const { id, koTitle, enTitle, imgUrl, overview, rating, date } = movie

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
  });
};

// 버튼 클릭 or 엔터 입력 시 영화 검색
const form = document.getElementById("searchForm");

form.addEventListener("submit", (e) => {
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
document.querySelectorAll('.movieCategory a').forEach(link => {
  link.addEventListener('click', async (e) => {
    e.preventDefault();

    // 모든 카테고리 링크에서 active 클래스 제거
    document.querySelectorAll('.movieCategory a').forEach(item => {
      item.classList.remove('active');
    });

    // 클릭된 링크에 active 클래스 추가
    e.target.classList.add('active');

    // 카테고리별 영화 데이터 가져오고 로컬스토리지에 카테고리 저장
    const category = e.target.id;
    localStorage.setItem('selectedCategory', category);
    const movies = await getMoviesByCategory(category);
    movieLists = formattedMovieData(movies);
    createMovieCards(movieLists);
  });
});

// 로컬스토리지에 카테고리가 저장되어 있으면 저장된 카테고리 보여주고 없으면 메인 보여주기
const initializeMovies = async () => {
  const selectedCategory = localStorage.getItem('selectedCategory');

  if (selectedCategory) {
    document.getElementById(selectedCategory).classList.add('active');
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
document.querySelector('.logo div').addEventListener('click', (e) => {
  localStorage.removeItem('selectedCategory');
  window.location.href = "/";
});

document.addEventListener('DOMContentLoaded', async () => {
  await fetchMovieData();
  createMovieCards();

  const selectElement = document.getElementById('selectFilterMovie');

  selectElement.addEventListener('change', (event) => {
    const filterValue = event.target.value;


    // 별점순
    if (filterValue === 'star') {
      filteredMovies = movieLists.slice().sort(function (a, b) {
        return b.rating - a.rating;
      });
      // 이름순(ko) 정렬
    } else if (filterValue === 'ko') {
      filteredMovies = movieLists.slice().sort(function (a, b) {
        return a.koTitle.localeCompare(b.koTitle);
      });
      // 이름순(en) 정렬
    } else if (filterValue === 'en') {
      filteredMovies = movieLists.slice().sort(function (a, b) {
        return a.enTitle.localeCompare(b.enTitle);
      });
      // 개봉일순 정렬
    } else if (filterValue === 'releaseDate') {
      filteredMovies = movieLists.slice().sort(function (a, b) {
        return new Date(b.date) - new Date(a.date);
      });
    }

    createMovieCards(filteredMovies);
  });
});