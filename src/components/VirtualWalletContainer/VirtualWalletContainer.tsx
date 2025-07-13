import { useState } from "react";
import PaymentModal from "../PaymentModal/PaymentModal";


interface ToClp {
  (number: number): string;
}

interface ProductInfo {
  name: string;
  description: string;
  price: number;
  idCommonExpense: number;
}

const VirtualWallet = () => {
    const [balance, setBalance] = useState(200000);
    const [amount, setAmount] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [product, setProduct] = useState<ProductInfo | null>(null);


  const toClp: ToClp = (number) =>
    number.toLocaleString("es-CL", { style: "currency", currency: "CLP" });

    const handleAddMoney = async () => {
        if (!amount || parseFloat(amount) <= 0) return;
        setProduct({
            name: 'Recarga de Billetera',
            description: 'Recarga de saldo en tu billetera virtual',
            price: parseFloat(amount),
            idCommonExpense: 0 // ID ficticio, no se usa en este caso
        });
        openModal();
        
        // setIsLoading(true);
        // // Simular una transacción
        setTimeout(() => {
            setBalance(prev => prev + parseFloat(amount));
            setAmount('');
            setIsLoading(false);
        }, 1000);
    };

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

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
            <div className="max-w-md mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Billetera Virtual</h1>
                    <p className="text-gray-600">Gestiona tu dinero de forma segura</p>
                </div>

                {/* Balance Card */}
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-200">
                    <div className="text-center">
                        <h2 className="text-lg font-medium text-gray-600 mb-2">Saldo Disponible</h2>
                        <div className="text-4xl font-bold text-wallet-green mb-4">
                            {toClp(balance)}
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                                className="bg-gradient-to-r from-wallet-green to-wallet-green-light h-2 rounded-full transition-all duration-500"
                                style={{ width: `${Math.min((balance / 5000) * 100, 100)}%` }}
                            ></div>
                        </div>
                    </div>
                </div>

                {/* Add Money Card */}
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Cargar Dinero</h3>
                    
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Cantidad a cargar
                            </label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                                <input
                                    type="number"
                                    value={toClp(Number(amount)).replace('$', '')}
                                    onChange={(e) => setAmount(e.target.value.replace(/\./g, '').replace(/,/g, '.'))}
                                    placeholder="20.000"
                                    className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-wallet-green focus:border-transparent"
                                    min="0"
                                />
                            </div>
                        </div>

                        {/* Quick Amount Buttons */}
                        <div>
                            <p className="text-sm font-medium text-gray-700 mb-2">Cantidades rápidas</p>
                            <div className="grid grid-cols-3 gap-2">
                                {[10000, 30000, 50000, 100000, 200000, 300000].map((quickAmount) => (
                                    <button
                                        key={quickAmount}
                                        onClick={() => setAmount(quickAmount.toString())}
                                        className="py-2 px-4 text-sm font-medium text-wallet-green border border-wallet-green rounded-lg hover:bg-wallet-green hover:text-white transition-colors duration-200"
                                    >
                                        {toClp(quickAmount)}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button
                            onClick={handleAddMoney}
                            disabled={!amount || parseFloat(amount) <= 0 || isLoading}
                            className={ `pay-button ${!amount && 'cursor-not-allowed opacity-50 pointer-events-none'}`}
                        >
                          Cargar Dinero
                        </button>
                    </div>
                </div>

                {product !== null ? (
                    <PaymentModal
                        toClp={toClp}
                        isOpen={isModalOpen}
                        onClose={closeModal}
                        product={product}
                        typeModal="wallet"
                    />
                ) : null}

                {/* Footer */}
                <div className="text-center mt-8">
                    <p className="text-sm text-gray-500">
                        🔒 Transacciones seguras y protegidas
                    </p>
                </div>
            </div>
        </div>
    );
}

export default VirtualWallet