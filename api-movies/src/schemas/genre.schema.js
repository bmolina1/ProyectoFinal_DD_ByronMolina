import * as z from 'zod'

const genreSchema = z.object({
    name: z.string('El nombre del género debe ser un string')
        .trim(2, 'El nombre del género no puede estar vacío')
        .min(2, 'El nombre del género debe tener al menos 2 caracteres')
        .max(50, 'El nombre es demasiado largo'),
})

export const validateGenreSchema = (genre) => {
    return genreSchema.safeParse(genre)
}
