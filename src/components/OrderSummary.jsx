"use client"
import { FaCheckCircle, FaReceipt } from "react-icons/fa"

const OrderSummary = ({ orderDetails, onContinueShopping }) => {
  const { transactionId, items, subtotal, tax, total, paymentMethod } = orderDetails

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex flex-col items-center justify-center mb-6">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <FaCheckCircle className="text-green-500 text-3xl" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Payment Successful!</h2>
        <p className="text-gray-600 mt-1">Thank you for your purchase</p>
      </div>

      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <FaReceipt className="text-green-500" />
          <h3 className="font-medium">Order Summary</h3>
        </div>

        <div className="text-sm">
          <div className="flex justify-between mb-1">
            <span className="text-gray-600">Transaction ID:</span>
            <span className="font-medium">{transactionId}</span>
          </div>
          <div className="flex justify-between mb-1">
            <span className="text-gray-600">Payment Method:</span>
            <span className="font-medium capitalize">{paymentMethod}</span>
          </div>
          <div className="flex justify-between mb-1">
            <span className="text-gray-600">Date:</span>
            <span className="font-medium">{new Date().toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="font-medium mb-3">Items Purchased</h3>
        <div className="space-y-3">
          {items.map((item, index) => (
            <div key={item.id} className="flex justify-between">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center text-xs font-medium text-gray-600">
                  {index + 1}
                </div>
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                </div>
              </div>
              <p className="font-medium">₹{(item.price * item.quantity).toFixed(2)}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t pt-4 mb-6">
        <div className="flex justify-between mb-1">
          <span className="text-gray-600">Subtotal:</span>
          <span>₹{subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between mb-1">
          <span className="text-gray-600">Tax:</span>
          <span>₹{tax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-lg font-bold">
          <span>Total:</span>
          <span>₹{total.toFixed(2)}</span>
        </div>
      </div>

      <button
        onClick={onContinueShopping}
        className="w-full bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-md font-medium transition-colors"
      >
        Continue Shopping
      </button>

      <div className="mt-4 text-center">
        <p className="text-sm text-gray-500">A receipt has been sent to your email address</p>
      </div>
    </div>
  )
}

export default OrderSummary
