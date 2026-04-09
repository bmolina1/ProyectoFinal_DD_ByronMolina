import { Router } from 'express';
import { getAllDirectors, findDirectorById, createDirector, updateDirector, deleteDirector } from '../controllers/director.controller.js';

const DirectorsRouter = Router();

DirectorsRouter.get('/', getAllDirectors);
DirectorsRouter.get('/:id', findDirectorById);
DirectorsRouter.post('/', createDirector);
DirectorsRouter.put('/:id', updateDirector);
DirectorsRouter.delete('/:id', deleteDirector);



export default DirectorsRouter;