import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function DashboardLayout() {
  return (
    <div style={{ display:'flex', height:'100vh', overflow:'hidden', background:'#f5ebe8' }}>
      <Sidebar />
      <main style={{ flex:1, overflowY:'auto', padding:'36px 44px', background:'#f5ebe8' }}>
        <Outlet />
      </main>
    </div>
  );
}