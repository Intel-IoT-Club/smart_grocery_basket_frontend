"use client";

import { useState, useEffect, useRef } from "react";
import { 
  CameraIcon,
  PlayIcon,
  StopIcon
} from '@phosphor-icons/react';

import { productService } from '../services/api';

interface Product {
  productId: string;
  name: string;
  mrpPrice: number;
  image: string;
  discounts?: string;
  category: string;
  stock?: number;
  expiryDate?: string;
}

interface QRScannerProps {
  onScan: (product: Product) => void;
}

interface Barcode {
  rawValue: string;
  format: string;
  boundingBox?: DOMRectReadOnly;
}

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

const QRScanner = ({ onScan }: QRScannerProps) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [scannedData, setScannedData] = useState<string>("");
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [status, setStatus] = useState<string>("");
  const [statusType, setStatusType] = useState<'info' | 'success' | 'error'>('info');
  const [isLoading, setIsLoading] = useState<boolean>(false);

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
        formats: [
          "code_128", "code_39", "code_93", "codabar", 
          "ean_13", "ean_8", "itf", "pdf417", 
          "upc_a", "upc_e", "qr_code"
        ],
      });
      updateStatus("Scanner ready. Tap to start scanning", 'info');
    } else {
      updateStatus("Barcode scanning not supported in this browser", 'error');
    }

    return () => {
      stopScanner();
    };
  }, []);

  const startScanner = async () => {
    try {
      setIsLoading(true);
      updateStatus("Initializing camera...", 'info');
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: "environment",
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      scanningRef.current = true;
      setIsScanning(true);
      setIsLoading(false);
      updateStatus("Hold barcode steady in the frame", 'info');
      detectBarcode();
    } catch (error) {
      console.error("Camera access error:", error);
      setIsLoading(false);
      updateStatus("Unable to access camera", 'error');
    }
  };

  const detectBarcode = async () => {
    if (!barcodeDetectorRef.current || !videoRef.current?.srcObject) {
      return;
    }

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
            updateStatus(`Processing: ${productId}`, 'success');
            await processProductScan(productId);
          }
        }
      } catch (error) {
        console.error("Detection error:", error);
      }

      if (scanningRef.current) {
        requestAnimationFrame(scanFrame);
      }
    };

    scanFrame();
  };

  const processProductScan = async (productId: string) => {
    try {
      setIsLoading(true);
      updateStatus("Looking up product...", 'info');
      
      // Use the proper API service instead of hardcoded URLs
      const product = await productService.searchByBarcode(productId);

      if (product) {
        // Check if product is available (not expired and in stock)
        const isExpired = product.expiryDate && new Date(product.expiryDate) < new Date();
        const isInStock = product.stock && product.stock > 0;
        
        if (isExpired) {
          updateStatus(`Product expired: ${product.name}`, 'error');
        } else if (!isInStock) {
          updateStatus(`Product out of stock: ${product.name}`, 'error');
        } else {
          onScan(product);
          updateStatus(`Added: ${product.name}`, 'success');
        }
      } else {
        updateStatus(`Product not found: ${productId}`, 'error');
      }
    } catch (error) {
      console.error("Product fetch error:", error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      updateStatus(`Network error: ${errorMessage}`, 'error');
    } finally {
      setIsLoading(false);
    }

    // Reset for re-scanning after delay
    setTimeout(() => {
      scannedProductsRef.current.delete(productId);
      if (scanningRef.current) {
        updateStatus("Ready to scan next item", 'info');
      }
    }, 3000);
  };

  const stopScanner = () => {
    scanningRef.current = false;
    setIsScanning(false);
    setIsLoading(false);

    if (videoRef.current?.srcObject) {
      const mediaStream = videoRef.current.srcObject as MediaStream;
      mediaStream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }

    updateStatus("Scanner stopped", 'info');
  };

  const toggleScanner = () => {
    if (isScanning) {
      stopScanner();
    } else {
      startScanner();
    }
  };

  const getStatusIcon = () => {
    if (isLoading) return <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />;
    
    switch (statusType) {
      case 'success':
        return <div className="w-4 h-4 rounded-full bg-green-500" />;
      case 'error':
        return <div className="w-4 h-4 rounded-full bg-red-500" />;
      default:
        return <div className="w-4 h-4 rounded-full bg-blue-500" />;
    }
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-gray-800">
        <div className="w-10 h-10 rounded-xl bg-gray-800 flex items-center justify-center">
          <CameraIcon className="w-5 h-5 text-gray-400" />
        </div>
        <div>
          <h3 className="text-lg font-medium text-white">Scanner</h3>
          <p className="text-sm text-gray-500">Ready to scan</p>
        </div>
      </div>

      {/* Camera Preview */}
      <div className="flex-1 p-4">
        <div className={`relative w-full h-full min-h-[200px] rounded-xl overflow-hidden ${
          isScanning ? 'bg-black' : 'border-2 border-dashed border-gray-700'
        }`}>
          
          <video
            ref={videoRef}
            className={`w-full h-full object-cover ${
              isScanning ? 'opacity-100' : 'opacity-0'
            }`}
            autoPlay
            playsInline
            muted
          />

          {!isScanning && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500 bg-gray-800">
              <CameraIcon className="w-12 h-12 mb-3" />
              <p className="text-sm text-center">Tap start to begin scanning</p>
            </div>
          )}

          {/* Simple Scanning Indicator */}
          {isScanning && (
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 border-2 border-green-400 rounded-lg"></div>
              <div className="absolute top-4 left-4 px-2 py-1 bg-black/80 rounded text-xs text-green-400 flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                Scanning...
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Status */}
      <div className="p-4 pt-0">
        <div className={`flex items-center gap-3 p-3 rounded-xl ${
          statusType === 'success' ? 'bg-green-500/10 text-green-400' :
          statusType === 'error' ? 'bg-red-500/10 text-red-400' :
          'bg-gray-800 text-gray-300'
        }`}>
          {getStatusIcon()}
          <div className="flex-1">
            <p className="text-sm font-medium">{status}</p>
            {scannedData && (
              <p className="text-xs opacity-70 font-mono mt-1">
                {scannedData}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Control Button */}
      <div className="p-4 pt-0">
        <button
          onClick={toggleScanner}
          className={`w-full px-4 py-3 rounded-xl font-medium transition-colors ${
            isScanning 
              ? 'bg-red-600 hover:bg-red-700 text-white' 
              : 'bg-green-600 hover:bg-green-700 text-white'
          } disabled:opacity-50`}
          disabled={!barcodeDetectorRef.current || isLoading}
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Starting...
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              {isScanning ? (
                <>
                  <StopIcon className="w-4 h-4" />
                  Stop
                </>
              ) : (
                <>
                  <PlayIcon className="w-4 h-4" />
                  Start
                </>
              )}
            </div>
          )}
        </button>
      </div>
    </div>
  );
};

export default QRScanner;