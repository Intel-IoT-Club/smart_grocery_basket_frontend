"use client"

import { useState, useEffect } from "react"
import { FaShoppingCart, FaTrash } from "react-icons/fa"
import PropTypes from 'prop-types'

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
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 h-full">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FaShoppingCart className="text-green-500 text-3xl" />
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Your Basket</h2>
          </div>
          <button className="text-gray-400 px-3 py-1 rounded-md text-sm disabled:opacity-50" disabled>
            Clear
          </button>
        </div>

        <div className="flex flex-col items-center justify-center h-64 text-gray-500 dark:text-gray-400">
          <FaShoppingCart className="text-7xl mb-4 text-gray-300 dark:text-gray-600" />
          <p className="text-lg mb-2">Your basket is empty</p>
          <p className="text-sm text-center">Scan a product to add items to your basket</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <FaShoppingCart className="text-green-500 text-3xl" />
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Your Basket</h2>
        </div>
        <button
          onClick={clearBasket}
          className="flex items-center gap-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors text-base font-medium"
        >
          <FaTrash className="text-xl" />
          Clear All
        </button>
      </div>

      <div className="flex-grow overflow-auto mb-6">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b-2 border-gray-200 dark:border-gray-700">
                <th className="text-left py-4 px-2 sm:px-4 font-semibold text-gray-600 dark:text-gray-300">Item</th>
                <th className="text-center py-4 px-2 sm:px-4 font-semibold text-gray-600 dark:text-gray-300">Price</th>
                <th className="text-center py-4 px-2 sm:px-4 font-semibold text-gray-600 dark:text-gray-300">Quantity</th>
                <th className="text-center py-4 px-2 sm:px-4 font-semibold text-gray-600 dark:text-gray-300">Subtotal</th>
                <th className="text-center py-4 px-2 sm:px-4 font-semibold text-gray-600 dark:text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="py-3 sm:py-4 px-2 sm:px-4">
                    <span className="font-medium text-gray-800 dark:text-white text-sm sm:text-base">{item.name}</span>
                  </td>
                  <td className="py-3 sm:py-4 px-2 sm:px-4 text-center">
                    <span className="text-green-600 dark:text-green-400 font-medium text-sm sm:text-base">₹{item.price.toFixed(2)}</span>
                  </td>
                  <td className="py-3 sm:py-4 px-2 sm:px-4">
                    <div className="flex items-center justify-center gap-2 sm:gap-4">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition-colors border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-lg font-medium"
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      <span className="w-6 sm:w-8 text-center font-medium text-gray-800 dark:text-white text-sm sm:text-base">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition-colors border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-lg font-medium"
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td className="py-3 sm:py-4 px-2 sm:px-4 text-center">
                    <span className="font-medium text-gray-800 dark:text-white text-sm sm:text-base">₹{(item.price * item.quantity).toFixed(2)}</span>
                  </td>
                  <td className="py-3 sm:py-4 px-2 sm:px-4 text-center">
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                    >
                      <FaTrash className="text-lg sm:text-xl" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-3">
        <div className="flex justify-between text-gray-600 dark:text-gray-400">
          <span>Subtotal:</span>
          <span className="font-medium">₹{subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-gray-600 dark:text-gray-400">
          <span>Tax (8%):</span>
          <span className="font-medium">₹{tax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-lg font-bold text-gray-800 dark:text-white pt-3 border-t border-gray-200 dark:border-gray-700">
          <span>Total:</span>
          <span className="text-green-600 dark:text-green-400">₹{total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  )
}

GroceryBasket.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
      quantity: PropTypes.number.isRequired
    })
  ).isRequired,
  updateQuantity: PropTypes.func.isRequired,
  removeItem: PropTypes.func.isRequired,
  clearBasket: PropTypes.func.isRequired
}

export default GroceryBasket
