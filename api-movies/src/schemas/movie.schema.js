import * as z from 'zod'


const movieSchema = z.object({
    "title": z.string('El titulo debe ser un string').min(2).max(100, 'no debe superar los 100 caracteres'),
    "release_year": z.number('El año de lanzamiento debe ser un numero').int().min(1888, 'El año de lanzamiento no puede ser anterior a 1888').max(new Date().getFullYear(), 'El año de lanzamiento no puede ser mayor al año actual'),
    "synopsis": z.string('La sinopsis debe ser un string').min(10, 'La sinopsis debe tener al menos 10 caracteres'),
    "posterUrl": z.url().nullable().optional(),
    "genres": z.array(z.number().int('El genero debe ser un numero').positive('El genero debe ser positivo')).min(1, 'Se debe enviar al menos un genero'),
    "directors": z.array(z.number().int('El director debe ser un numero').positive('El director debe ser positivo')).min(1, 'Se debe enviar al menos un director')
}).strict()

export const validateMovieSchema = (movie) => {
    return movieSchema.safeParse(movie)
}

export const validatePartialMovieSchema = (movie) => {

    return movieSchema.partial().safeParse(movie)
}