import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import ToastContainer from './components/common/ToastContainer';
import ErrorBoundary from './components/common/ErrorBoundary';
import Home from './pages/Home';
import Habits from './pages/Habits';
import Journal from './pages/Journal';
import Stats from './pages/Stats';
import Coaching from './pages/Coaching';
import Achievements from './pages/Achievements';

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="habits" element={<Habits />} />
            <Route path="journal" element={<Journal />} />
            <Route path="stats" element={<Stats />} />
            <Route path="achievements" element={<Achievements />} />
            <Route path="coaching" element={<Coaching />} />
          </Route>
        </Routes>
        <ToastContainer />
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
