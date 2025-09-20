import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PageTransition from './components/PageTransition';
import Home from './pages/Home';
import Events from './pages/Events';
import Brochure from './pages/Brochure';
import RulesAndRegulations from './pages/RulesAndRegulations';
import Registration from './pages/Registration';
import Contact from './pages/Contact';
import About from './pages/About';
import Admin from './pages/Admin';
import EventDetails from './pages/EventDetails';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="flex-1">
          <PageTransition>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/events" element={<Events />} />
              <Route path="/brochure" element={<Brochure />} />
              <Route path="/rules" element={<RulesAndRegulations />} />
              <Route path="/events/:id" element={<EventDetails />} />
              <Route path="/register/:eventId" element={<Registration />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/about" element={<About />} />
              <Route path="/admin" element={<Admin />} />
            </Routes>
          </PageTransition>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;