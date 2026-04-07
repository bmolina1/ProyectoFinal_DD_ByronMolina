import  DirectorService  from '../service/director.js';

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
 