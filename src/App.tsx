import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Events from './components/Events';
import Faq from './components/Faq';

export default function App() {
  return (
    <>
      <main className="layout">
        <Navbar />
        <Hero />
        <Events />
        <Faq />
      </main>
    </>
  );
}
