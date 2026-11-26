import { BrowserRouter, Navigate, Route, Routes } from 'react-router';
import LandingPage from './pages/LandingPage/LandingPage';
import ShowDetailsPage from './pages/ShowDetailsPage/ShowDetailsPage';

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route index element={<LandingPage />} />
      <Route path='shows/:id' element={<ShowDetailsPage />} />
      <Route path='*' element={<Navigate to='/' replace />} />
    </Routes>
  </BrowserRouter>
);

export default App;
