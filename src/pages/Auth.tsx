import { Auth as SupabaseAuth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';

const Auth = () => {
  console.log("Auth component rendering...");
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    console.log("Auth useEffect running - checking user session...");
    
    // Check initial session
    const checkUser = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      console.log("Current session:", session);
      if (error) {
        console.error("Session check error:", error);
        return;
      }
      if (session) {
        console.log("User is logged in, redirecting to dashboard...");
        navigate('/dashboard');
      }
    };

    checkUser();

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth event:', event, 'Session:', session);
      
      if (event === 'SIGNED_IN' && session) {
        console.log('User signed in, redirecting to dashboard...');
        // Ensure we have a valid session before redirecting
        const { data: { session: currentSession }, error } = await supabase.auth.getSession();
        if (currentSession && !error) {
          navigate('/dashboard');
          toast({
            title: "Welcome back!",
            description: "You have successfully signed in.",
          });
        } else {
          console.error("Error getting session after sign in:", error);
          toast({
            title: "Authentication Error",
            description: "There was an issue with your session. Please try signing in again.",
            variant: "destructive",
          });
        }
      }

      if (event === 'SIGNED_OUT') {
        console.log('User signed out, staying on auth page');
        // Clear any existing session
        await supabase.auth.signOut();
        toast({
          title: "Signed out",
          description: "You have been signed out of your account.",
        });
      }

      if (event === 'TOKEN_REFRESHED') {
        console.log('Session token refreshed');
      }
    });

    return () => {
      console.log("Cleaning up auth subscriptions...");
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  return (
    <div className="container flex min-h-screen items-center justify-center">
      <div className="mx-auto w-full max-w-[400px] space-y-8 rounded-lg bg-card p-8 shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-card-foreground">Welcome to Trustamp</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Please sign in to continue
          </p>
        </div>
        <SupabaseAuth 
          supabaseClient={supabase}
          appearance={{ 
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: 'hsl(var(--primary))',
                  brandAccent: 'hsl(var(--primary))',
                }
              }
            }
          }}
          providers={[]}
          theme="light"
          localization={{
            variables: {
              sign_up: {
                email_label: 'Email',
                password_label: 'Create Password',
                button_label: 'Create Account',
                loading_button_label: 'Creating Account...',
                social_provider_text: 'Sign up with {{provider}}',
                link_text: "Don't have an account? Sign up",
              },
              sign_in: {
                email_label: 'Email',
                password_label: 'Your Password',
                button_label: 'Sign In',
                loading_button_label: 'Signing In...',
                social_provider_text: 'Sign in with {{provider}}',
                link_text: 'Already have an account? Sign in',
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default Auth;