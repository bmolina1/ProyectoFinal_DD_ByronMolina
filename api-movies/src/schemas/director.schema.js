import * as z from 'zod'

const directorSchema = z.object({
    full_name: z.string().trim().min(2, 'El nombre del director debe tener al menos 2 caracteres')
})

export const validateDirectorSchema = (director) => {
    return directorSchema.safeParse(director)
}

