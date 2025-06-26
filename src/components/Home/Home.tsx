import CardHome from "../CardHome/CardHome";

interface User {
    email: string;
}

interface HomeProps {
    user: User | null;
}

const Home = ({ user }: HomeProps) => {
    return (
        <div className="min-h-screen bg-gray-100">
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                
                {/* Sección de bienvenida */}
                <div className="px-4 py-6 sm:px-0">
                    <div className="header">
                        <div className="user-info">
                            <div className="username">
                                Depto129
                                {/* <div className="dropdown-arrow"></div> */}
                            </div>
                            <div className="community">Comunidad Infeliz</div>
                        </div>
                        <div className="avatar">
                            <svg className="avatar-icon" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                            </svg>
                        </div>
                    </div>
                    <div className="payment-period rounded-lg shadow-md p-6 mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">
                            Bienvenido, {user ? user.email.split('@')[0] : 'Invitado'}
                        </h2>
                        <p className="text-gray-500 mt-1">Accede rápidamente a nuestros servicios</p>
                    </div>
                    
                    {/* Cards de servicios */}
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Servicios disponibles</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <CardHome
                            icon="ri-building-line" 
                            title="Pagar GGCC" 
                            description="Realice sus pagos de gastos comunes de manera rápida y segura" 
                            bgColor="bg-primary" 
                        />
                        <CardHome
                            icon="ri-wallet-3-line" 
                            title="Billetera Virtual" 
                            description="Administre su dinero y realice transferencias entre cuentas" 
                            bgColor="bg-primary" 
                        />
                        <CardHome
                            icon="ri-shake-hands-fill" 
                            title="Pagar Multa" 
                            description="Gestione y pague sus multas pendientes en línea" 
                            bgColor="bg-primary" 
                        />
                    </div>
                    
                    {/* Actividad reciente */}
                    {/* <div className="bg-white shadow rounded-lg p-6 mb-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Actividad reciente</h3>
                        <div className="border-t border-gray-200 pt-4">
                            <ul className="divide-y divide-gray-200">
                                <li className="py-3 flex justify-between">
                                    <div className="flex items-center">
                                        <i className="ri-checkbox-circle-line text-green-500 mr-2"></i>
                                        <span className="text-sm text-gray-700">Pago exitoso de GGCC</span>
                                    </div>
                                    <span className="text-sm text-gray-500">Hace 2 días</span>
                                </li>
                                <li className="py-3 flex justify-between">
                                    <div className="flex items-center">
                                        <i className="ri-wallet-3-line text-blue-500 mr-2"></i>
                                        <span className="text-sm text-gray-700">Recarga de billetera virtual</span>
                                    </div>
                                    <span className="text-sm text-gray-500">Hace 5 días</span>
                                </li>
                                <li className="py-3 flex justify-between">
                                    <div className="flex items-center">
                                        <i className="ri-alert-line text-yellow-500 mr-2"></i>
                                        <span className="text-sm text-gray-700">Notificación de multa pendiente</span>
                                    </div>
                                    <span className="text-sm text-gray-500">Hace 1 semana</span>
                                </li>
                            </ul>
                        </div>
                        <div className="mt-4">
                            <a href="#" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">Ver todo el historial →</a>
                        </div>
                    </div> */}
                    
                    {/* Información útil */}
                    <div className="bg-white shadow rounded-lg p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Información útil</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="border border-gray-200 rounded p-4 flex items-start">
                                <i className="ri-customer-service-2-line text-xl text-indigo-600 mr-3 mt-0.5"></i>
                                <div>
                                    <h4 className="font-medium text-gray-800 mb-1">Atención al cliente</h4>
                                    <p className="text-sm text-gray-600">Lunes a viernes de 9:00 a 18:00 hrs.</p>
                                    <p className="text-sm text-gray-600">contacto@comunidadInfeliz.com</p>
                                </div>
                            </div>
                            <div className="border border-gray-200 rounded p-4 flex items-start">
                                <i className="ri-file-text-line text-xl text-indigo-600 mr-3 mt-0.5"></i>
                                <div>
                                    <h4 className="font-medium text-gray-800 mb-1">Preguntas frecuentes</h4>
                                    <p className="text-sm text-gray-600">Consulte nuestra sección de ayuda para resolver sus dudas.</p>
                                    <a href="#" className="text-sm text-indigo-600 hover:underline">Ver más</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            
            {/* <footer className="bg-white shadow-inner py-4 mt-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <p className="text-center text-sm text-gray-500">© 2025 Portal de Pagos. Todos los derechos reservados.</p>
                </div>
            </footer> */}
        </div>
    );
}

export default Home