import React from "react";
import { AppProvider, useApp, VIEWS } from "./context/AppContext";
import Sidebar from "./components/Sidebar";
import TopBar from "./components/TopBar";
import Dashboard from "./views/Dashboard";
import PriorityQueue from "./views/PriorityQueue";
import OverlapDetection from "./views/OverlapDetection";
import InstitutionProfile from "./views/InstitutionProfile";
import CaseDetailView from "./views/CaseDetailView";
import Reports from "./views/Reports";
import CaseDetailDrawer from "./components/CaseDetailDrawer";
import NewCaseModal from "./components/NewCaseModal";

function AppContent() {
  const { currentView, caseDetailOpen } = useApp();

  const renderView = () => {
    switch (currentView) {
      case VIEWS.DASHBOARD:
        return <Dashboard />;
      case VIEWS.PRIORITY_QUEUE:
        return <PriorityQueue />;
      case VIEWS.OVERLAP_DETECTION:
        return <OverlapDetection />;
      case VIEWS.INSTITUTION_PROFILE:
        return <InstitutionProfile />;
      case VIEWS.CASE_DETAIL:
        return <CaseDetailView />;
      case VIEWS.REPORTS:
        return <Reports />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 overflow-hidden font-sans antialiased">
      {/* Left Sidebar navigation (Slate-900) */}
      <Sidebar />

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-slate-50">
        <TopBar />
        <main className="flex-1 overflow-y-auto p-6 lg:p-8 bg-slate-50">
          <div className="max-w-7xl mx-auto">
            {renderView()}
          </div>
        </main>
      </div>

      {/* Slide-over right drawer for action history */}
      {caseDetailOpen && <CaseDetailDrawer />}
      <NewCaseModal />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
