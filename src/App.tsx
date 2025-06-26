import { useState } from 'react'
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import PaymentContainer from './components/PaymentContainer/PaymentContainer';
import VirtualWalletContainer from './components/VirtualWalletContainer/VirtualWalletContainer';
import Login from './components/Login/Login';
import ProtectedRoutes from './components/ProtectedRoutes/ProtectedRoutes';
import './App.css'
import 'remixicon/fonts/remixicon.css';
import Home from './components/Home/Home';

interface User {
  email: string;
}

function App() {

  const [user, setUser] = useState<User | null>(sessionStorage.getItem('user') ? JSON.parse(sessionStorage.getItem('user') as string) : null);

  const handleLogin = (userData: User | null): void => {
      setUser(userData);
      if (userData) {
        sessionStorage.setItem('user', JSON.stringify(userData));
      }
  };
  
  const handleLogout = () => {
      setUser(null);
      sessionStorage.removeItem('user');
      window.location.href = '/login';
  };

  return (
    <>
      <BrowserRouter>
        {
            <>
              <Navbar hasOptions={!!user} logout={handleLogout}/>
              
              <Routes>
                <Route element={<ProtectedRoutes canActivate={!!user} redirectPath={'/login'}/>} >
                  <Route path={'/'} element={<Home user={user} />}></Route>
                  <Route path={'/billetera-virtual'} element={<VirtualWalletContainer/>}></Route>
                  <Route path={'/pagar-ggcc'} element={<PaymentContainer />}></Route>
                </Route>
                <Route element={<ProtectedRoutes canActivate={!user} redirectPath={'/'} />} >
                  <Route path={'/login'} element={<Login onLogin={handleLogin} />}></Route>
                </Route>
              </Routes>
            </>
        }
      </BrowserRouter>

      
    </>
  )
}

export default App
