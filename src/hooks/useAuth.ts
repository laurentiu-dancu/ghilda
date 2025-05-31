import { useStore } from '@nanostores/react';
import { authStore } from '../stores/authStore';

export function useAuth() {
  return useStore(authStore);
}