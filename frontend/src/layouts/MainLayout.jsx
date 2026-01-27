import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1 px-4 py-6 sm:px-6 md:px-8 lg:px-12 max-w-7xl mx-auto w-full">
        <Outlet />
      </main>
    </div>
  );
}
