import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface Role {
  role: number;
}

const roles = [
  {
    role: 0,
    name: 'Tester',
  },
  {
    role: 1,
    name: 'Developer',
  },
  {
    role: 2,
    name: 'Admin',
  },
];

export function getRole(roleId: number) {
  const foundRole = roles.find((role) => role.role === roleId);
  return foundRole ? foundRole.name : 'Role not found';
}
