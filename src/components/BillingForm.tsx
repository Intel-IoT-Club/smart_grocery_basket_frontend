'use client';

import { FC, useState } from 'react';
import { BillingData } from '@/types/billing';

const BillingForm: FC = () => {
  const [formData, setFormData] = useState<BillingData>({
    fullName: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    cardNumber: '',
    expiry: '',
    cvc: ''
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    // TODO: Implement billing logic here
    // e.g., call billing API
    alert('Billing submitted (boilerplate)');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="text-sm text-red-700">{error}</div>
        </div>
      )}
      <div className="rounded-md shadow-sm -space-y-px">
        <div>
          <label htmlFor="fullName" className="sr-only">Full Name</label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            required
            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="address" className="sr-only">Address</label>
          <input
            id="address"
            name="address"
            type="text"
            required
            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="city" className="sr-only">City</label>
          <input
            id="city"
            name="city"
            type="text"
            required
            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            placeholder="City"
            value={formData.city}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="state" className="sr-only">State</label>
          <input
            id="state"
            name="state"
            type="text"
            required
            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            placeholder="State"
            value={formData.state}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="zip" className="sr-only">ZIP Code</label>
          <input
            id="zip"
            name="zip"
            type="text"
            required
            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            placeholder="ZIP Code"
            value={formData.zip}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="cardNumber" className="sr-only">Card Number</label>
          <input
            id="cardNumber"
            name="cardNumber"
            type="text"
            required
            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            placeholder="Card Number"
            value={formData.cardNumber}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="expiry" className="sr-only">Expiry</label>
          <input
            id="expiry"
            name="expiry"
            type="text"
            required
            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            placeholder="MM/YY"
            value={formData.expiry}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="cvc" className="sr-only">CVC</label>
          <input
            id="cvc"
            name="cvc"
            type="text"
            required
            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            placeholder="CVC"
            value={formData.cvc}
            onChange={handleChange}
          />
        </div>
      </div>
      <div>
        <button
          type="submit"
          className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Submit Billing
        </button>
      </div>
    </form>
  );
};

export default BillingForm;