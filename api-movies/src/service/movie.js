import MOVIES from '../data/movies.json' with { type: 'json' }
import { v4 as uuidv4 } from 'uuid';
import { pool } from '../config/db.js'
export default class Movie {

    static getAll = async ({ genre, director, year } = {}) => {


        const [rows] = await pool.query(`SELECT 
                                    m.id, 
                                    m.title, 
                                    m.release_year,
                                    m.synopsis,
                                    GROUP_CONCAT(DISTINCT g.name SEPARATOR ', ') AS genres,
                                    GROUP_CONCAT(DISTINCT d.full_name SEPARATOR ', ') AS directors
                                FROM movies m
                                LEFT JOIN movie_genres mg ON m.id = mg.movie_id
                                LEFT JOIN genres g ON mg.genre_id = g.id
                                LEFT JOIN movie_directors md ON m.id = md.movie_id
                                LEFT JOIN directors d ON md.director_id = d.id
                                GROUP BY m.id;`);


        //conectarse a la base de datos
        //hacer la consutla (query)
        // retornar los resultados

        //concatenar con un where
        if (genre) {
            //throw -> genera un error generico
            // throw Error('user not found')

            return MOVIES.filter((movie) => {
                return movie.genre.some((g) => {
                    return g.toLowerCase() === genre.toLowerCase()
                })
            })
        }
        //select *from 
        return rows
    }

    static find = async (id) => {

        const [rows] = await pool.query(`SELECT 
                                    m.id, 
                                    m.title, 
                                    m.release_year,
                                    m.synopsis,
                                    GROUP_CONCAT(DISTINCT g.name SEPARATOR ', ') AS genres,
                                    GROUP_CONCAT(DISTINCT d.full_name SEPARATOR ', ') AS directors
                                FROM movies m
                                LEFT JOIN movie_genres mg ON m.id = mg.movie_id
                                LEFT JOIN genres g ON mg.genre_id = g.id
                                LEFT JOIN movie_directors md ON m.id = md.movie_id
                                LEFT JOIN directors d ON md.director_id = d.id
                                where m.id = :id
                                GROUP BY m.id;`, { id }); //bind param

        return rows
    }

    static create = async (movie) => {
        
        const { title, release_year, synopsis, posterUrl = null, genres = [], directors = []} = movie

        const [result] = await pool.query(
            `INSERT INTO movies (title, release_year, synopsis, poster_url)
             VALUES (?, ?, ?, ?)`,
            [title, release_year, synopsis, posterUrl]
        )

        const movieId = result.insertId

        if (genres.length > 0) {
            const genreValues = genres.map((genreId) => [movieId, genreId])

            await pool.query(
                `INSERT INTO movie_genres (movie_id, genre_id)
                 VALUES ?`,
                [genreValues]
            )
        }

        if (directors.length > 0) {
            const directorValues = directors.map((directorId) => [movieId, directorId])

            await pool.query(
                `INSERT INTO movie_directors (movie_id, director_id)
                 VALUES ?`,
                [directorValues]
            )
        }

        return {
            id: movieId,
            ...movie
        }
    }

    static update = async (id, movie) => {
        const { title, release_year, synopsis, poster_url, genres, directors } = movie

        await pool.query('START TRANSACTION')

        const updateFields = []
        const updateValues = []

        if (title !== undefined) {
            updateFields.push('title = ?')
            updateValues.push(title)
        }
        if (release_year !== undefined) {
            updateFields.push('release_year = ?')
            updateValues.push(release_year)
        }
        if (synopsis !== undefined) {
            updateFields.push('synopsis = ?')
            updateValues.push(synopsis)
        }
        if (poster_url !== undefined) {
            updateFields.push('poster_url = ?')
            updateValues.push(poster_url)
        }

        if (updateFields.length > 0) {
            updateValues.push(id)
            await pool.query(
                `UPDATE movies SET ${updateFields.join(', ')} WHERE id = ?`,
                updateValues
            )
        }

        if (genres !== undefined && Array.isArray(genres)) {
            await pool.query('DELETE FROM movie_genres WHERE movie_id = ?', [id])
            if (genres.length > 0) {
                const genreValues = genres.map(g => [id, g])
                await pool.query('INSERT INTO movie_genres (movie_id, genre_id) VALUES ?', [genreValues])
            }
        }

        if (directors !== undefined && Array.isArray(directors)) {
            await pool.query('DELETE FROM movie_directors WHERE movie_id = ?', [id])
            if (directors.length > 0) {
                const directorValues = directors.map(d => [id, d])
                await pool.query('INSERT INTO movie_directors (movie_id, director_id) VALUES ?', [directorValues])
            }
        }

        await pool.query('COMMIT')

        return await Movie.find(id)
    }

    static delete = async (id) => {

    await pool.query('DELETE FROM movie_genres WHERE movie_id = ?', [id])
    await pool.query('DELETE FROM movie_directors WHERE movie_id = ?', [id])
    await pool.query('DELETE FROM movies WHERE id = ?', [id])

    }

}