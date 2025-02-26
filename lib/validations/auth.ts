import * as z from "zod"

export const registerSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  password: z
    .string()
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "La contraseña debe contener al menos una mayúscula, una minúscula y un número",
    ),
  petName: z.string().min(2, "El nombre de la mascota debe tener al menos 2 caracteres"),
  petType: z.string().min(2, "El tipo de mascota es requerido"),
  isProfilePublic: z.boolean().default(false),
  allowLocationSharing: z.boolean().default(false),
})

export const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(1, "La contraseña es requerida"),
  rememberMe: z.boolean().optional(), // Campo opcional
})

export const resetPasswordSchema = z.object({
  email: z.string().email("Email inválido"),
})

export const newPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "La contraseña debe tener al menos 8 caracteres")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "La contraseña debe contener al menos una mayúscula, una minúscula y un número",
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  })

export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>
export type NewPasswordInput = z.infer<typeof newPasswordSchema>

