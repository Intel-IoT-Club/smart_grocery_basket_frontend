"use client"

import { useState, useEffect } from "react"
import Header from "./components/Header"
import GroceryBasket from "./components/GroceryBasket"
import QRScanner from "./components/QRScanner"
import PaymentGateway from "./components/PaymentGateway"
import OrderSummary from "./components/OrderSummary"
import Footer from "./components/Footer"
import "./App.css"

// REMOVE BEFORE DEPLOYMENT: Mock data for testing purposes only
/*
const mockProducts = [
  {
    id: "1",
    name: "Organic Bananas",
    price: 2.99,
    serialNumber: "PRD00123",
    quantity: 1,
  },
  {
    id: "2",
    name: "Whole Milk",
    price: 3.49,
    serialNumber: "PRD00456",
    quantity: 2,
  },
]
*/

function App() {
  const [basketItems, setBasketItems] = useState([])
  const [currentStep, setCurrentStep] = useState("shopping") // shopping, payment, confirmation
  const [orderDetails, setOrderDetails] = useState(null)
  const [showDemo, setShowDemo] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)

  // REMOVE BEFORE DEPLOYMENT: For demo purposes, load mock data
  /*
  useEffect(() => {
    if (showDemo) {
      setBasketItems(mockProducts)
    }
  }, [showDemo])
  */

  const handleScan = (product) => {
    // Check if product already exists in basket
    const existingItemIndex = basketItems.findIndex((item) => item.id === product.id)

    if (existingItemIndex >= 0) {
      // Update quantity if product already exists
      const updatedItems = [...basketItems]
      updatedItems[existingItemIndex].quantity += 1
      setBasketItems(updatedItems)
    } else {
      // Add new product to basket
      setBasketItems([...basketItems, product])
    }
  }

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity <= 0) {
      removeItem(id)
      return
    }

    const updatedItems = basketItems.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item))

    setBasketItems(updatedItems)
  }

  const removeItem = (id) => {
    const updatedItems = basketItems.filter((item) => item.id !== id)
    setBasketItems(updatedItems)
  }

  const clearBasket = () => {
    setBasketItems([])
  }

  const proceedToPayment = () => {
    if (basketItems.length > 0) {
      setCurrentStep("payment")
    }
  }

  const handlePaymentComplete = (paymentResult) => {
    if (paymentResult.success) {
      // Calculate totals
      const subtotal = basketItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
      const tax = subtotal * 0.08 // 8% tax
      const total = subtotal + tax

      // Create order details
      setOrderDetails({
        transactionId: paymentResult.transactionId,
        items: [...basketItems],
        subtotal,
        tax,
        total,
        paymentMethod: paymentResult.method,
      })

      // Move to confirmation step
      setCurrentStep("confirmation")

      // Clear basket
      setBasketItems([])
    }
  }

  const continueShopping = () => {
    setCurrentStep("shopping")
    setOrderDetails(null)
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-6">
        {currentStep === "shopping" && (
          <>
            <div className="mb-6 flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-800">Smart Grocery Basket</h1>

              {/* REMOVE BEFORE DEPLOYMENT: Demo data button */}
              {/*
              <button
                onClick={() => setShowDemo(!showDemo)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md text-sm transition-colors"
              >
                {showDemo ? "Clear Demo Data" : "Load Demo Data"}
              </button>
              */}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Scanner on the left in desktop, on top in mobile */}
              <QRScanner onScan={handleScan} />

              <div className="flex flex-col">
                {/* Basket on the right in desktop, on bottom in mobile */}
                <GroceryBasket
                  items={basketItems}
                  updateQuantity={updateQuantity}
                  removeItem={removeItem}
                  clearBasket={clearBasket}
                />

                {/* Proceed to checkout button below the basket with tooltip */}
                <div className="relative mt-4">
                  <button
                    onClick={proceedToPayment}
                    onMouseEnter={() => basketItems.length === 0 && setShowTooltip(true)}
                    onMouseLeave={() => setShowTooltip(false)}
                    disabled={basketItems.length === 0}
                    className="w-full bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-md font-medium transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    Proceed to Checkout
                  </button>

                  {showTooltip && basketItems.length === 0 && (
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-sm rounded-md whitespace-nowrap">
                      Add at least 1 item to proceed
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}

        {currentStep === "payment" && (
          <>
            <div className="mb-6">
              <button
                onClick={() => setCurrentStep("shopping")}
                className="flex items-center text-gray-600 hover:text-gray-900"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z"
                    clipRule="evenodd"
                  />
                </svg>
                Back to Basket
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <GroceryBasket
                  items={basketItems}
                  updateQuantity={updateQuantity}
                  removeItem={removeItem}
                  clearBasket={clearBasket}
                />
              </div>
              <div>
                <PaymentGateway
                  total={basketItems.reduce((sum, item) => sum + item.price * item.quantity, 0) * 1.08}
                  onPaymentComplete={handlePaymentComplete}
                />
              </div>
            </div>
          </>
        )}

        {currentStep === "confirmation" && orderDetails && (
          <div className="max-w-2xl mx-auto">
            <OrderSummary orderDetails={orderDetails} onContinueShopping={continueShopping} />
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}

export default App