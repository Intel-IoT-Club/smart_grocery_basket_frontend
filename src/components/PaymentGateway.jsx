"use client"

import { useState } from "react"
import { FaCreditCard, FaPaypal, FaMoneyBillWave, FaUniversity, FaLock } from "react-icons/fa"

const PaymentGateway = ({ total, onPaymentComplete }) => {
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
  })
  const [isProcessing, setIsProcessing] = useState(false)
  const [errors, setErrors] = useState({})

  const handleInputChange = (e) => {
    const { name, value } = e.target

    // Format card number with spaces
    if (name === "cardNumber") {
      const formattedValue = value
        .replace(/\s/g, "")
        .replace(/(\d{4})/g, "$1 ")
        .trim()
        .slice(0, 19)

      setCardDetails({
        ...cardDetails,
        [name]: formattedValue,
      })
      return
    }

    // Format expiry date
    if (name === "expiryDate") {
      const formattedValue = value
        .replace(/\D/g, "")
        .replace(/(\d{2})(\d)/, "$1/$2")
        .slice(0, 5)

      setCardDetails({
        ...cardDetails,
        [name]: formattedValue,
      })
      return
    }

    setCardDetails({
      ...cardDetails,
      [name]: value,
    })
  }

  const validateForm = () => {
    const newErrors = {}

    if (!cardDetails.cardNumber || cardDetails.cardNumber.replace(/\s/g, "").length !== 16) {
      newErrors.cardNumber = "Please enter a valid 16-digit card number"
    }

    if (!cardDetails.cardName) {
      newErrors.cardName = "Please enter the name on card"
    }

    if (!cardDetails.expiryDate || !cardDetails.expiryDate.match(/^\d{2}\/\d{2}$/)) {
      newErrors.expiryDate = "Please enter a valid expiry date (MM/YY)"
    }

    if (!cardDetails.cvv || cardDetails.cvv.length < 3) {
      newErrors.cvv = "Please enter a valid CVV"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (paymentMethod === "card" && !validateForm()) {
      return
    }

    setIsProcessing(true)

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false)
      onPaymentComplete({
        success: true,
        transactionId: Math.random().toString(36).substring(2, 15),
        method: paymentMethod,
      })
    }, 2000)
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-2 mb-6">
        <FaCreditCard className="text-green-500 text-xl" />
        <h2 className="text-xl font-semibold text-gray-800">Payment</h2>
      </div>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-600">Total Amount:</span>
          <span className="text-2xl font-bold text-green-600">₹{total.toFixed(2)}</span>
        </div>
        <div className="h-1 w-full bg-gray-100 rounded-full">
          <div className="h-1 bg-green-500 rounded-full w-full"></div>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-gray-700 font-medium mb-3">Select Payment Method</h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <button
            type="button"
            onClick={() => setPaymentMethod("card")}
            className={`flex flex-col items-center justify-center p-3 border rounded-lg sm:p-4 ${
              paymentMethod === "card" ? "border-green-500 bg-green-50" : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <FaCreditCard className="text-2xl mb-1 text-gray-700 sm:text-3xl" />
            <span className="text-sm sm:text-base">Card</span>
            <span className="text-xs text-gray-500">Credit/Debit</span>
          </button>

          <button
            type="button"
            onClick={() => setPaymentMethod("upi")}
            className={`flex flex-col items-center justify-center p-3 border rounded-lg ${
              paymentMethod === "upi" ? "border-green-500 bg-green-50" : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <FaMoneyBillWave className="text-2xl mb-1 text-green-600" />
            <span className="text-sm">UPI</span>
            <span className="text-xs text-gray-500">GPay/PhonePe</span>
          </button>

          <button
            type="button"
            onClick={() => setPaymentMethod("netbanking")}
            className={`flex flex-col items-center justify-center p-3 border rounded-lg ${
              paymentMethod === "netbanking" ? "border-green-500 bg-green-50" : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <FaUniversity className="text-2xl mb-1 text-blue-600" />
            <span className="text-sm">Net Banking</span>
          </button>

          <button
            type="button"
            onClick={() => setPaymentMethod("paypal")}
            className={`flex flex-col items-center justify-center p-3 border rounded-lg ${
              paymentMethod === "paypal" ? "border-green-500 bg-green-50" : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <FaPaypal className="text-2xl mb-1 text-blue-600" />
            <span className="text-sm">PayPal</span>
          </button>
        </div>
      </div>

      {paymentMethod === "card" && (
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="cardNumber" className="block text-gray-700 text-sm font-medium mb-1">
              Card Number
            </label>
            <input
              type="text"
              id="cardNumber"
              name="cardNumber"
              value={cardDetails.cardNumber}
              onChange={handleInputChange}
              placeholder="1234 5678 9012 3456"
              maxLength="19"
              className={`w-full px-3 py-2 border rounded-md ${
                errors.cardNumber ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.cardNumber && <p className="text-red-500 text-xs mt-1">{errors.cardNumber}</p>}
          </div>

          <div className="mb-4">
            <label htmlFor="cardName" className="block text-gray-700 text-sm font-medium mb-1">
              Name on Card
            </label>
            <input
              type="text"
              id="cardName"
              name="cardName"
              value={cardDetails.cardName}
              onChange={handleInputChange}
              placeholder="John Doe"
              className={`w-full px-3 py-2 border rounded-md ${errors.cardName ? "border-red-500" : "border-gray-300"}`}
            />
            {errors.cardName && <p className="text-red-500 text-xs mt-1">{errors.cardName}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label htmlFor="expiryDate" className="block text-gray-700 text-sm font-medium mb-1">
                Expiry Date
              </label>
              <input
                type="text"
                id="expiryDate"
                name="expiryDate"
                value={cardDetails.expiryDate}
                onChange={handleInputChange}
                placeholder="MM/YY"
                className={`w-full px-3 py-2 border rounded-md ${
                  errors.expiryDate ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.expiryDate && <p className="text-red-500 text-xs mt-1">{errors.expiryDate}</p>}
            </div>

            <div>
              <label htmlFor="cvv" className="block text-gray-700 text-sm font-medium mb-1">
                CVV
              </label>
              <input
                type="text"
                id="cvv"
                name="cvv"
                value={cardDetails.cvv}
                onChange={handleInputChange}
                placeholder="123"
                maxLength="4"
                className={`w-full px-3 py-2 border rounded-md ${errors.cvv ? "border-red-500" : "border-gray-300"}`}
              />
              {errors.cvv && <p className="text-red-500 text-xs mt-1">{errors.cvv}</p>}
            </div>
          </div>

          <button
            type="submit"
            disabled={isProcessing}
            className="w-full bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-md font-medium flex items-center justify-center gap-2 transition-colors disabled:opacity-70"
          >
            {isProcessing ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Processing...
              </>
            ) : (
              <>
                <FaLock />
                Pay ₹{total.toFixed(2)}
              </>
            )}
          </button>

          <div className="mt-4 flex items-center justify-center text-xs text-gray-500">
            <FaLock className="mr-1" />
            <span>Your payment information is secure</span>
          </div>
        </form>
      )}

      {paymentMethod === "upi" && (
        <div className="text-center p-4">
          <div className="mb-6 bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium mb-2">Pay using UPI</h3>
            <p className="text-sm text-gray-600 mb-4">Enter your UPI ID to make the payment</p>

            <div className="mb-4">
              <input
                type="text"
                placeholder="yourname@upi"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={isProcessing}
            className="w-full bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-md font-medium flex items-center justify-center gap-2 transition-colors disabled:opacity-70"
          >
            {isProcessing ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Processing...
              </>
            ) : (
              <>Pay with UPI</>
            )}
          </button>
        </div>
      )}

      {paymentMethod === "netbanking" && (
        <div className="text-center p-4">
          <div className="mb-6 bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium mb-2">Pay using Net Banking</h3>
            <p className="text-sm text-gray-600 mb-4">Select your bank to proceed</p>

            <div className="mb-4">
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                <option value="">Select your bank</option>
                <option value="sbi">State Bank of India</option>
                <option value="hdfc">HDFC Bank</option>
                <option value="icici">ICICI Bank</option>
                <option value="axis">Axis Bank</option>
                <option value="kotak">Kotak Mahindra Bank</option>
                <option value="other">Other Banks</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={isProcessing}
            className="w-full bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-md font-medium flex items-center justify-center gap-2 transition-colors disabled:opacity-70"
          >
            {isProcessing ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Processing...
              </>
            ) : (
              <>Continue to Net Banking</>
            )}
          </button>
        </div>
      )}

      {paymentMethod === "paypal" && (
        <div className="text-center p-4">
          <div className="mb-6 bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium mb-2">Pay using PayPal</h3>
            <p className="text-sm text-gray-600">You'll be redirected to PayPal to complete your payment</p>
          </div>

          <button
            onClick={handleSubmit}
            disabled={isProcessing}
            className="w-full bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-md font-medium flex items-center justify-center gap-2 transition-colors disabled:opacity-70"
          >
            {isProcessing ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Processing...
              </>
            ) : (
              <>Continue to PayPal</>
            )}
          </button>
        </div>
      )}
    </div>
  )
}

export default PaymentGateway