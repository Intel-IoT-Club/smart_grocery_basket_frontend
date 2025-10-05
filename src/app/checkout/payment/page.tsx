'use client';

import { useState, useEffect } from 'react';
import { useCart } from '@/hooks/useCart';
import { calculateBasketTotals } from '@/utils/index';
// You will need to create a paymentService in services/api.ts for a real transaction
// import { paymentService } from '@/services/api';

export default function PaymentPage() {
  const { cartItems } = useCart();
  const { total } = calculateBasketTotals(cartItems);

  // Maintain consistent tax calculation with the bill page
  const tax = total * 0.05;
  const finalTotal = total + tax;

  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // This function will eventually call your backend to create a secure, unique transaction.
    const fetchPaymentDetails = async () => {
      // Don't attempt to generate a QR code if the cart is empty.
      if (finalTotal <= 0) {
        setLoading(false);
        return;
      }
      
      setLoading(true);
      try {
        // TODO: Replace this simulation with a real API call to your backend.
        // const response = await paymentService.createTransaction({ amount: finalTotal });
        // setQrCodeUrl(response.data.qrCodeUrl); // Use the secure URL from your backend

        // For now, we continue to simulate QR generation, but now with the REAL total.
        const upiId = "store-upi-id@okhdfcbank"; // This would also come from your backend config
        const upiUrl = `upi://pay?pa=${upiId}&pn=BaskIT%20Store&am=${finalTotal.toFixed(2)}&cu=INR&tn=BaskITOrder${Date.now()}`;
        setQrCodeUrl(`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(upiUrl)}`);

      } catch (error) {
        console.error("Failed to create payment transaction:", error);
        // You could set an error state here to show a message to the user
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentDetails();
  }, [finalTotal]); // The effect re-runs if the total amount changes.

  return (
    <div className="min-h-screen bg-gray-950 flex justify-center items-center p-4">
      <div className="w-full max-w-sm bg-gray-900 border border-gray-800 rounded-2xl p-8 text-center">
        <h1 className="text-2xl font-bold text-white mb-2">Complete Your Payment</h1>
        <p className="text-gray-400 mb-6">Scan the QR code using any UPI app.</p>

        <div className="w-[250px] h-[250px] mx-auto bg-gray-800 rounded-lg flex items-center justify-center">
          {loading ? (
            <div className="text-gray-400">Generating QR Code...</div>
          ) : qrCodeUrl ? (
            <img src={qrCodeUrl} alt="UPI QR Code" className="rounded-lg" />
          ) : (
             <p className="text-gray-500">Cart is empty.</p>
          )}
        </div>

        <div className="mt-6">
          <p className="text-gray-300">Total Amount</p>
          <p className="text-3xl font-bold text-green-400">₹{finalTotal.toFixed(2)}</p>
        </div>
        
        <div className="mt-8 text-sm text-gray-500">
          <p>After payment, your session will end and your receipt will be generated.</p>
        </div>
      </div>
    </div>
  );
}