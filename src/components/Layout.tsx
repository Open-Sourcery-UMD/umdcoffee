import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

export default function Layout() {
  return (
    <>
      <main className="layout">
        <Navbar />
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
