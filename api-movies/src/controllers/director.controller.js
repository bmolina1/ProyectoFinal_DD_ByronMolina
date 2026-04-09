import  DirectorService  from '../service/director.js';
import { validateDirectorSchema } from '../schemas/director.schema.js'

export const getAllDirectors = async (req, res) => {

    try {

        const directors = await DirectorService.getAllDirectors();

        res.json({
            status: 'success',
            message: 'Directores obtenidos correctamente',
            data: directors
        });
    } catch (error) {
         res.status(500).json({
            status: 'error',
            message: 'Error al obtener los directores',
         });
    }
}

export const findDirectorById = async (req, res) => {

    try {
        const { id } = req.params;
        const director = await DirectorService.findDirectorById(id);

        if (!director) {
            return res.status(404).json({
                status: 'error',
                message: 'Director no encontrado'
            });
        }

        res.json({
            status: 'success',
            message: 'Director obtenido correctamente',
            data: director
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error al obtener el director'
        });
    }
}

export const createDirector = async (req, res) => {

    try {
        const result = validateDirectorSchema(req.body);

        if (!result.success) {
            return res.status(400).json({
                status: 'error',
                message: result.error.issues[0].message,
                data: null
            });
        }

        const { full_name } = result.data;
        const newDirector = await DirectorService.createDirector(full_name);

        res.status(201).json({
            status: 'success',
            message: 'Director creado correctamente',
            data: newDirector
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error al crear el director',
            data: null
        });
    }
}

export const updateDirector = async (req, res) => {
    try {
        const result = validateDirectorSchema(req.body);

        if (!result.success) {
            return res.status(400).json({
                status: 'error',
                message: result.error.issues[0].message,
                data: null
            });
        }

        const { id } = req.params;
        const { full_name } = result.data;

        const updatedDirector = await DirectorService.updateDirector(id, name);

        if (!updatedDirector) {
            return res.status(404).json({
                status: 'error',
                message: 'Director no encontrado',
                data: null
            });
        }

        res.json({
            status: 'success',
            message: 'Director actualizado correctamente',
            data: updatedDirector
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error al actualizar el director',
            data: null
        });
    }
}

export const deleteDirector = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await DirectorService.deleteDirector(id);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'Director no encontrado',
                data: null
            });
        }

        res.json({
            status: 'success',
            message: 'Director eliminado correctamente',
            data: null
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error al eliminar el director',
            data: null
        });
    }
}
 