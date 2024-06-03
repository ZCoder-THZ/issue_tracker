// src/app/devs/[id]/page.tsx

import React from 'react';
import Image from 'next/image';
import prisma from '../../../../prisma/client'; // Adjust the path to your prisma client

const ProfileCard = ({ user }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col items-center p-8 w-80">
      <Image
        width={150}
        height={150}
        className="w-40 h-40 rounded-full"
        src={user.image}
        alt={user.name}
      />
      <div className="mt-6 text-center">
        <h3 className="text-2xl font-semibold">{user.name}</h3>
        <p className="text-gray-600">{user.email}</p>
      </div>
      <button className="mt-6 px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600">
        Contact
      </button>
    </div>
  );
};

const ProfilePage = async ({ params }) => {
  const { id } = params;
  const user = await prisma.user.findUnique({
    where: { id },
  });

  if (!user) {
    // Return a 404 page or handle the case where the user is not found
    return <div>User not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center">
      <ProfileCard user={user} />
    </div>
  );
};

export default ProfilePage;
