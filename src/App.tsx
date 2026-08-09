import React, { useState } from 'react';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import DashboardScreen from './screens/DashboardScreen';
import ChallanScreen from './screens/ChallanScreen';
import MapScreen from './screens/MapScreen';
import AboutScreen from './screens/AboutScreen';
import SOSOverlay from './components/SOSOverlay';
import PaymentModal from './components/PaymentModal';
import Toast from './components/Toast';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  
  const [sosActive, setSosActive] = useState(false);
  const [crashCooldown, setCrashCooldown] = useState(false);
  
  const [payModal, setPayModal] = useState<{ isOpen: boolean; id: string; amount: number; reason: string }>({
    isOpen: false, id: '', amount: 0, reason: ''
  });

  const showToast = (msg: string) => {
    setToastMsg(msg);
  };

  const triggerSOS = () => {
    if (crashCooldown) return;
    setCrashCooldown(true);
    setSosActive(true);
  };

  const cancelSOS = () => {
    setSosActive(false);
    showToast("✅ SOS cancelled. Glad you're safe!");
    setTimeout(() => setCrashCooldown(false), 15000);
  };

  const sendSOS = () => {
    setSosActive(false);
    showToast('🆘 Emergency SOS sent to contacts & nearest hospital!');
    setTimeout(() => setCrashCooldown(false), 45000);
  };

  const openPay = (id: string, amount: number, reason: string) => {
    setPayModal({ isOpen: true, id, amount, reason });
  };

  const confirmPay = () => {
    setPayModal({ ...payModal, isOpen: false });
    showToast('✅ Payment successful! Challan cleared.');
    // In a real app we'd update the Challan state globally, but for UI mockup this is fine
  };

  return (
    <>
      <Header onSOSClick={triggerSOS} />
      
      {activeTab === 'dashboard' && <DashboardScreen goToTab={setActiveTab} triggerSOS={triggerSOS} showToast={showToast} />}
      {activeTab === 'challan' && <ChallanScreen showToast={showToast} onPay={openPay} />}
      {activeTab === 'maps' && <MapScreen showToast={showToast} triggerSOS={triggerSOS} crashCooldown={crashCooldown} />}
      {activeTab === 'about' && <AboutScreen />}
      
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <SOSOverlay isActive={sosActive} onCancel={cancelSOS} onSend={sendSOS} />
      <PaymentModal 
        isOpen={payModal.isOpen} 
        onClose={() => setPayModal({ ...payModal, isOpen: false })} 
        onConfirm={confirmPay}
        amount={payModal.amount}
        reason={payModal.reason}
      />
      <Toast message={toastMsg} onClose={() => setToastMsg(null)} />
    </>
  );
};

export default App;
