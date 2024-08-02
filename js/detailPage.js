import { getMovieDetail, getCredits } from "./API.js";
import { formattedDetailData } from "./formatMovie.js";

const urlParams = new URLSearchParams(window.location.search); // URL query parameter 가져오기
const movieId = urlParams.get("id"); // 매개변수 id 값 가져오기

// 영화 디테일 정보 가져오기
const fetchMovieDetail = async () => {
  try {
    const response = await getMovieDetail("detail", movieId);
    const movieDetailData = [];

    if (response) {
      movieDetailData.push(formattedDetailData(response));
    } else {
      throw new Error("영화 디테일 정보를 가져오는데 실패했습니다.");
    }

    return movieDetailData;
  } catch (err) {
    console.error(err);
  }
};

// 출연진 사진 정보 가져오기
const fetchActorsData = async () => {
  try {
    const response = await getCredits("credits", movieId);
    const actorData = [];

    if (response) {
      actorData.push(response);
    } else {
      throw new Error("출연진 사진을 가져오지 못했습니다.");
    }
    return actorData;
  } catch (err) {
    console.error(err);
  }
};

// UI 요소 선택자
const selectors = {
  skeletons: document.querySelector(".skeletons.movieDetails"),
  movieDetails: document.querySelector(".movieDetails:not(.skeletons)"),
  genreList: document.querySelector(".genre"),
  posterDiv: document.querySelector(".movieDetails:not(.skeletons) .poster"),
  koTitleDiv: document.querySelector(".koTitle"),
  enTitleDiv: document.querySelector(".enTitle"),
  yearDiv: document.querySelector(".year"),
  runtimeDiv: document.querySelector(".runtime"),
  gradeDiv: document.querySelector(".grade"),
  totalDiv: document.querySelector(".total"),
  overviewDiv: document.querySelector(".overview:not(.skeleton)"),
  mainDiv: document.querySelector(".main"),
  starImg: document.querySelector(".star"),
  directorLabelDiv: document.querySelector(".director .label"),
  directorNameDiv: document.querySelector(".director .name"),
};

// 출연진 이미지 그리기
const createActorsImage = async () => {
  const actors = await fetchActorsData();
  const IMAGE_LENGTH = 15;

  console.log(actors);
  //profile_path

  // 1. 출연진 이미지 필터
  const actorImages = actors[0].cast
    .filter((_, index) => index < IMAGE_LENGTH)
    .map((actor) => actor.profile_path);

  // 2. 영화 감독 이름 필터
  const director = actors[0].crew.find((member) => member.job === "Director");

  selectors.directorLabelDiv.textContent = "감독 : ";
  selectors.directorNameDiv.textContent = `${director.name}`;
};

// 영화 디테일 그리기
const createMovieDetailCard = async () => {
  // 데이터가 로드되기 전 스켈레톤 UI 보여줌
  selectors.skeletons.style.display = "flex";
  selectors.movieDetails.style.display = "none";

  const movieDetail = await fetchMovieDetail();

  if (!movieDetail || movieDetail.length === 0) {
    console.log("들어온 데이터가 없습니다.");
    return;
  }

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
    runtime,
  } = movieDetail[0];

  // 영화 디테일 데이터 추가
  selectors.koTitleDiv.textContent = koTitle;
  selectors.enTitleDiv.textContent = enTitle;
  selectors.yearDiv.textContent = date;
  selectors.runtimeDiv.textContent = `${runtime}분`;
  selectors.gradeDiv.textContent = rating;
  selectors.overviewDiv.textContent = overview;
  selectors.totalDiv.textContent = " / 10";

  // 배경 이미지 설정
  selectors.mainDiv.style.backgroundImage = `url(https://image.tmdb.org/t/p/original${backdropUrl})`;

  // 영화 포스터 추가
  const img = document.createElement("img");
  img.src = `https://image.tmdb.org/t/p/w300${imgUrl}`;
  img.alt = koTitle;
  selectors.posterDiv.appendChild(img);

  // rating 이미지 추가
  selectors.starImg.src = "https://i.ibb.co/yFS3gHB/star.png";
  selectors.starImg.alt = "별";

  // 장르 리스트 업데이트
  selectors.genreList.innerHTML = genres
    .map(
      (genre) => `
    <div class="genreContainer">
      <span class="genreValue">${genre}</span>
    </div>
  `
    )
    .join("");

  // 데이터가 로드되면 스켈레톤 UI 숨김
  checkImagesLoaded(() => {
    selectors.skeletons.style.display = "none";
    selectors.movieDetails.style.display = "flex";
  });
};

// 모든 이미지 로드 완료 확인
const checkImagesLoaded = (callback) => {
  const images = document.querySelectorAll("img");

  let loadedCount = 0;
  const totalImages = images.length;

  const imageLoadHandler = () => {
    loadedCount++;
    if (loadedCount === totalImages) {
      callback();
    }
  };

  images.forEach((image) => {
    if (image.complete) {
      imageLoadHandler();
    } else {
      image.addEventListener("load", imageLoadHandler);
    }
  });
};

document.addEventListener("DOMContentLoaded", () => {
  // 영화 상세 페이지 그리기
  createMovieDetailCard();

  // 출연진 이미지 그리기
  createActorsImage();
});
