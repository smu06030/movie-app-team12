// 영화 데이터 포멧
const formatMovie = (movie) => ({
  id: movie.id,
  enTitle: movie.original_title.toLowerCase(),
  koTitle: movie.title,
  imgUrl: movie.poster_path,
  overview: movie.overview,
  rating: movie.vote_average.toFixed(2),
  date: movie.release_date.slice(0,4),
});

const formattedMovieData = (movies) => movies.map(formatMovie)

// 영화 디테일 데이터 포멧
const formattedDetailData = (details) =>{
  const basicData = formatMovie(details)
  
  return {
    ...basicData,
    runtime: details.runtime,
    backdropUrl: details.backdrop_path,
    genres: formatGenres(details.genres),
  };
}

const formatGenres = (genres) => genres.map(genre => genre.name);

export {formatMovie, formattedMovieData, formattedDetailData};