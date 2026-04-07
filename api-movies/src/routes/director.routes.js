import { Router } from 'express';
import { getAllDirectors, findDirectorById } from '../controllers/director.controller.js';

const DirectorRouter = Router();

DirectorRouter.get('/', getAllDirectors);
DirectorRouter.get('/:id', findDirectorById);


export default DirectorRouter;