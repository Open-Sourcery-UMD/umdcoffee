import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Events from './components/Events';

export default function App() {
  return (
    <>
      <main className="layout">
        <Navbar />
        <Hero />
        <Events />
      </main>
    </>
  );
}
