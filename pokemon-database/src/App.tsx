import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useUserStore } from './stores/userStore';
import PokemonList from './components/PokemonList';
import PokemonDetail from './components/PokemonDetail';
import Header from './components/Header';
import './index.css';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
  },
});

function App() {
  const { preferences, updatePreferences } = useUserStore();
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Handle theme changes
  useEffect(() => {
    const updateTheme = () => {
      if (preferences.theme === 'system') {
        setIsDarkMode(window.matchMedia('(prefers-color-scheme: dark)').matches);
      } else {
        setIsDarkMode(preferences.theme === 'dark');
      }
    };

    updateTheme();
    
    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (preferences.theme === 'system') {
        updateTheme();
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [preferences.theme]);

  // Apply theme to document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
          <Header />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<PokemonList />} />
              <Route path="/pokemon/:id" element={<PokemonDetail />} />
              <Route path="/favorites" element={<PokemonList favoritesOnly />} />
              <Route path="/teams" element={<div>Teams Page (Coming Soon)</div>} />
              <Route path="/compare" element={<div>Compare Page (Coming Soon)</div>} />
            </Routes>
          </main>
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;