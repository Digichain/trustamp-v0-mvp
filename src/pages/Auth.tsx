import { Auth as SupabaseAuth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { AuthError, AuthApiError } from '@supabase/supabase-js';

const Auth = () => {
  console.log("Auth component rendering...");
  const navigate = useNavigate();
  const { toast } = useToast();
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    console.log("Auth useEffect running - checking user session...");
    
    const checkUser = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        console.log("Current session:", session);
        
        if (error) {
          console.error("Session check error:", error);
          if (error.message.includes('refresh_token_not_found')) {
            // Clear any stale session data
            await supabase.auth.signOut();
            console.log("Cleared stale session data");
            toast({
              title: "Session Expired",
              description: "Please sign in again",
              variant: "destructive",
            });
          } else {
            toast({
              title: "Authentication Error",
              description: error.message,
              variant: "destructive",
            });
          }
          return;
        }

        if (session) {
          console.log("User is logged in, redirecting to dashboard...");
          navigate('/dashboard');
        }
      } catch (error) {
        console.error("Error checking session:", error);
      }
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth event:', event, 'Session:', session);
      
      if (event === 'SIGNED_IN' && session) {
        console.log('User signed in, redirecting to dashboard...');
        navigate('/dashboard');
        toast({
          title: "Welcome back!",
          description: "You have successfully signed in.",
        });
      }

      if (event === 'SIGNED_OUT') {
        console.log('User signed out, staying on auth page');
        setErrorMessage("");
        toast({
          title: "Signed out",
          description: "You have been signed out of your account.",
        });
      }

      // Handle token refresh errors
      if (event === 'TOKEN_REFRESHED') {
        console.log('Token refreshed successfully');
      }

      // Handle authentication errors
      if (event === 'USER_UPDATED' || event === 'SIGNED_IN') {
        const { error } = await supabase.auth.getSession();
        if (error) {
          console.error('Auth error:', error);
          setErrorMessage(getErrorMessage(error));
        }
      }
    });

    return () => {
      console.log("Cleaning up auth subscriptions...");
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  const getErrorMessage = (error: AuthError) => {
    console.log("Processing error:", error);
    if (error instanceof AuthApiError) {
      switch (error.status) {
        case 400:
          if (error.message.includes('missing email')) {
            return 'Please enter your email address';
          }
          return 'Invalid login credentials. Please check your email and password.';
        case 401:
          return 'Invalid credentials. Please check your email and password.';
        case 422:
          return 'Email verification required. Please check your inbox.';
        default:
          return error.message;
      }
    }
    return error.message;
  };

  return (
    <div className="container flex min-h-screen items-center justify-center">
      <div className="mx-auto w-full max-w-[400px] space-y-8 rounded-lg bg-card p-8 shadow-lg">
        <div className="text-center space-y-6">
          <Link to="/">
            <img 
              src="/lovable-uploads/df36eb75-8c90-479d-961a-9fa2c1a89be2.png" 
              alt="TruStamp Logo" 
              className="h-12 mx-auto hover:opacity-80 transition-opacity"
            />
          </Link>
          <div>
            <h2 className="text-3xl font-bold text-card-foreground">Welcome Back</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Please sign in to continue
            </p>
          </div>
        </div>

        {errorMessage && (
          <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md">
            {errorMessage}
          </div>
        )}

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
          showLinks={false}
          localization={{
            variables: {
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