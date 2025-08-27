import type { FC } from 'react';
import { AppProviders } from './components/AppProviders';
import { ToastProvider } from './components/ToastProvider';
import Header from './components/Header';
import HomeView from './views/HomeView';
import Footer from './components/Footer';

const App: FC = () => {
  return (
    <AppProviders>
      <div className="min-h-screen flex flex-col">
        {/* Animated background */}
        <div className="animated-bg">
          <div className="bg-blob"></div>
          <div className="bg-blob"></div>
          <div className="bg-blob"></div>
        </div>
        
        {/* Main content */}
        <Header />
        <main className="flex-1 flex items-center justify-center p-8">
          <HomeView />
        </main>
        <Footer />
        
        {/* Toast notifications */}
        <ToastProvider />
      </div>
    </AppProviders>
  );
};

export default App;
