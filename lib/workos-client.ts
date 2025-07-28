import { captureError, addBreadcrumb } from '@/lib/sentry';

export function getWorkOSAuthUrl(state?: string): string {
  try {
    const authState = state || crypto.randomUUID();
    
    addBreadcrumb('WorkOS auth redirect started', 'auth', {
      state: authState
    });
    
    // Redirect to backend endpoint that will handle WorkOS SSO
    const loginUrl = `/api/login${state ? `?state=${authState}` : ''}`;
    
    addBreadcrumb('WorkOS auth redirect URL generated', 'auth', {
      loginUrl,
      state: authState
    });
    
    return loginUrl;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    captureError(errorMessage, {
      component: 'workos-client',
      action: 'getWorkOSAuthUrl',
      additionalData: {
        state
      }
    });
    
    // Fallback to error page
    return '/?error=workos_url_generation_failed';
  }
} 