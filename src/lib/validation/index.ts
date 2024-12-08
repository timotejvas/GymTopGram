import { z } from "zod";

export const SignupValidation = z.object({
  name: z.string().min(2, { message: "Meno obsahuje príliš málo znakov" }),
  username: z
    .string()
    .min(2, { message: "Použivatelské meno obsahuje príliš málo znakov" })
    .max(50, { message: "Použivatelské meno obsahuje príliš vela znakovo" }),
  email: z
    .string()
    .email()
    .min(2, { message: "Email obsahuje príliš málo znakov" }),
  password: z.string().min(8, { message: "Heslo musí mať aspoň 8 znakov" }),
});

export const SigninValidation = z.object({
  email: z
    .string()
    .email()
    .min(2, { message: "Email obsahuje príliš málo znakov" }),
  password: z.string().min(8, { message: "Heslo musí mať aspoň 8 znakov" }),
});

export const PostValidation = z.object({
  caption: z
    .string()
    .min(5, { message: "Popisok obsahuje príliš málo znakov" })
    .max(2200, { message: "Popisok obsahuje príliš vela znakov" }),
  file: z.custom<File[]>(),
  tags: z.string(),
});
