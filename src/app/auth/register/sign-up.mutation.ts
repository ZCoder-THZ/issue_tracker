import axios from 'axios';
import { signIn } from 'next-auth/react';
import { SignUpFormData } from './sign-up.schema';

export const signUpMutation = async (data: SignUpFormData) => {
    try {
        const response = await axios.post('/api/register', data);

        if (response.data.success) {
            const signInResponse = await signIn('credentials', {
                redirect: false,
                email: data.email,
                password: data.password,
            });

            if (!signInResponse?.ok) {
                throw new Error('Failed to sign in after registration');
            }

            return { success: true };
        }

        throw new Error(response.data.message || 'Registration failed');
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : 'An unknown error occurred');
    }
};