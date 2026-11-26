import { BrowserRouter, Navigate, Route, Routes } from 'react-router';
import LandingPage from './pages/LandingPage/LandingPage';

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route index element={<LandingPage />} />
      <Route path='*' element={<Navigate to='/' replace />} />
    </Routes>
  </BrowserRouter>
);

export default App;
