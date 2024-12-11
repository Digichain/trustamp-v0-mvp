import WalletConnect from '../components/WalletConnect';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useEffect, useState } from 'react';

const Index = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
    };
    
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
      if (event === 'SIGNED_IN' && session) {
        navigate('/dashboard');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignIn = () => {
    navigate('/auth');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-gray-900">Welcome to Trustamp</h1>
          <p className="text-xl text-gray-600">Your Digital Trade Documentation Platform</p>
        </div>
        <div className="space-y-4">
          <WalletConnect />
          {!isAuthenticated && (
            <div className="mt-4">
              <Button onClick={handleSignIn} variant="outline">
                Sign In
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;