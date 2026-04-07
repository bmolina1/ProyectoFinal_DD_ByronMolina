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
        const { title, release_year, synopsis, posterUrl, genre, director } = movie;

        // 1. Insertamos la película básica en la tabla 'movies'
        // Usamos AUTO_INCREMENT de la BD, así que no necesitamos generar un ID manual
        const [result] = await pool.query(
            'INSERT INTO movies (title, release_year, synopsis, poster_url) VALUES (?, ?, ?, ?)',
            [title, release_year, synopsis, posterUrl]
        );

        const movie_id = result.insertId; // El ID que MySQL le asignó (ej. 4, 5, 6...)

        // 2. Insertar los Géneros en la tabla pivote 'movie_genres'
        // 'genre' debe ser un array de IDs numéricos, ej: [1, 3]
        if (genre && genre.length > 0) {
            const genreValues = genre.map(gId => [movie_id, gId]);
            await pool.query(
                'INSERT INTO movie_genres (movie_id, genre_id) VALUES ?', 
                [genreValues]
            );
        }

        // 3. Insertar los Directores en la tabla pivote 'movie_directors'
        // 'director' debe ser un array de IDs numéricos, ej: [2]
        if (director && director.length > 0) {
            const directorValues = director.map(dId => [movie_id, dId]);
            await pool.query(
                'INSERT INTO movie_directors (movie_id, director_id) VALUES ?', 
                [directorValues]
            );
        }

        // Retornamos el objeto completo con su nuevo ID real
        return { id: movie_id, ...movie };
    }

    static update = async (id, movieData) => {
        const { title, release_year, synopsis, posterUrl, genre, director } = movieData;

        // 1. Actualizamos los datos básicos en la tabla 'movies'
        // Usamos IFNULL para que si un campo no viene en el JSON, mantenga el valor que ya tenía la DB
        await pool.query(`
            UPDATE movies 
            SET title = IFNULL(?, title), 
                release_year = IFNULL(?, release_year), 
                synopsis = IFNULL(?, synopsis), 
                poster_url = IFNULL(?, poster_url)
            WHERE id = ?`, 
            [title, release_year, synopsis, posterUrl, id]
        );

        // 2. Si el usuario envió nuevos géneros, actualizamos la tabla pivote
        if (genre) {
            // Borramos las relaciones viejas
            await pool.query('DELETE FROM movie_genres WHERE movie_id = ?', [id]);
            // Insertamos las nuevas
            if (genre.length > 0) {
                const values = genre.map(gId => [id, gId]);
                await pool.query('INSERT INTO movie_genres (movie_id, genre_id) VALUES ?', [values]);
            }
        }

        // 3. Si el usuario envió nuevos directores, actualizamos la tabla pivote
        if (director) {
            // Borramos las relaciones viejas
            await pool.query('DELETE FROM movie_directors WHERE movie_id = ?', [id]);
            // Insertamos las nuevas
            if (director.length > 0) {
                const values = director.map(dId => [id, dId]);
                await pool.query('INSERT INTO movie_directors (movie_id, director_id) VALUES ?', [values]);
            }
        }

        // Retornamos el resultado de la consulta para confirmar los cambios
        return await this.find(id);
    }

    static delete = async (id) => {
        // Al ejecutar este DELETE, gracias al 'ON DELETE CASCADE' de tu SQL,
        // MySQL borrará automáticamente las filas relacionadas en movie_genres y movie_directors.
        const [result] = await pool.query('DELETE FROM movies WHERE id = ?', [id]);
        
        // Retornamos true si se eliminó algo, false si el ID no existía
        return result.affectedRows > 0;
    }
}