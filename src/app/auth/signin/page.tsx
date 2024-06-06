// pages/auth/signin.js
'use client';
import { signIn, useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import delay from 'delay';
import classNames from 'classnames';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import styles from './signin.module.css';
import { ClipLoader } from 'react-spinners';

export default function Component() {
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  // handle the login if authenticated after login redirect to homepage
  useEffect(() => {
    if (status === 'authenticated') {
      setIsLoading(true);
      router.push('/'); // Redirect to homepage after sign-in
    }
  }, [status, router]);

  if (status === 'authenticated') {
    return (
      <div className="flex justify-center items-center h-screen">
        <ClipLoader size={150} color={'#123abc'} loading={isLoading} />
      </div>
    );
  }
  const loginHandler = async (event: React.FormEvent) => {
    event.preventDefault();
    const data = new FormData(event.target);

    const email = data.get('email') as string;
    const password = data.get('password') as string;
    await signIn('credentials', { email, password });
    // router.refresh();
  };
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
            <div className="grid gap-4">
              <form onSubmit={loginHandler}>
                <div className="grid gap-2">
                  <Label className="mt-3" htmlFor="email">
                    Email
                  </Label>
                  <Input
                    name="email"
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                  />
                </div>
                <div className="grid gap-2 mb-3">
                  <div className="flex items-center">
                    <Label className="mt-3" htmlFor="password">
                      Password
                    </Label>
                  </div>
                  <Input id="password" type="password" name="password" />
                </div>
                <Link
                  href="#"
                  className="ml-auto inline-block text-sm underline"
                  prefetch={false}
                >
                  Forgot your password?
                </Link>
                <Button type="submit" className="w-full">
                  Login
                </Button>
              </form>
              <Button
                variant="outline"
                className={classNames(
                  styles.googleButton,
                  styles.googleButtonHover
                )}
                onClick={() => signIn('google')}
              >
                Login with Google
              </Button>
            </div>
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
