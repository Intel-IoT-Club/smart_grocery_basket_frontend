"use client"

import { useState, useEffect } from "react"
import { FaShoppingCart, FaTrash, FaPlus, FaMinus } from "react-icons/fa"

const GroceryBasket = ({ items, updateQuantity, removeItem, clearBasket }) => {
  const [subtotal, setSubtotal] = useState(0)
  const [tax, setTax] = useState(0)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    const calculateTotals = () => {
      const itemSubtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
      const itemTax = itemSubtotal * 0.08 // 8% tax

      setSubtotal(itemSubtotal)
      setTax(itemTax)
      setTotal(itemSubtotal + itemTax)
    }

    calculateTotals()
  }, [items])

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 h-full">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FaShoppingCart className="text-green-500 text-xl sm:text-2xl" />
            <h2 className="text-xl font-semibold text-gray-800">Your Basket</h2>
          </div>
          <button className="text-gray-400 px-3 py-1 rounded-md text-sm disabled:opacity-50" disabled>
            Clear
          </button>
        </div>

        <div className="flex flex-col items-center justify-center h-64 text-gray-500">
          <FaShoppingCart className="text-5xl mb-4 text-gray-300" />
          <p className="text-lg mb-2">Your basket is empty</p>
          <p className="text-sm text-center">Scan a product to add items to your basket</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FaShoppingCart className="text-green-500 text-xl sm:text-2xl" />
          <h2 className="text-xl font-semibold text-gray-800">Your Basket</h2>
        </div>
        <button
          onClick={clearBasket}
          className="bg-red-100 text-red-600 hover:bg-red-200 px-3 py-1 rounded-md text-sm transition-colors"
        >
          Clear
        </button>
      </div>

      <div className="flex-grow overflow-auto mb-4">
        {items.map((item, index) => (
          <div key={item.id} className="flex items-center justify-between py-3 border-b">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center text-sm font-medium text-gray-600">
                {index + 1}
              </div>
              <div>
                <h3 className="font-medium text-gray-800">{item.name}</h3>
                <p className="text-green-600 font-medium">₹{item.price.toFixed(2)}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                className="bg-gray-100 hover:bg-gray-200 p-1 rounded-md w-8 h-8 flex items-center justify-center sm:w-10 sm:h-10"
                disabled={item.quantity <= 1}
              >
                <FaMinus className="text-gray-600" />
              </button>

              <span className="w-8 text-center sm:w-10">{item.quantity}</span>

              <button
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                className="bg-gray-100 hover:bg-gray-200 p-1 rounded-md w-8 h-8 flex items-center justify-center sm:w-10 sm:h-10"
              >
                <FaPlus className="text-gray-600" />
              </button>

              <button onClick={() => removeItem(item.id)} className="ml-2 text-red-500 hover:text-red-700">
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t pt-4">
        <div className="flex justify-between mb-2">
          <span className="text-gray-600">Subtotal:</span>
          <span className="font-medium">₹{subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span className="text-gray-600">Tax (8%):</span>
          <span className="font-medium">₹{tax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-lg font-bold">
          <span>Total:</span>
          <span>₹{total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  )
}

export default GroceryBasket
