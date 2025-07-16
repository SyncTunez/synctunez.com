'use client';

import dynamic from 'next/dynamic';

const RegisterModal = dynamic(() => import('@/components/RegisterModal'), { ssr: false });

interface RegisterModalWrapperProps {
  userSession: string | null;
  userAccountRaw: string | null;
}

export default function RegisterModalWrapper({ userSession, userAccountRaw }: RegisterModalWrapperProps) {
  return <RegisterModal userSession={userSession} userAccountRaw={userAccountRaw} />;
} 