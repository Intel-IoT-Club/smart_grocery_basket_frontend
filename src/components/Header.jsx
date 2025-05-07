import { FaShoppingBasket } from "react-icons/fa"

const Header = () => {
  return (
    <header className="!bg-green-600 p-4 shadow-lg" style={{ backgroundColor: '#059669' }}>
      <div className="container mx-auto">
        <div className="flex flex-col items-center justify-center text-white">
          <div className="flex items-center gap-2">
            <FaShoppingBasket className="text-3xl" />
            <h1 className="text-3xl font-bold">Smart Grocery Basket</h1>
          </div>
          <p className="mt-2 text-center text-white/90">Scan products, manage your basket, and checkout seamlessly</p>
        </div>
      </div>
    </header>
  )
}

export default Header
