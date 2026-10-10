import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import BriefBuilderModal from './components/BriefBuilderModal';
import AuthModal from './components/AuthModal';

import Landing from './pages/Landing';
import CreatorsDiscovery from './pages/CreatorsDiscovery';
import BriefsMarketplace from './pages/BriefsMarketplace';
import BrandDashboard from './pages/BrandDashboard';
import CreatorDashboard from './pages/CreatorDashboard';

function AppContent() {
  const [isBriefBuilderOpen, setIsBriefBuilderOpen] = useState(false);
  const { role } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      <Navbar onOpenBriefBuilder={() => setIsBriefBuilderOpen(true)} />

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Landing onOpenBriefBuilder={() => setIsBriefBuilderOpen(true)} />} />
          <Route path="/creators" element={<CreatorsDiscovery onInviteCreator={() => setIsBriefBuilderOpen(true)} />} />
          <Route path="/briefs" element={<BriefsMarketplace onOpenBriefBuilder={() => setIsBriefBuilderOpen(true)} />} />
          <Route path="/dashboard/brand" element={<BrandDashboard onOpenBriefBuilder={() => setIsBriefBuilderOpen(true)} />} />
          <Route path="/dashboard/creator" element={<CreatorDashboard />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer />

      {/* Global Brief Builder Modal */}
      <BriefBuilderModal
        isOpen={isBriefBuilderOpen}
        onClose={() => setIsBriefBuilderOpen(false)}
        onCreated={(brief) => {
          console.log('Brief Created:', brief);
        }}
      />

      {/* Global Auth Modal */}
      <AuthModal />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}
