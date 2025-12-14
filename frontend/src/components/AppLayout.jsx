import Navbar from './Navbar';
import Footer from './Footer';

export default function AppLayout({ children }) {
  return (
    <div className="w-full h-screen overflow-hidden flex flex-col bg-slate-950 text-slate-50">
      <Navbar loggedIn={true} />

      <div className="flex-1 w-full overflow-y-auto app-scroll">
          {children}
      </div>

      <Footer />
    </div>
  );
}
