// pages/auth/signin.js
'use client';
import { signIn, useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ClipLoader } from 'react-spinners';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

// Define validation schema
const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters")
});

export default function SignInPage() {
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Initialize react-hook-form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });

  // Handle redirect if authenticated
  useEffect(() => {
    if (status === 'authenticated') {
      setIsLoading(true);
      router.push('/');
    }
  }, [status, router]);

  // Form submit handler
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      const result = await signIn('credentials', {
        redirect: false,
        email: values.email,
        password: values.password
      });

      if (result?.error) {
        form.setError("root", {
          message: result.error
        });
      }
    } catch (error) {
      form.setError("root", {
        message: "An unexpected error occurred"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (status === 'authenticated') {
    return (
      <div className="flex justify-center items-center h-screen">
        <ClipLoader size={150} color={'#123abc'} loading={isLoading} />
      </div>
    );
  }

  return (
    <div>
      {status === 'unauthenticated' && (
        <Card className="mx-auto max-w-sm">
          <CardHeader>
            <CardTitle className="text-2xl">Login</CardTitle>
            <CardDescription>
              Enter your email below to login to your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
                {form.formState.errors.root && (
                  <p className="text-sm font-medium text-destructive">
                    {form.formState.errors.root.message}
                  </p>
                )}

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="m@example.com"
                          {...field}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          {...field}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Link
                  href="#"
                  className="ml-auto inline-block text-sm underline"
                  prefetch={false}
                >
                  Forgot your password?
                </Link>

                <Button type="submit" disabled={isLoading}>
                  {isLoading ? <ClipLoader size={20} color="#ffffff" /> : "Login"}
                </Button>
              </form>
            </Form>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>

            <Button
              variant="outline"
              type="button"
              disabled={isLoading}
              onClick={() => signIn('google')}
              className="w-full"
            >
              Google
            </Button>

            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{' '}
              <Link
                href="/auth/register"
                className="underline"
                prefetch={false}
              >
                Sign up
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}