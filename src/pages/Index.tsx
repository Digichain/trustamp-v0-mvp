import WalletConnect from '../components/WalletConnect';

const Index = () => {
  console.log('Index page rendered');

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-gray-900">Welcome to Trustamp</h1>
          <p className="text-xl text-gray-600">Your Digital Trade Documentation Platform</p>
        </div>
        <WalletConnect />
      </div>
    </div>
  );
};

export default Index;