const formatMovie = (movie) => ({
  id: movie.id,
  enTitle: movie.original_title.toLowerCase(),
  koTitle: movie.title,
  imgUrl: movie.poster_path,
  overview: movie.overview,
  rating: movie.vote_average.toFixed(2),
  date: movie.release_date.slice(0,4),
});

export default formatMovie;