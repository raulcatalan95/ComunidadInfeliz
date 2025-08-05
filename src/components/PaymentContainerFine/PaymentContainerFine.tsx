import { useEffect, useState } from "react";
import PaymentModal from "../PaymentModal/PaymentModal";
import { getPendingFine } from "../../ApiRepository/ApiRepository";
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
  idMulta: number;
  monto: number;
  descripcion: string;
  mes: string;
  anio: number;
  estado: string;
}[];

const PaymentContainerFine = ({ user, setIsLoader }: { user: User | null, setIsLoader: (loading: boolean) => void }) => {

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [commonsExpenses, setCommonsExpenses] = useState<CommonsExpense | null>(null);
  const [total, setTotal] = useState<number>(0);
  const [product, setProduct] = useState<ProductInfo | null>(null);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [expenseSelected, setExpenseSelected] = useState<CommonsExpense | null>(null);


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
      getPendingFine()
        .then(response => {
            if (response.data.length === 0) {
                setCommonsExpenses(null);
                setIsLoader(false);
                return;
            }
            const lastExpense = response.data[response.data.length - 1];
            setTotal(lastExpense.monto);
            setExpenseSelected(lastExpense);
            setCommonsExpenses(response.data);
            setProduct({
                name: `Pago Multa`,
                description: 'Pago de Multa',
                price: lastExpense.monto,
                idCommonExpense: lastExpense.idMulta,
            });
            const totalAmount: number = response.data.reduce((acc: number, expense: CommonsExpense) => acc + expense.monto, 0);
            setTotalAmount(totalAmount);
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
        <div className="payment-card max-w-xl mx-auto ">
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
                commonsExpenses && commonsExpenses.length > 1 && (
                    <h3 className="text-gray-500 font-semibold mb-4">Selecciona la multa a pagar: </h3>
                )
            }
            { 
                commonsExpenses && commonsExpenses.length > 0 && (
                    commonsExpenses.map((expense: CommonsExpense) => {
                        return (
                            <div
                                key={expense.idMulta}
                                className={`payment-period border-left-none transition-transform duration-300 transform hover:scale-100 cursor-pointer hover:shadow-xl ${expense.idMulta === expenseSelected?.idMulta ? 'active' : ''}`}
                                onClick={() => {
                                    // event.currentTarget.classList.toggle('active');
                                    setExpenseSelected(expense);
                                    setTotal(expense.monto);
                                    setProduct({
                                        name: `Pago ${expense.mes} ${expense.anio}`,
                                        description: 'Pago de gastos comunes',
                                        price: expense.monto,
                                        idCommonExpense: expense.idMulta,
                                    });
                                }}

                                >
                                <div className="period-label">Multa</div>
                                <div className="period-date">Total {toClp(expense.monto)}</div>
                            </div>
                        )
                    })
                )}
                {
                    !commonsExpenses  &&
                (
                    <div className="no-expenses flex flex-col items-center justify-center">
                        <div className="success-icon">
                            <svg fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                            </svg>
                        </div>
                        No hay multas pendientes
                    </div>
                )}
            
                {
                commonsExpenses &&  
                (
                    <>
                    
                    <div className="payment-content">
                        <div className="payment-info">
                            <div className="total-label">Tu deuda total es de</div>
                            <div className="total-amount">
                            {
                                toClp(totalAmount)
                            }
                            </div>
                            {/* <div className="additional-fee">+ $ 6.662 con pago en línea</div> */}
                        </div>

                        <div className="payment-breakdown">
                            <div className="breakdown-item">
                                <span className="breakdown-label">Pagar multa</span>
                                <span className="breakdown-amount">{toClp(total)}</span>
                            </div>
                            {/* <div className="breakdown-item">
                                <span className="breakdown-label">Comisión pago en línea (2.7%)</span>
                                <span className="breakdown-amount">$ 6.662</span>
                            </div> */}
                            <div className="breakdown-item breakdown-total">
                                <span className="breakdown-label">Total a pagar</span>
                                <span className="breakdown-amount">{toClp(total)}</span>
                            </div>
                        </div>

                        {/* <div className="payment-methods">
                            <div className="methods-title">Métodos de pago aceptados</div>
                            <div className="methods-grid">
                                <div className="method-icon visa">VISA</div>
                                <div className="method-icon mastercard">MC</div>
                                <div className="method-icon">AMEX</div>
                                <div className="method-icon pse">PSE</div>
                                <div className="method-icon">NEQUI</div>
                            </div>
                        </div> */}
                    </div>
            
                    <button className={`pay-button ${!commonsExpenses && 'cursor-not-allowed opacity-50'}`} disabled={!commonsExpenses} onClick={openModal}>
                        Pagar en línea
                    </button>
                    </>
                )
            }
            {
                commonsExpenses && commonsExpenses.length > 0 && (
            <div className="security-footer">
                🔒 Transacciones seguras y protegidas
            </div>
                )
            }
        </div>

        {product !== null ? (
            <PaymentModal
                toClp={toClp}
                isOpen={isModalOpen}
                onClose={closeModal}
                product={product}
                typeModal="paymentFine"
            />
        ) : null}
    </div>

  )
}

export default PaymentContainerFine