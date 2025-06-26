import { useState } from "react";
import { NavLink } from "react-router-dom";

interface NavbarProps {
  hasOptions: boolean;
  logout?: () => void;
};

const Navbar = ({hasOptions, logout}: NavbarProps) => {
  const [showMenu, setShowMenu] = useState<boolean>(false);

  const isProd: boolean = window.location.hostname !== 'localhost';

  return (
        <nav>
            <div className="nav-container">
                <div className="nav-title">
                    <NavLink to="/" > 
                        <img src={isProd ? "/logoComunidadInfeliz.png" : "../public/logoComunidadInfeliz.png"} alt="" className='nav-logo'/>
                    </NavLink>
                    Comunidad Infeliz
                </div>
                {
                    hasOptions && (
                        <>
                            <button className={`hamburger d-md-none`} onClick={(): void => setShowMenu(!showMenu)}>☰</button>
                            <div className="nav-links desktop-menu">
                                <NavLink to="/billetera-virtual" > Billetera virtual </NavLink>
                                <NavLink to="/pagar-ggcc" > Pagar Gasto Común </NavLink>
                                <NavLink to="/pagar-multa" > Pagar multa </NavLink>
                                <NavLink to="#" onClick={logout}> Cerrar sesion </NavLink>
                            </div>
                        </>
                    )
                }
                
            </div>

            {
                hasOptions && (
                    <div className={`nav-links mobile-menu ${showMenu ? 'd-flex' : 'd-md-none'}`} >
                        <NavLink to="/billetera-virtual" > Billetera virtual </NavLink>
                        <NavLink to="/pagar-ggcc" > Pagar Gasto Común </NavLink>
                        <NavLink to="/pagar-multa" > Pagar multa </NavLink>
                        <NavLink to="#" onClick={logout}> Cerrar sesion </NavLink>
                    </div>
                )
            }

            
        </nav>
  )
}

export default Navbar