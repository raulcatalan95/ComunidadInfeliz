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

const PaymentContainer = ({ user, setIsLoader }: { user: User | null, setIsLoader: (loading: boolean) => void }) => {

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [commonsExpenses, setCommonsExpenses] = useState<CommonsExpense | null>(null);
  const [month, setMonth] = useState<string | null>(null);
  const [year, setYear] = useState<number | null>(null);
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
      getPendingByDepartment(user.departamentos[0].idDepartamento)
        .then(response => {
            if (response.data.length === 0) {
                setCommonsExpenses(null);
                setIsLoader(false);
                return;
            }
            const lastExpense = response.data[response.data.length - 1];

            setMonth(lastExpense.mes);
            setYear(lastExpense.anio);
            setTotal(lastExpense.monto);
            setExpenseSelected(lastExpense);
            setCommonsExpenses(response.data);
            setProduct({
                name: `Pago ${lastExpense.mes} ${lastExpense.anio}`,
                description: 'Pago de gastos comunes',
                price: lastExpense.monto,
                idCommonExpense: lastExpense.idGasto,
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
                commonsExpenses && commonsExpenses.length > 0 ? (
                    commonsExpenses.map((expense: CommonsExpense) => {
                        return (
                            <div
                                key={expense.idGasto}
                                className={`payment-period border-left-none transition-transform duration-300 transform hover:scale-100 cursor-pointer hover:shadow-xl ${expense.idGasto === expenseSelected?.idGasto ? 'active' : ''}`}
                                onClick={() => {
                                    // event.currentTarget.classList.toggle('active');
                                    setExpenseSelected(expense);
                                    setMonth(expense.mes);
                                    setYear(expense.anio);
                                    setTotal(expense.monto);
                                    setProduct({
                                        name: `Pago ${expense.mes} ${expense.anio}`,
                                        description: 'Pago de gastos comunes',
                                        price: expense.monto,
                                        idCommonExpense: expense.idGasto,
                                    });
                                }}

                                >
                                <div className="period-label">Período de Pago {expense.mes} {expense.anio}</div>
                                <div className="period-date">Total {toClp(expense.monto)}</div>
                            </div>
                        )
                    })
                ) : (
                    <div className="no-expenses flex flex-col items-center justify-center">
                        <div className="success-icon">
                            <svg fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                            </svg>
                        </div>
                        No hay gastos comunes pendientes
                    </div>
                )}
            
                {
                commonsExpenses &&  (
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
                                <span className="breakdown-label">Pagar cuota - {month} {year}</span>
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
                        🔒 Pagar en línea
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

export default PaymentContainer