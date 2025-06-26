import { useState } from "react";
import PaymentModal from "../PaymentModal/PaymentModal";

const PaymentContainer = () => {

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  interface ProductInfo {
    name: string;
    description: string;
    price: number;
  }

  const product: ProductInfo = {
    name: 'Pago en Comunidad Infeliz',
    description: 'Pago Rapido',
    price: 239.411
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (

    <div className="payment-container">

        <div className="payment-card">
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

            <div className="payment-period">
                <div className="period-label">Período de Pago</div>
                <div className="period-date">Junio 2025 - Cuota de Administración</div>
            </div>

            <div className="payment-content">
                <div className="payment-info">
                    <div className="total-label">Tu total a pagar es de</div>
                    <div className="total-amount">
                        <span className="currency">$</span> 239.411
                    </div>
                    {/* <div className="additional-fee">+ $ 6.662 con pago en línea</div> */}
                </div>

                <div className="payment-breakdown">
                    <div className="breakdown-item">
                        <span className="breakdown-label">Cuota base de administración</span>
                        <span className="breakdown-amount">$ 239.411</span>
                    </div>
                    <div className="breakdown-item">
                        <span className="breakdown-label">Comisión pago en línea (2.7%)</span>
                        <span className="breakdown-amount">$ 6.662</span>
                    </div>
                    <div className="breakdown-item breakdown-total">
                        <span className="breakdown-label">Total a pagar</span>
                        <span className="breakdown-amount">$ 246.073</span>
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

        <PaymentModal
            isOpen={isModalOpen}
            onClose={closeModal}
            product={product}
        />
    </div>

  )
}

export default PaymentContainer