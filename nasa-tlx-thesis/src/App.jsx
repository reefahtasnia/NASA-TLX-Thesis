import { BrowserRouter, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// Pages - will be created in next phases
import Home from './pages/Home';
import ParticipantInfo from './pages/ParticipantInfo';
import AboutTLX from './pages/AboutTLX';
import Definitions from './pages/Definitions';
import RatingSheet from './pages/RatingSheet';
import CompareCards from './pages/CompareCards';
import End from './pages/End';
import Results from './pages/Results';
import Dashboard from './pages/Dashboard';
import GermaneLoad from './pages/GermaneLoad';
import GermaneLoadDashboard from './pages/GermaneLoadDashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/participant/:participantId" element={<ParticipantInfo />} />
        <Route path="/tlx/:participantId/about" element={<AboutTLX />} />
        <Route path="/tlx/:participantId/definitions" element={<Definitions />} />
        <Route path="/tlx/:participantId/rating" element={<RatingSheet />} />
        <Route path="/tlx/:participantId/compare" element={<CompareCards />} />
        <Route path="/end/:participantId" element={<End />} />
        <Route path="/results/:participantId" element={<Results />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/germane-load-form" element={<GermaneLoad />} />
        <Route path="/germane-load-dashboard" element={<GermaneLoadDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
