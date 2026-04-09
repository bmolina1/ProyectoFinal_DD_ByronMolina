import { pool } from '../config/db.js'

export default class DirectorService {

    static getAllDirectors = async () => {

        const [rows] = await pool.query('SELECT id, full_name FROM directors ORDER BY id ASC');
        return rows;
    }

    static findDirectorById = async (id) => {

        const [rows] = await pool.query('SELECT id, full_name FROM directors WHERE id = ?', [id]);
        return rows[0]
    }

    static createDirector = async (full_name) => {

        const [result] = await pool.query('INSERT INTO directors (full_name) VALUES (?)', [full_name]);
        return { id: result.insertId, full_name };
    }

    static updateDirector = async (id, full_name) => {

        const [result] = await pool.query('UPDATE directors SET full_name = ? WHERE id = ?', [full_name, id]);
        return result.affectedRows > 0 ? { id, full_name } : null;
    }

    static deleteDirector = async (id) => {

        await pool.query('DELETE FROM movie_directors WHERE director_id = ?', [id]);
        const [result] = await pool.query('DELETE FROM directors WHERE id = ?', [id]);

    return { 
        affectedRows: result.affectedRows,
        success: result.affectedRows > 0 
        }
    }
}
