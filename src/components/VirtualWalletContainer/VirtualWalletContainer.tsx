import { useEffect, useState } from "react";
import PaymentModal from "../PaymentModal/PaymentModal";
import { getPendingByDepartment } from "../../ApiRepository/ApiRepository";
import type { JSX } from "react/jsx-runtime";

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

interface CommonsExpense {
  map(arg0: (expense: CommonsExpense) => JSX.Element): import("react").ReactNode;
  length: number;
  idGasto: number;
  monto: number;
  descripcion: string;
  mes: string;
  anio: number;
  estado: string;
}[];

const VirtualWallet = ({ user, setIsLoader }: { user: User | null, setIsLoader: (loading: boolean) => void }) => {


    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [commonsExpenses, setCommonsExpenses] = useState<CommonsExpense | null>(null);
    const [product, setProduct] = useState<ProductInfo | null>(null);

      interface ProductInfo {
        name: string;
        description: string;
        price: number;
        idCommonExpense: number;
      }
    
      interface ToClp {
        (number: number): string;
      }
    
      const toClp: ToClp = (number) =>
        number.toLocaleString("es-CL", { style: "currency", currency: "CLP" });
    
    
      const openModal = () => {
        setIsModalOpen(true);
      };
    
      const closeModal = (currentStep: number) => {
        if (currentStep === 4) {
          window.location.reload();
          return;
        }
        setIsModalOpen(false);
      };
    
      useEffect(() => {
        if (user) {
          setIsLoader(true);
          getPendingByDepartment(user.departamentos[0].idDepartamento)
            .then(response => {
                if (response.data.length === 0) {
                    setCommonsExpenses(null);
                    setIsLoader(false);
                    return;
                }
                const lastExpense = response.data[response.data.length - 1];
    
                setCommonsExpenses(response.data);
                setProduct({
                    name: `Pago ${lastExpense.mes} ${lastExpense.anio}`,
                    description: 'Pago de gastos comunes',
                    price: lastExpense.monto,
                    idCommonExpense: lastExpense.idGasto,
                });
                
            })
            .catch(error => {
              console.error('Error al obtener pendientes:', error);
            }).finally(() => {
              setIsLoader(false);
            });
        }
      }, []);

  return (
    <div className="payment-container">
        <div className="payment-card">
            <div className="header">
                        <div className="user-info">
                            <div className="username">
                               Dpto {user ? user.departamentos[0].numero : 'Invitado'}
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
            
          
            
                {
                (
                    <>
                    
                    <div className="payment-content">
                        <div className="payment-info">
                            <div className="total-label">Tu saldo total es</div>
                            <div className="total-amount">
                            {
                                '$50.000'
                            }
                            </div>
                            {/* <div className="additional-fee">+ $ 6.662 con pago en línea</div> */}
                        </div>

                    </div>
            
                    <button className={`pay-button ${!commonsExpenses && 'cursor-not-allowed opacity-50'}`} disabled={!commonsExpenses} onClick={openModal}>
                        🔒 Cargar billetera virtual
                    </button>
                    </>
                )
            }

            <div className="security-footer">
                <svg className="security-footer-icon pulse" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                Transacción protegida por certificados de seguridad bancaria
            </div>
        </div>

        {product !== null ? (
            <PaymentModal
                toClp={toClp}
                isOpen={isModalOpen}
                onClose={closeModal}
                product={product}
            />
        ) : null}
    </div>
  )
}

export default VirtualWallet