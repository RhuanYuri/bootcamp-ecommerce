"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { signIn } from "@/lib/auth-client";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { z, ZodError } from "zod";
import { toast } from "sonner";

// 1. Defina o esquema de validação para o login
const signInSchema = z.object({
  email: z.string().email("Endereço de e-mail inválido"),
  password: z.string().min(1, "A senha é obrigatória"),
});

// Tipo inferido do schema
type SignInFormData = z.infer<typeof signInSchema>;

export default function SignIn() {
  const [formData, setFormData] = useState<Partial<SignInFormData>>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof SignInFormData, string>>>({});
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEmailSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({}); // Limpa erros anteriores

    try {
      // 2. Valide os dados
      const validatedData = signInSchema.parse(formData);
      setLoading(true);

      // Prossiga com o login se a validação for bem-sucedida
      await signIn.email(
        {
          email: validatedData.email,
          password: validatedData.password,
        },
        {
          onRequest: () => setLoading(true),
          onResponse: () => setLoading(false),
          onError: (ctx) => {
            toast.error(ctx.error.message);
            setErrors({ email: ctx.error.message });
          },
        }
      );
    } catch (error) {
      // 3. Capture e exiba os erros de validação
      if (error instanceof ZodError) {
        const formattedErrors: Partial<Record<keyof SignInFormData, string>> = {};
        toast.error("Erro ao fazer login. Verifique os campos e tente novamente.");
        setErrors(formattedErrors);
      }
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-md">
      <CardHeader>
        <CardTitle className="text-lg md:text-xl">Sign In</CardTitle>
        <CardDescription className="text-xs md:text-sm">
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Envolva o formulário de e-mail em uma tag <form> */}
        <form onSubmit={handleEmailSignIn} className="grid gap-4">
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
            <div className="flex items-center">
              <Label htmlFor="password">Password</Label>
              <Link href="#" className="ml-auto inline-block text-sm underline">
                Forgot your password?
              </Link>
            </div>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="password"
              autoComplete="current-password"
              onChange={handleInputChange}
              value={formData.password || ""}
            />
            {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? <Loader2 size={16} className="animate-spin" /> : "Login"}
          </Button>
        </form>

        <div className="mt-4 flex w-full flex-col items-center justify-between gap-2">
          <Button
            variant="outline"
            className="w-full gap-2"
            disabled={loading}
            onClick={async () => {
              await signIn.social(
                {
                  provider: "google",
                  callbackURL: "/dashboard",
                },
                {
                  onRequest: () => setLoading(true),
                  onResponse: () => setLoading(false),
                }
              );
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="0.98em" height="1em" viewBox="0 0 256 262">
              <path fill="#4285F4" d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622l38.755 30.023l2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"></path>
              <path fill="#34A853" d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055c-34.523 0-63.824-22.773-74.269-54.25l-1.531.13l-40.298 31.187l-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"></path>
              <path fill="#FBBC05" d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82c0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602z"></path>
              <path fill="#EB4335" d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0C79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"></path>
            </svg>
            Sign in with Google
          </Button>
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex w-full justify-center border-t py-4">
          <p className="text-center text-xs text-neutral-500">
            built with{" "}
            <Link href="https://better-auth.com" className="underline" target="_blank">
              <span className="cursor-pointer dark:text-white/70">better-auth.</span>
            </Link>
          </p>
        </div>
      </CardFooter>
    </Card>
  );
}