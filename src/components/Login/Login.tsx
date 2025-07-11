import { useState } from "react";
import { authUser } from "../../ApiRepository/ApiRepository";

interface User {
  rut: string;
  nombre: string;
  correo: string;
  departamentos: {
    idDepartamento: number;
    numero: string;
    torre: string;
    piso: number;
  }[];
}

interface Props {
  onLogin: (user: User) => void;
  setIsLoader: (isLoading: boolean) => void;
};

const Login = ({ onLogin, setIsLoader }: Props) => {

    const [rut, setRut] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');

    /**
     * Maneja el envío del formulario de login
     * @param {React.FormEvent} e - Evento de formulario
     */
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
        setIsLoader(true);
        e.preventDefault();
        if (!rut || !password) {
            setError('Por favor ingrese Rut y contraseña');
            return;
        }

        authUser(rut, password)
            .then(response => {
                if (response.data) {
                    // Simulación de login exitoso
                    console.log('Login exitoso:', response);
                    onLogin(response.data);
                }
            }).catch(error => {
                console.error('Error al autenticar:', error);
                setError('Rut o contraseña incorrectos');
            }).finally(() => {
                setIsLoader(false);
            });
    };

    return (
        <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Comunidad Infeliz
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Ingrese sus credenciales para acceder
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <input type="hidden" name="remember" value="true" />
                    <div className="rounded-md -space-y-px">
                        <div className="mb-4">
                            <label htmlFor="rut" className="sr-only">RUT</label>
                            <input
                                id="rut"
                                name="rut"
                                type="text"
                                autoComplete="username"
                                required
                                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="RUT"
                                value={rut}
                                onChange={(e) => setRut(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">Contraseña</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Contraseña"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="text-red-500 text-sm text-center">
                            {error}
                        </div>
                    )}

                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <input
                                id="remember-me"
                                name="remember-me"
                                type="checkbox"
                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                            />
                            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                                Recordarme
                            </label>
                        </div>

                        <div className="text-sm">
                            <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                                ¿Olvidó su contraseña?
                            </a>
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="pay-button"
                        >
                            Ingresar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Login