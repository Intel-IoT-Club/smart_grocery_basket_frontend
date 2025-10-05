"use client";

import GroceryBasket from '../components/GroceryBasket';
import QRScanner from '../components/QRScanner';
// No longer need useAuth, useState, or useCallback here!
// No longer need to define Product interface here!

export default function Home() {
  // This page is now just a simple layout container!
  // All logic is handled by the components and hooks.
  return (
    <div className="min-h-screen bg-gray-950 p-4">
      <header className="mb-6">
        <h1 className="text-xl font-medium text-white text-center">
          Smart Grocery Basket
        </h1>
        <p className="text-sm text-gray-400 text-center mt-1">
          Scan products to add them to your basket
        </p>
      </header>
      <main className="max-w-4xl mx-auto">
        <div className="grid gap-4 lg:grid-cols-2 h-[calc(100vh-8rem)]">
          <QRScanner />
          <GroceryBasket />
        </div>
      </main>
    </div>
  );
}