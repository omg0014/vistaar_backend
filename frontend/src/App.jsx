import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// Layout — site chrome shown on every page
import Header from './layout/Header';
import Navigation from './layout/Navigation';
import Footer from './layout/Footer';

// Main pages
import Home from './pages/Home';
import RegionProfile from './pages/RegionProfile';
import AdvanceSearch from './pages/AdvanceSearch';
import TrackSchool from './pages/TrackSchool';
import SchoolDetail from './pages/SchoolDetail';
import ReportCard from './pages/ReportCard';

// Policy / legal pages (linked from footer)
import FAQ from './pages/policy/FAQ';
import TermsConditions from './pages/policy/TermsConditions';
import PrivacyPolicy from './pages/policy/PrivacyPolicy';
import CopyrightPolicy from './pages/policy/CopyrightPolicy';
import HyperlinkPolicy from './pages/policy/HyperlinkPolicy';
import Disclaimer from './pages/policy/Disclaimer';

function App() {
  return (
    <Router>
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f4f6f9' }}>
        <Header />
        <Navigation />
        <div style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/region" element={<RegionProfile />} />
            <Route path="/advancesearch" element={<AdvanceSearch />} />
            <Route path="/trackschool" element={<TrackSchool />} />
            <Route path="/schooldetail/:udise/:yearId" element={<SchoolDetail />} />
            <Route path="/schooldetail/:udise" element={<SchoolDetail />} />
            <Route path="/schooldetail1/:udise/:yearId" element={<SchoolDetail />} />
            <Route path="/reportcard/:id/:yearId" element={<ReportCard />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/termsconditions" element={<TermsConditions />} />
            <Route path="/terms&condition" element={<TermsConditions />} />
            <Route path="/privacypolicy" element={<PrivacyPolicy />} />
            <Route path="/copyright" element={<CopyrightPolicy />} />
            <Route path="/copyrightpolicy" element={<CopyrightPolicy />} />
            <Route path="/hyperlink" element={<HyperlinkPolicy />} />
            <Route path="/disclaimer" element={<Disclaimer />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
