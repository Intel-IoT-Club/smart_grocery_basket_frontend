"use client";

import { useState, useEffect, useRef } from "react";
import { CameraIcon, PlayIcon, StopIcon } from '@phosphor-icons/react';
import { productService } from '../services/api';
import { useCart } from '@/hooks/useCart';
import { Product, Barcode } from '@/types';
import { STATUS_MESSAGES } from '@/constants/index';

// The props are now empty as the component is fully decoupled.
interface QRScannerProps {}

// Re-defining this interface here because it's specific to the browser's BarcodeDetector API
// and not a general application type. It's acceptable to keep it here.
declare global {
  interface Window {
    BarcodeDetector: {
      new (options: { formats: string[] }): {
        detect(image: ImageBitmap): Promise<Barcode[]>;
      };
    };
    ImageCapture: {
      new (track: MediaStreamTrack): {
        grabFrame(): Promise<ImageBitmap>;
      };
    };
  }
}

const QRScanner = ({}: QRScannerProps) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [scannedData, setScannedData] = useState<string>("");
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [status, setStatus] = useState<string>("");
  const [statusType, setStatusType] = useState<'info' | 'success' | 'error'>('info');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // Get the addToCart function directly from our global hook
  const { addToCart } = useCart();

  const barcodeDetectorRef = useRef<InstanceType<typeof window.BarcodeDetector> | null>(null);
  const scanningRef = useRef<boolean>(false);
  const scannedProductsRef = useRef<Set<string>>(new Set<string>());

  const updateStatus = (message: string, type: 'info' | 'success' | 'error' = 'info') => {
    setStatus(message);
    setStatusType(type);
  };

  useEffect(() => {
    if ("BarcodeDetector" in window) {
      barcodeDetectorRef.current = new window.BarcodeDetector({
        formats: ["ean_13", "qr_code", "upc_a", "code_128"],
      });
      updateStatus(STATUS_MESSAGES.SCANNER.READY, 'info');
    } else {
      updateStatus(STATUS_MESSAGES.SCANNER.NOT_SUPPORTED, 'error');
    }

    return () => {
      stopScanner();
    };
  }, []);

  const startScanner = async () => {
    try {
      setIsLoading(true);
      updateStatus(STATUS_MESSAGES.SCANNER.INITIALIZING, 'info');
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      scanningRef.current = true;
      setIsScanning(true);
      setIsLoading(false);
      updateStatus(STATUS_MESSAGES.SCANNER.SCANNING, 'info');
      detectBarcode();
    } catch (error) {
      console.error("Camera access error:", error);
      setIsLoading(false);
      updateStatus(STATUS_MESSAGES.SCANNER.ERROR, 'error');
    }
  };

  const detectBarcode = async () => {
    if (!barcodeDetectorRef.current || !videoRef.current?.srcObject) return;

    const mediaStream = videoRef.current.srcObject as MediaStream;
    const track = mediaStream.getVideoTracks()[0];
    
    if (!track || !("ImageCapture" in window)) {
      updateStatus("Camera capture not supported", 'error');
      return;
    }

    const imageCapture = new window.ImageCapture(track);

    const scanFrame = async () => {
      if (!scanningRef.current) return;
      try {
        const bitmap = await imageCapture.grabFrame();
        const barcodes = await barcodeDetectorRef.current!.detect(bitmap);
        if (barcodes.length > 0) {
          const productId = barcodes[0].rawValue;
          if (!scannedProductsRef.current.has(productId)) {
            scannedProductsRef.current.add(productId);
            setScannedData(productId);
            await processProductScan(productId);
          }
        }
      } catch (error) {
        console.error("Detection error:", error);
      }
      if (scanningRef.current) requestAnimationFrame(scanFrame);
    };
    scanFrame();
  };

  const processProductScan = async (productId: string) => {
    try {
      setIsLoading(true);
      updateStatus(STATUS_MESSAGES.SCANNER.PROCESSING, 'info');
      
      const product = await productService.searchByBarcode(productId);

      if (product) {
        const isExpired = product.expiryDate && new Date(product.expiryDate) < new Date();
        const isInStock = product.stock && product.stock > 0;
        
        if (isExpired) {
          updateStatus(`Product expired: ${product.name}`, 'error');
        } else if (!isInStock) {
          updateStatus(`Product out of stock: ${product.name}`, 'error');
        } else {
          addToCart(product); // <-- Directly call the action from the useCart hook
          updateStatus(STATUS_MESSAGES.BASKET.ITEM_ADDED, 'success');
        }
      } else {
        updateStatus(STATUS_MESSAGES.SCANNER.PRODUCT_NOT_FOUND, 'error');
      }
    } catch (error) {
      console.error("Product fetch error:", error);
      updateStatus(STATUS_MESSAGES.SCANNER.NETWORK_ERROR, 'error');
    } finally {
      setIsLoading(false);
    }
    setTimeout(() => {
      scannedProductsRef.current.delete(productId);
    }, 3000);
  };

  const stopScanner = () => {
    scanningRef.current = false;
    setIsScanning(false);
    setIsLoading(false);
    if (videoRef.current?.srcObject) {
      (videoRef.current.srcObject as MediaStream).getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    updateStatus("Scanner stopped", 'info');
  };
  
  const toggleScanner = () => isScanning ? stopScanner() : startScanner();

  // The rest of the JSX and helper functions (getStatusIcon) remain the same.
  // ... (Full JSX from your uploaded file goes here)
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl h-full flex flex-col overflow-hidden">
      {/* ... All existing JSX ... */}
    </div>
  );
};

export default QRScanner;