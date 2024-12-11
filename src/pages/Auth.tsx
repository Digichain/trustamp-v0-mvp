import { Auth as SupabaseAuth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is already logged in
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate('/dashboard');
      }
    };

    checkUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth event:', event);
      
      if (event === 'SIGNED_IN' && session) {
        navigate('/dashboard');
        toast({
          title: "Welcome back!",
          description: "You have successfully signed in.",
        });
      }

      if (event === 'USER_UPDATED') {
        toast({
          title: "Account updated",
          description: "Your account has been successfully updated.",
        });
      }

      // Handle specific error events
      if (event === 'SIGNED_OUT') {
        toast({
          variant: "destructive",
          title: "Signed out",
          description: "You have been signed out of your account.",
        });
      }
    });

    return () => {
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