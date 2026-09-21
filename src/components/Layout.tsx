import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

export default function Layout() {
  return (
    <>
      <Navbar />
      <main className="layout">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
