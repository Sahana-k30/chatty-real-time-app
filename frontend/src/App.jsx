import Navbar from './components/Navbar';
import { Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Routes,Route } from 'react-router-dom';
import Home from './pages/Home';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import {useAuthStore} from './store/useAuthStore';
import {Loader} from 'lucide-react';
import { Toaster } from 'react-hot-toast';

import './App.css'
import { useThemeStore } from './store/useThemeStore';

function App() {
  const {authUser,checkAuth, isCheckingAuth,onlineUsers}=useAuthStore();
  const {theme}=useThemeStore();

  console.log({onlineUsers});
  
  useEffect(()=>{
    checkAuth();
  },[checkAuth]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);
  

  if(isCheckingAuth && !authUser){
    return(
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin"/>
      </div>
    )
  }

  return (
    <>
    <div>
      <Navbar/>

      <Routes>
        <Route path="/" element={authUser ? <Home/> : <Navigate to="/login"/>}/>
        <Route path="/signup" element={!authUser ? <Signup/>: <Navigate to="/"/>}/>
        <Route path="/login" element={!authUser ? <Login/> :  <Navigate to="/"/>}/>
        <Route path="/settings" element={<Settings/>}/>
        <Route path="/profile" element={authUser ? <Profile/>: <Navigate to="/login"/>}/>
      </Routes>

      <Toaster/>

    </div>
    
    </>
  )
}

export default App
