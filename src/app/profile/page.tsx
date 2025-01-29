// src/app/devs/[id]/page.tsx

import React from 'react';
import Image from 'next/image';
import prisma from '../../../prisma/client'; // Adjust the path to your prisma client
import Qr from '@/app/devs/[id]/Qr';
import { getServerSession } from 'next-auth';
import { AuthOption } from '../auth/authOption';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';

interface User {
  id: string;
  name: string;
  email: string;
  image: string;
}

const ProfileCard = ({ user }: { user: User }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden flex flex-col items-center p-8 w-80">
      {user.image && (
        <Image
          width={150}
          height={150}
          className="w-40 h-40 rounded-full"
          src={`https://issuetrack.s3.ap-southeast-1.amazonaws.com/${user.image}`}
          alt={user.name}
        />
      )}

      <div className="mt-6 text-center">
        <h3 className="text-2xl font-semibold">Username :{user.name}</h3>
        <p className="text-gray-600">email :{user.email}</p>
        <Label htmlFor="picture">Picture</Label>
      </div>
      <Qr />
      <Link
        href="/profile/edit"
        className="mt-6 px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Edit
      </Link>
    </div>
  );
};

const ProfilePage = async () => {
  const session = await getServerSession<Object>(AuthOption);
  console.log(session);
  if (!session) {
    // Return a 404 page or handle the case where the user is not found
    return <div>User not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex justify-center items-center">
      <ProfileCard user={session.user} />
    </div>
  );
};

export default ProfilePage;
