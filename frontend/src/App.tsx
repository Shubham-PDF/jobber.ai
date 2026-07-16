import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SignIn, SignUp } from '@clerk/clerk-react';
import { AuthProvider } from './hooks/useAuth';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Landing } from './pages/Landing';
import { Dashboard } from './pages/Dashboard';
import { Results } from './pages/Results';

const SignInPage: React.FC = () => (
  <div className="min-h-[calc(100vh-4rem)] bg-zinc-950 flex flex-col justify-center items-center py-12 px-4 relative tesla-grid">
    <div className="absolute top-[20%] right-[20%] w-[30%] h-[30%] rounded-full bg-white/[0.01] blur-[100px] pointer-events-none" />
    <SignIn 
      routing="path" 
      path="/signin" 
      signUpUrl="/signup" 
      fallbackRedirectUrl="/dashboard"
      appearance={{
        variables: {
          colorPrimary: '#ffffff',
          colorBackground: '#09090b',
          colorInputBackground: '#000000',
          colorText: '#ffffff',
          colorTextSecondary: '#71717a',
          colorInputText: '#ffffff',
          colorBorder: '#27272a',
          colorTextOnPrimaryBackground: '#000000'
        },
        elements: {
          card: 'border border-white/10 shadow-2xl bg-zinc-900/40 backdrop-blur-md rounded-lg',
          headerTitle: 'text-white font-bold tracking-tight',
          headerSubtitle: 'text-neutral-500 text-xs',
          socialButtonsBlockButton: 'border border-white/10 bg-black hover:bg-zinc-900 !text-white transition-all rounded',
          socialButtonsBlockButtonText: '!text-white font-semibold text-xs',
          formFieldLabel: 'text-neutral-450 font-bold uppercase tracking-wider text-[9px]',
          formFieldInput: 'bg-black border border-white/10 text-white focus:border-white/40 rounded py-2.5 text-xs',
          footerActionLink: 'text-white hover:text-neutral-300 font-bold',
          dividerLine: 'bg-white/5',
          dividerText: 'text-neutral-600 text-[10px] uppercase tracking-wider font-mono'
        }
      }}
    />
  </div>
);

const SignUpPage: React.FC = () => (
  <div className="min-h-[calc(100vh-4rem)] bg-zinc-950 flex flex-col justify-center items-center py-12 px-4 relative tesla-grid">
    <div className="absolute top-[20%] left-[20%] w-[30%] h-[30%] rounded-full bg-white/[0.01] blur-[100px] pointer-events-none" />
    <SignUp 
      routing="path" 
      path="/signup" 
      signInUrl="/signin" 
      fallbackRedirectUrl="/dashboard"
      appearance={{
        variables: {
          colorPrimary: '#ffffff',
          colorBackground: '#09090b',
          colorInputBackground: '#000000',
          colorText: '#ffffff',
          colorTextSecondary: '#71717a',
          colorInputText: '#ffffff',
          colorBorder: '#27272a',
          colorTextOnPrimaryBackground: '#000000'
        },
        elements: {
          card: 'border border-white/10 shadow-2xl bg-zinc-900/40 backdrop-blur-md rounded-lg',
          headerTitle: 'text-white font-bold tracking-tight',
          headerSubtitle: 'text-neutral-500 text-xs',
          socialButtonsBlockButton: 'border border-white/10 bg-black hover:bg-zinc-900 !text-white transition-all rounded',
          socialButtonsBlockButtonText: '!text-white font-semibold text-xs',
          formFieldLabel: 'text-neutral-450 font-bold uppercase tracking-wider text-[9px]',
          formFieldInput: 'bg-black border border-white/10 text-white focus:border-white/40 rounded py-2.5 text-xs',
          footerActionLink: 'text-white hover:text-neutral-300 font-bold',
          dividerLine: 'bg-white/5',
          dividerText: 'text-neutral-600 text-[10px] uppercase tracking-wider font-mono'
        }
      }}
    />
  </div>
);

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen bg-slate-950 text-white font-sans antialiased">
          {/* Test application yellow banner */}
          <div className="bg-amber-400 text-neutral-950 py-1.5 px-4 text-center text-[10px] sm:text-xs font-bold uppercase tracking-wider z-50 select-none">
            This is a test application. Feedbacks will be appreciated.{' '}
            <a href="mailto:trickyshubham@gmail.com" className="underline decoration-2 hover:text-black transition-colors">
              Contact us
            </a>
          </div>
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/signup/*" element={<SignUpPage />} />
              <Route path="/signin/*" element={<SignInPage />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/results/:searchId"
                element={
                  <ProtectedRoute>
                    <Results />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
