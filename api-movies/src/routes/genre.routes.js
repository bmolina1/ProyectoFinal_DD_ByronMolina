import { Router } from "express";

import { getAllGenres, findGenreById, createGenre, updateGenre, deleteGenre  } from "../controllers/genre.controller.js";

const GenresRouter = Router();

GenresRouter.get('/', getAllGenres);
GenresRouter.get('/:id', findGenreById);
GenresRouter.post('/', createGenre);
GenresRouter.put('/:id', updateGenre);
GenresRouter.delete('/:id', deleteGenre);

export default GenresRouter;