import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { AlignLeft } from 'lucide-react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
  showSidebar?: boolean;
  sidebarRole?: 'patient' | 'doctor' | 'admin';
}

export function Layout({ children, showSidebar = false, sidebarRole }: LayoutProps) {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#e8eef5' }}>
      <Header />
      {showSidebar && sidebarRole && (
        <>
          {/* Mobile hamburger button for sidebar */}
          <button
            className="md:hidden fixed bottom-4 left-4 z-40 p-3 rounded-full bg-primary-500 text-white shadow-lg"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar"
          >
            <AlignLeft className="w-5 h-5" />
          </button>
          <Sidebar
            role={sidebarRole}
            currentPath={location.pathname}
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />
        </>
      )}
      <main className={`flex-1 ${showSidebar ? 'md:ml-60' : ''}`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
