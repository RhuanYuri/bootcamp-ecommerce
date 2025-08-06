"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { signUp } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { z, ZodError } from "zod";

// 1. Defina o esquema de validação com Zod
const signUpSchema = z
  .object({
    firstName: z.string().min(1, "O nome é obrigatório"),
    lastName: z.string().min(1, "O sobrenome é obrigatório"),
    email: z.string().email("Endereço de e-mail inválido"),
    password: z.string().min(8, "A senha deve ter pelo menos 8 caracteres"),
    passwordConfirmation: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "As senhas não coincidem",
    path: ["passwordConfirmation"], // Atribui o erro ao campo de confirmação
  });

// Tipo inferido do schema para o estado do formulário
type SignUpFormData = z.infer<typeof signUpSchema>;

export default function SignUp() {
  const [formData, setFormData] = useState<Partial<SignUpFormData>>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    passwordConfirmation: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof SignUpFormData, string>>>({});
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({}); // Limpa erros anteriores

    try {
      // 2. Valide os dados do formulário
      const validatedData = signUpSchema.parse(formData);
      setLoading(true);

      // Se a validação for bem-sucedida, prossiga com o envio
      await signUp.email({
        email: validatedData.email,
        password: validatedData.password,
        name: `${validatedData.firstName} ${validatedData.lastName}`,
        callbackURL: "/dashboard"
      });

    } catch (error) {
      // 3. Capture e trate os erros de validação do Zod
      if (error instanceof ZodError) {
        const formattedErrors: Partial<Record<keyof SignUpFormData, string>> = {};
        toast.error("Erro ao criar conta. Verifique os campos e tente novamente.");
        setErrors(formattedErrors);
      }
      setLoading(false);
    }
  };

  return (
    <Card className="z-50 rounded-md rounded-t-none max-w-md">
      <CardHeader>
        <CardTitle className="text-lg md:text-xl">Sign Up</CardTitle>
        <CardDescription className="text-xs md:text-sm">
          Enter your information to create an account
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Envolva em uma tag <form> e use onSubmit */}
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="first-name">First name</Label>
              <Input
                id="first-name"
                name="firstName"
                placeholder="Max"
                onChange={handleInputChange}
                value={formData.firstName || ""}
              />
              {errors.firstName && <p className="text-xs text-red-500">{errors.firstName}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="last-name">Last name</Label>
              <Input
                id="last-name"
                name="lastName"
                placeholder="Robinson"
                onChange={handleInputChange}
                value={formData.lastName || ""}
              />
              {errors.lastName && <p className="text-xs text-red-500">{errors.lastName}</p>}
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="m@example.com"
              onChange={handleInputChange}
              value={formData.email || ""}
            />
            {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={formData.password || ""}
              onChange={handleInputChange}
              autoComplete="new-password"
              placeholder="Password"
            />
            {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password_confirmation">Confirm Password</Label>
            <Input
              id="password_confirmation"
              name="passwordConfirmation"
              type="password"
              value={formData.passwordConfirmation || ""}
              onChange={handleInputChange}
              autoComplete="new-password"
              placeholder="Confirm Password"
            />
            {errors.passwordConfirmation && <p className="text-xs text-red-500">{errors.passwordConfirmation}</p>}
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? <Loader2 size={16} className="animate-spin" /> : "Create an account"}
          </Button>
        </form>
      </CardContent>
      <CardFooter>
        <div className="flex justify-center w-full border-t py-4">
          <p className="text-center text-xs text-neutral-500">
            Secured by <span className="text-orange-400">better-auth.</span>
          </p>
        </div>
      </CardFooter>
    </Card>
  );
}