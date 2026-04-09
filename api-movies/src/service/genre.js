import { pool } from '../config/db.js'

export default class GenreService {

    static getAllGenres = async () => {

        const [rows] = await pool.query('SELECT id, name FROM genres ORDER BY id ASC');
        return rows;
    }

    static findGenreById = async (id) => {

        const [rows] = await pool.query('SELECT id, name FROM genres WHERE id = ?', [id]);
        return rows[0]
    }

    static createGenre = async (name) => {

        const [result] = await pool.query('INSERT INTO genres (name) VALUES (?)', [name]);
        return { id: result.insertId, name };
    }

    static updateGenre = async (id, name) => {

        const [result] = await pool.query('UPDATE genres SET name = ? WHERE id = ?', [name, id]);
        if (result.affectedRows === 0) return null;
        return { id, name };
    }

    static deleteGenre = async (id) => {

        await pool.query('DELETE FROM movie_genres WHERE genre_id = ?', [id]);
        const [result] = await pool.query('DELETE FROM genres WHERE id = ?', [id]);
    
        return { 
            affectedRows: result.affectedRows,
            success: result.affectedRows > 0 
        };
};

}