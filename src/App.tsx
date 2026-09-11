import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Events from './components/Events';
import Faq from './components/Faq';
import PartnerScroller from './components/PartnerScroller';

export default function App() {
  return (
    <>
      <main className="layout">
        <Navbar />
        <Hero />
        <Events />
        <Faq />
        <PartnerScroller />
      </main>
    </>
  );
}
