import { Metadata } from 'next';
import { ClientAuthWrapper } from '@/components/onboarding/client-auth-wrapper';
import { OnboardingContent } from '@/components/onboarding/onboarding-content';

export const metadata: Metadata = {
  title: 'Get Started - Connect Your Music',
  description: 'Connect your Spotify account and start creating collaborative playlists with friends. Quick setup, instant music sharing.',
  keywords: ['spotify connect', 'music setup', 'playlist creation', 'music sharing setup'],
  openGraph: {
    title: 'Get Started - Connect Your Music | SyncTuneZ',
    description: 'Connect your Spotify account and start creating collaborative playlists with friends.',
    url: 'https://synctunez.com/onboarding',
  },
  alternates: {
    canonical: '/onboarding',
  },
};

export default function OnboardingPage() {
  return (
    <ClientAuthWrapper fallback={<OnboardingContent />}>
      <OnboardingContent />
    </ClientAuthWrapper>
  );
} 