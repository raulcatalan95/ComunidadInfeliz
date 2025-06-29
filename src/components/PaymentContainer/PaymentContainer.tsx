import { useEffect, useState } from "react";
import PaymentModal from "../PaymentModal/PaymentModal";
import { getPendingByDepartment } from "../../ApiRepository/ApiRepository";

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


  interface ProductInfo {
    name: string;
    description: string;
    price: number;
  }

  interface ToClp {
    (number: number): string;
  }

  const toClp: ToClp = (number) =>
    number.toLocaleString("es-CL", { style: "currency", currency: "CLP" });


  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    if (user) {
      setIsLoader(true);
      getPendingByDepartment(user.departamentos[0].idDepartamento)
        .then(response => {
          setMonth(response.data[response.data.length - 1].mes);
          setYear(response.data[response.data.length - 1].anio);
          setTotal(response.data[response.data.length - 1].monto);
          setCommonsExpenses(response.data);
          setProduct({
            name: `Pago ${response.data[response.data.length - 1].mes} ${response.data[response.data.length - 1].anio}`,
            description: 'Pago de gastos comunes',
            price: response.data[response.data.length - 1].monto,
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
                        {user ? `Dpto ${user.departamentos[0].numero}` : 'Invitado'}
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

            <div className="payment-period">
                <div className="period-label">Período de Pago</div>
                <div className="period-date">{month} {year} - Cuota de Administración</div>
            </div>

            <div className="payment-content">
                <div className="payment-info">
                    <div className="total-label">Tu total a pagar es de</div>
                    <div className="total-amount">
                        <span className="currency"></span> {toClp(total)}
                    </div>
                    {/* <div className="additional-fee">+ $ 6.662 con pago en línea</div> */}
                </div>

                <div className="payment-breakdown">
                    <div className="breakdown-item">
                        <span className="breakdown-label">Cuota base de administración</span>
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

            <button className="pay-button" onClick={openModal}>
                🔒 Pagar en línea
            </button>

            <div className="security-footer">
                <svg className="security-footer-icon pulse" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                Transacción protegida por certificados de seguridad bancaria
            </div>
        </div>

        {product && (
            <PaymentModal
                isOpen={isModalOpen}
                onClose={closeModal}
                product={product}
            />
        )}
    </div>

  )
}

export default PaymentContainer