import { useEffect, useState, type ReactNode } from 'react';
import HomePage from './pages/HomePage';
import ToolsPage from './pages/ToolsPage';
import MergePage from './tools/MergePage';
import SplitPage from './tools/SplitPage';
import CompressPage from './tools/CompressPage';
import JpgToPdfPage from './tools/JpgToPdfPage';
import PdfToJpgPage from './tools/PdfToJpgPage';
import RotatePage from './tools/RotatePage';
import DeletePagesPage from './tools/DeletePagesPage';
import ExtractPagesPage from './tools/ExtractPagesPage';
import WatermarkPage from './tools/WatermarkPage';
import ProtectPage from './tools/ProtectPage';
import PrivacyPage from './pages/PrivacyPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import TermsPage from './pages/TermsPage';
import NotFoundPage from './pages/NotFoundPage';

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/tools', label: 'All Tools' },
  { to: '/privacy', label: 'Privacy' },
  { to: '/about', label: 'About' },
];

function normalizeRoute(route: string) {
  if (!route || route === '/') return '/';
  return route.startsWith('/') ? route : `/${route}`;
}

function getRouteFromLocation() {
  const hashRoute = window.location.hash.replace(/^#/, '');
  if (hashRoute) return normalizeRoute(hashRoute);

  const pathname = window.location.pathname;
  if (pathname === '/' || pathname.endsWith('/index.html')) return '/';
  return normalizeRoute(pathname);
}

function App() {
  const [path, setPath] = useState(getRouteFromLocation);

  useEffect(() => {
    const onRouteChange = () => setPath(getRouteFromLocation());
    window.addEventListener('hashchange', onRouteChange);
    window.addEventListener('popstate', onRouteChange);
    return () => {
      window.removeEventListener('hashchange', onRouteChange);
      window.removeEventListener('popstate', onRouteChange);
    };
  }, []);

  const navigate = (to: string) => {
    const route = normalizeRoute(to);
    const hash = route === '/' ? '' : `#${route}`;
    if (window.location.hash !== hash) {
      window.location.hash = hash;
    }
    setPath(route);
  };

  const pageMap: Record<string, ReactNode> = {
    '/': <HomePage />, 
    '/tools': <ToolsPage />,
    '/merge-pdf': <MergePage />, 
    '/split-pdf': <SplitPage />, 
    '/compress-pdf': <CompressPage />, 
    '/jpg-to-pdf': <JpgToPdfPage />, 
    '/pdf-to-jpg': <PdfToJpgPage />, 
    '/rotate-pdf': <RotatePage />, 
    '/delete-pages': <DeletePagesPage />, 
    '/extract-pages': <ExtractPagesPage />, 
    '/add-watermark': <WatermarkPage />, 
    '/protect-pdf': <ProtectPage />, 
    '/privacy': <PrivacyPage />, 
    '/about': <AboutPage />, 
    '/contact': <ContactPage />, 
    '/terms': <TermsPage />, 
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-white/10 bg-slate-950/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <a href="#/" onClick={(event) => { event.preventDefault(); navigate('/'); }} className="flex items-center gap-3 text-lg font-semibold">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-500/20 text-cyan-300">PDF</span>
            <span>PDF Tools</span>
          </a>
          <nav className="hidden gap-6 md:flex">
            {navItems.map((item) => (
              <a key={item.to} href={`#${item.to}`} onClick={(event) => { event.preventDefault(); navigate(item.to); }} className={`transition ${path === item.to ? 'text-cyan-300' : 'text-slate-300 hover:text-white'}`}>
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      </header>

      <main>{pageMap[path] ?? <NotFoundPage />}</main>

      <footer className="border-t border-white/10 bg-slate-950/90">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 text-sm text-slate-400 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <p>Uploaded files are automatically deleted after processing.</p>
          <div className="flex gap-4">
            <a href="#/about" onClick={(event) => { event.preventDefault(); navigate('/about'); }} className="hover:text-white">About</a>
            <a href="#/privacy" onClick={(event) => { event.preventDefault(); navigate('/privacy'); }} className="hover:text-white">Privacy Policy</a>
            <a href="#/terms" onClick={(event) => { event.preventDefault(); navigate('/terms'); }} className="hover:text-white">Terms of Use</a>
            <a href="#/contact" onClick={(event) => { event.preventDefault(); navigate('/contact'); }} className="hover:text-white">Contact</a>
            <a href="#/tools" onClick={(event) => { event.preventDefault(); navigate('/tools'); }} className="hover:text-white">All Tools</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
