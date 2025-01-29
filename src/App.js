import { Provider } from 'react-redux';
import { store, persistor } from './redux/store';
import { PersistGate } from 'redux-persist/integration/react';
import { BrowserRouter as Router, Route, Routes, Link, useLocation } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import ChartPage from './pages/ChartPage';

const NavLink = ({ to, children }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link
      to={to}
      className={`px-4 py-2 rounded-lg transition-all duration-200 
        ${isActive 
          ? 'bg-blue-600 text-white' 
          : 'text-gray-300 hover:text-white hover:bg-gray-700'
        }`}
    >
      {children}
    </Link>
  );
};

const Layout = ({ children }) => (
  <div className="bg-gray-900 text-white min-h-screen font-sans flex flex-col">
    <header className="bg-gray-800 shadow-lg">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-bold text-white">
              Car Wash Bill Manager
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <NavLink to="/">Dashboard</NavLink>
            <NavLink to="/chart">Analytics</NavLink>
          </div>
        </div>
      </nav>
    </header>

    <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {children}
    </main>

    <footer className="bg-gray-800 shadow-lg mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <p className="text-center text-gray-400 text-sm">
          © {new Date().getFullYear()} Car Wash Bill Manager. All rights reserved.
        </p>
      </div>
    </footer>
  </div>
);

const LoadingScreen = () => (
  <div className="min-h-screen bg-gray-900 flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
  </div>
);

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={<LoadingScreen />} persistor={persistor}>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/chart" element={<ChartPage />} />
              <Route path="*" element={
                <div className="text-center py-12">
                  <h2 className="text-2xl font-bold mb-4">Page Not Found</h2>
                  <p className="text-gray-400 mb-4">
                    The page you're looking for doesn't exist.
                  </p>
                  <Link 
                    to="/" 
                    className="text-blue-500 hover:text-blue-400"
                  >
                    Go back to Dashboard
                  </Link>
                </div>
              } />
            </Routes>
          </Layout>
        </Router>
      </PersistGate>
    </Provider>
  );
};

export default App;