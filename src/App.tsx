import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import ToastContainer from './components/common/ToastContainer';
import Home from './pages/Home';
import Habits from './pages/Habits';
import Journal from './pages/Journal';
import Stats from './pages/Stats';
import Coaching from './pages/Coaching';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="habits" element={<Habits />} />
          <Route path="journal" element={<Journal />} />
          <Route path="stats" element={<Stats />} />
          <Route path="coaching" element={<Coaching />} />
        </Route>
      </Routes>
      <ToastContainer />
    </BrowserRouter>
  );
}

export default App;
