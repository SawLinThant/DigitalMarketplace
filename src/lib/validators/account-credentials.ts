import { z } from "zod";

export const AuthCredentialsValidator= z.object({
    username: z.string(),
    email: z.string().email(),
    password:z.string().min(8,{
        message:'Password must be at least 8 characters long.'
    }),
    confirmpassword: z.string(),
    //userType: z.string(),
});

export type TAuthCredentialsValidator=z.infer<typeof AuthCredentialsValidator>