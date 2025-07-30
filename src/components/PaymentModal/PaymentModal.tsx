// PaymentModal.tsx
import React, { useState, useEffect } from 'react';
import './PaymentModal.css';
import { putPaymentExpense, postChargerWallet } from '../../ApiRepository/ApiRepository';

interface PaymentData {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardName: string;
}

interface ProductInfo {
  name: string;
  description: string;
  price: number;
  idCommonExpense: number;
}

type PaymentStep = 1 | 2 | 3 | 4;

interface PaymentModalProps {
  isOpen: boolean;
  onClose: (currentStep: number) => void;
  product: ProductInfo;
  toClp: (number: number) => string;
  typeModal: 'payment' | 'wallet';
}

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, product, toClp, typeModal }) => {
  const [currentStep, setCurrentStep] = useState<PaymentStep>(1);
  const [paymentData, setPaymentData] = useState<PaymentData>({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: ''
  });
  const [ walletSaldo ] = useState<number>(200000);

  // Reset modal state when opened
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(1);
      setPaymentData({
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        cardName: ''
      });
    }
  }, [isOpen]);

  // Close modal with Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose(currentStep);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Format card number
  const formatCardNumber = (value: string): string => {
    return value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
  };

  // Format expiry date
  const formatExpiryDate = (value: string): string => {
    return value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2');
  };

  // Handle input changes
  const handleInputChange = (field: keyof PaymentData, value: string) => {
    let formattedValue = value;

    switch (field) {
      case 'cardNumber':
        formattedValue = formatCardNumber(value);
        if (formattedValue.length > 19) return; // Max length for formatted card number
        break;
      case 'expiryDate':
        formattedValue = formatExpiryDate(value);
        if (formattedValue.length > 5) return; // Max length for MM/YY
        break;
      case 'cvv':
        formattedValue = value.replace(/\D/g, '');
        if (formattedValue.length > 3) return; // Max length for CVV
        break;
    }

    setPaymentData(prev => ({
      ...prev,
      [field]: formattedValue
    }));
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (typeModal === 'payment') {
      
    // Show processing step
      setCurrentStep(3);
      putPaymentExpense(product.idCommonExpense, 'Pagado')
        .then(() => {
          setCurrentStep(4);
        })
        .catch(error => {
          console.error('Error al procesar el pago:', error);
          alert('Error al procesar el pago. Inténtalo de nuevo más tarde.');
          setCurrentStep(1);
        });
    }

    if (typeModal === 'wallet') {
      const { cardNumber, expiryDate, cvv, cardName } = paymentData;

      if (!cardNumber || !expiryDate || !cvv || !cardName) {
        alert('Por favor completa todos los campos');
        return;
      }
      setCurrentStep(3);
      console.log('Procesando pago en billetera virtual...');
      const userStr = sessionStorage.getItem('user');
      const userSession = userStr ? JSON.parse(userStr) : null;
      console.log('Usuario:', userSession);
      
      if (userSession) {
        postChargerWallet(userSession.rutUsuario, product.price)
         .then((res) => {
           setCurrentStep(4);
           console.log('Carga de billetera exitosa:', res.data);
           userSession.saldoBilletera = res.data;
           sessionStorage.setItem('user', JSON.stringify(userSession));
         });
      }
    }

  };

  // Handle overlay click
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose(currentStep);
    }
  };

  // Step navigation
  const goToStep = (step: PaymentStep) => {
    setCurrentStep(step);
  };

  // Render step indicators
  const renderStepIndicators = () => {
    const steps = [
      { number: 1, label: 'Producto' },
      { number: 2, label: 'Pago' },
      { number: 3, label: 'Éxito' }
    ];

    return (
      <div className="step-indicators">
        <div className="step-indicators-container">
          {steps.map((step, index) => (
            <React.Fragment key={step.number}>
              <div className="step-indicator">
                <div className={`step-circle ${currentStep >= step.number ? 'active' : 'inactive'}`}>
                  {step.number}
                </div>
                <span className={`step-label ${currentStep >= step.number ? 'active' : ''}`}>
                  {step.label}
                </span>
              </div>
              {index < steps.length - 1 && <div className="step-line" />}
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  };

  // Render step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="step-content">
            <div className="product-icon">
              <svg fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"></path>
              </svg>
            </div>
            <h3 className="product-title">{product.name}</h3>
            <p className="product-description">{product.description}</p>
            <div className="price-container">
              <div className="price-row">
                <span className="price-label">Monto a {typeModal === 'payment' ? 'pagar' : 'cargar'}:</span>
                <span className="price-amount">{toClp(product.price)}</span>
              </div>
            </div>
            <button
              className="btn btn-primary btn-full"
              onClick={() => goToStep(2)}
            >
              Continuar al Pago
            </button>
          </div>
        );

      case 2:
        return (
          <div className="step-content">
            { typeModal === 'wallet' ?
            (<form className="payment-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Número de Tarjeta</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="1234 5678 9012 3456"
                  value={paymentData.cardNumber}
                  onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                  required
                />
              </div>
              <div className="form-group-row">
                <div>
                  <label className="form-label">Fecha de Vencimiento</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="MM/AA"
                    value={paymentData.expiryDate}
                    onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="form-label">CVV</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="123"
                    value={paymentData.cvv}
                    onChange={(e) => handleInputChange('cvv', e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Nombre en la Tarjeta</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Juan Pérez"
                  value={paymentData.cardName}
                  onChange={(e) => handleInputChange('cardName', e.target.value)}
                  required
                />
              </div>
              <div className="form-buttons">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => goToStep(1)}
                >
                  Volver
                </button>
                <button type="submit" className="btn btn-success">
                  Procesar Carga
                </button>
              </div>
            </form>)
            :
            (<>
            <form onSubmit={handleSubmit}>
              <div className={`bg-primary no-underline rounded-xl shadow-lg p-6 flex flex-col items-center`}>
                <div className="rounded-full bg-white p-3 mb-4">
                    <i className={`ri-wallet-3-line text-2xl`}></i>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Billetera Virtual</h3>
                <p className="text-white text-sm text-center">Saldo: {toClp(walletSaldo)}</p>
              </div>
              {
                walletSaldo < product.price && (
                  <div className="alert alert-warning text-red-500">
                    <i className="ri-alert-line"></i>
                    <span>Saldo insuficiente para realizar el pago</span>
                  </div>
                )
              }
              <div className="form-buttons">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => goToStep(1)}
                  >
                    Volver
                  </button>
                  <button 
                    type="submit"
                    disabled={walletSaldo < product.price}
                    className={`btn btn-success ${walletSaldo < product.price && 'cursor-not-allowed opacity-50 pointer-events-none'}`}>
                    Procesar Pago
                  </button>
                </div>
              </form>
            </>)
            }
          </div>
        );

      case 3:
        return (
          <div className="step-content">
            <div className="processing-spinner"></div>
            <h3 className="processing-title">Procesando Pago...</h3>
            <p className="processing-description">Por favor espere mientras verificamos su información</p>
          </div>
        );

      case 4:
        return (
          <div className="step-content">
            <div className="success-icon">
              <svg fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
              </svg>
            </div>
            <h3 className="success-title">¡Pago Exitoso!</h3>
            <p className="success-description">Tu pago se ha procesado correctamente</p>
            <div className="receipt">
              <div className="receipt-item">
                <span>Producto:</span>
                <span>{product.name}</span>
              </div>
              {
                typeModal === 'payment' && (
                  <div className="receipt-item">
                    <span>Precio:</span>
                    <span>{toClp(product.price)}</span>
                  </div>
                )
              }
              <div className="receipt-item total">
                <span>Total:</span>
                <span>{toClp(product.price)}</span>
              </div>
            </div>
            <button className="btn btn-primary btn-full" onClick={() => onClose(4)}>
              Continuar
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">Proceso de Pago</h2>
          <button className="close-btn" onClick={() => onClose(currentStep)}>
            &times;
          </button>
        </div>
        {renderStepIndicators()}
        <div className="modal-body">
          {renderStepContent()}
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;