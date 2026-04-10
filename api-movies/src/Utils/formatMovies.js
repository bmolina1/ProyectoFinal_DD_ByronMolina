
export const formatMovie = (movie) => ({
    ...movie,
    genres: movie.genres ? movie.genres.split(', ') : [],
    directors: movie.directors ? movie.directors.split(', ') : []
});

export const formatMovies = (movies) => movies.map(formatMovie);
