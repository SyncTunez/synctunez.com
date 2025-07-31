import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getLocalApiUrl(): string {
  // Check for environment variable first - use NEXT_PUBLIC_ for client-side access
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  
  if (apiUrl) {
    return apiUrl;
  }
  
  // Fallback to localhost:8080 for development
  return 'http://localhost:8080';
}

export function storeHomeUrl(): void {
  // Only run on client side
  if (typeof window === 'undefined') return;
  
  // Only store if we're on Vercel (production)
  if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    const homeUrl = `${window.location.protocol}//${window.location.host}`;
    document.cookie = `synctunez_home_url=${encodeURIComponent(homeUrl)}; path=/; max-age=31536000; SameSite=Lax; ${window.location.protocol === 'https:' ? 'Secure;' : ''}`;
  }
}

export function getHomeUrl(): string | null {
  // Only run on client side
  if (typeof window === 'undefined') return null;
  
  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === 'synctunez_home_url') {
      return decodeURIComponent(value);
    }
  }
  return null;
}
