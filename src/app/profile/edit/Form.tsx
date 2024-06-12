'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { signIn, signOut } from 'next-auth/react';

export interface User {
  name: string | null;
  email: string | null;
  image: File[] | null;
}

type FormDataFields = {
  name: string | null;
  email: string | null;
  image: File[];
};

const ProfileEdit = ({ user }: { user: User }) => {
  const { register, handleSubmit } = useForm();

  const [image, setImage] = useState(user.image ? user.image : '');
  const [name, setName] = useState(user.name ? user.name : '');
  const [email, setEmail] = useState(user.email ? user.email : '');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit: any = async (data: FormDataFields) => {
    const formData = new FormData();

    formData.append('name', data.name as string);
    formData.append('email', data.email as string);
    formData.append('image', data.image[0]);

    try {
      const res = await axios.post('/api/profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (res.data) {
        const { url, fields } = res.data;

        // Create new FormData for S3 upload
        const s3FormData = new FormData();
        Object.entries(fields).forEach(([key, value]) => {
          s3FormData.append(key, value as string);
        });
        s3FormData.append('file', data.image[0]);

        // Step 2: Upload the file to S3 using the presigned URL
        await axios.post(url, s3FormData);

        // Log out the user
        await signOut({ redirect: false });

        // Log the user back in
        await signIn('Credentials', {
          email: data.email,
          callbackUrl: window.location.href, // Redirect to the same page after re-authentication
        });

        alert('Profile updated successfully!');
      } else {
        alert('Profile update failed');
      }
    } catch (error) {
      console.error('Profile update error:', error);
      alert('An error occurred while updating the profile');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-black">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-semibold mb-4 text-center text-gray-900 dark:text-white">
          Edit Profile
        </h1>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex justify-center">
            <div className="relative">
              <Image
                width={150}
                height={150}
                src={(image as string) || 'https://via.placeholder.com/150'}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-2 border-gray-300 dark:border-gray-600"
              />
              <input
                type="file"
                accept="image/*"
                {...register('image')}
                onChange={handleImageChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-300">
              Name
            </label>
            <input
              type="text"
              defaultValue={name}
              {...register('name')}
              className="w-full mt-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring focus:ring-indigo-200 dark:focus:ring-indigo-500 focus:border-indigo-300 dark:focus:border-indigo-600 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-300">
              Email
            </label>
            <input
              type="email"
              defaultValue={email}
              readOnly
              {...register('email')}
              className="w-full mt-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring focus:ring-indigo-200 dark:focus:ring-indigo-500 focus:border-indigo-300 dark:focus:border-indigo-600 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-500"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileEdit;
