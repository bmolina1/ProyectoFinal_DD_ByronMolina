import GenreService from '../service/genre.js'
import { validateGenreSchema } from '../schemas/genre.schema.js'

export const getAllGenres = async (req, res) => {

    try{
        const genres = await GenreService.getAllGenres();

        res.json({
            status: 'success',
            message: 'Géneros obtenidos correctamente',
            data: genres
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error al obtener los géneros',
            data: null
        });
    }
}

export const findGenreById = async (req, res) => {

    try {
        const { id } = req.params;
        const genre = await GenreService.findGenreById(id);

        if (!genre) {
            return res.status(404).json({
                status: 'error',
                message: 'Género no encontrado',
                data: null
            });
        }

        res.json({
            status: 'success',
            message: 'Género obtenido correctamente',
            data: genre
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error al obtener el género',
            data: null
        });
    }
}

export const createGenre = async (req, res) => { 

    try {
        const result = validateGenreSchema(req.body);

        if (!result.success) {
            return res.status(400).json({
                status: 'error',
                message: result.error.issues[0].message,
                data: null
            });
        }

        const { name } = result.data;
        const newGenre = await GenreService.createGenre(name);
    
        res.status(201).json({
            status: 'success',
            message: 'Género creado correctamente',
            data: newGenre
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error al crear el género',
            data: null
        });
    }
}

export const updateGenre = async (req, res) => {

    try {
        const result = validateGenreSchema(req.body);

        if (!result.success) {
            return res.status(400).json({
                status: 'error',
                message: result.error.issues[0].message,
                data: null
            });
        }

        const { id } = req.params;
        const { name } = result.data;

        const updatedGenre = await GenreService.updateGenre(id, name);

        if (!updatedGenre) {
            return res.status(404).json({
                status: 'error',
                message: 'Género no encontrado',
                data: null
            });
        }

        res.json({
            status: 'success',
            message: 'Género actualizado correctamente',
            data: updatedGenre
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error al actualizar el género',
            data: null
        });
    }
}

export const deleteGenre = async (req, res) => {
    
    try {
        const { id } = req.params;
        const result = await GenreService.deleteGenre(id);

         if (result.affectedRows === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'Género no encontrado',
                data: null
            });
        }

        res.json({
            status: 'success',
            message: 'Género eliminado correctamente',
            data: null
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error al eliminar el género',
            data: null
        });

    }
}