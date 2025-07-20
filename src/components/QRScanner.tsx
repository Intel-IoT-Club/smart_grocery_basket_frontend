"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CameraIcon,
  PlayIcon,
  StopIcon,
  CheckCircleIcon,
  WarningCircleIcon,
  InfoIcon,
  ScanIcon,
  QrCodeIcon 
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

const pulseVariants = {
  initial: { scale: 1, opacity: 0.8 },
  animate: {
    scale: [1, 1.05, 1],
    opacity: [0.8, 1, 0.8],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

const statusVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.3 }
  },
  exit: { 
    opacity: 0, 
    y: -10,
    transition: { duration: 0.2 }
  }
};

const scanLineVariants = {
  animate: {
    y: [0, 200, 0],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

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
    if (isLoading) return <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}><ScanIcon weight="bold" className="h-5 w-5" /></motion.div>;
    
    switch (statusType) {
      case 'success':
        return <CheckCircleIcon weight="fill" className="h-5 w-5" />;
      case 'error':
        return <WarningCircleIcon weight="fill" className="h-5 w-5" />;
      default:
        return <InfoIcon weight="bold" className="h-5 w-5" />;
    }
  };

  const getStatusBadgeClass = () => {
    switch (statusType) {
      case 'success':
        return 'status-badge success';
      case 'error':
        return 'status-badge warning';
      default:
        return 'status-badge info';
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card h-full flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center gap-4 p-6 border-b border-subtle">
        <div className="p-3 rounded-xl" style={{ background: 'var(--color-dark-green)' }}>
          <QrCodeIcon 
            weight="duotone"
            className="h-6 w-6" 
            style={{ color: 'var(--color-green)' }} 
          />
        </div>
        <div>
          <h3 className="heading-tertiary mb-1">
            Barcode Scanner
          </h3>
        </div>
      </div>

      {/* Scanner Content */}
      <div className="flex-1 flex flex-col p-6">
        {/* Camera Preview */}
        <div className="relative mb-6 flex-1 min-h-[280px] max-h-[350px]">
          <div className={`relative w-full h-full rounded-2xl overflow-hidden transition-all duration-300 ${
            isScanning ? 'bg-black shadow-2xl' : 'border-2 border-dashed border-subtle'
          }`} style={{ background: isScanning ? '#000' : 'var(--color-surface-light)' }}>
            
            <video
              ref={videoRef}
              className={`w-full h-full object-cover transition-opacity duration-300 ${
                isScanning ? 'opacity-100' : 'opacity-0'
              }`}
              autoPlay
              playsInline
              muted
            />

            {!isScanning && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-muted">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="mb-4"
                >
                  <CameraIcon weight="duotone" className="h-20 w-20" />
                </motion.div>
                <h4 className="font-semibold text-lg mb-2" style={{ color: 'var(--color-off-white)' }}>
                  Camera Preview
                </h4>
                <p className="text-sm text-center leading-relaxed max-w-xs">
                  Position barcode within the scanning area for best results
                </p>
              </div>
            )}

            {/* Enhanced Scanning Overlay */}
            {isScanning && (
              <div className="absolute inset-0 pointer-events-none">
                {/* Main Scanning Frame */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64">
                  <motion.div
                    variants={pulseVariants}
                    initial="initial"
                    animate="animate"
                    className="w-full h-full border-2 rounded-2xl"
                    style={{ borderColor: 'var(--color-bright-green)' }}
                  />
                  
                  {/* Animated Scan Line */}
                  <div className="absolute inset-2 overflow-hidden rounded-xl">
                    <motion.div
                      variants={scanLineVariants}
                      animate="animate"
                      className="absolute left-0 right-0 h-0.5 opacity-80"
                      style={{ background: 'var(--color-bright-green)', boxShadow: '0 0 10px var(--color-bright-green)' }}
                    />
                  </div>
                  
                  {/* Corner Indicators */}
                  <div className="absolute -top-1 -left-1 w-8 h-8 border-t-4 border-l-4 rounded-tl-2xl" style={{ borderColor: 'var(--color-off-white)' }} />
                  <div className="absolute -top-1 -right-1 w-8 h-8 border-t-4 border-r-4 rounded-tr-2xl" style={{ borderColor: 'var(--color-off-white)' }} />
                  <div className="absolute -bottom-1 -left-1 w-8 h-8 border-b-4 border-l-4 rounded-bl-2xl" style={{ borderColor: 'var(--color-off-white)' }} />
                  <div className="absolute -bottom-1 -right-1 w-8 h-8 border-b-4 border-r-4 rounded-br-2xl" style={{ borderColor: 'var(--color-off-white)' }} />
                </div>

                {/* Status Indicator */}
                <div className="absolute top-4 left-4">
                  <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-black/70 backdrop-blur-sm">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="w-2 h-2 rounded-full"
                      style={{ background: 'var(--color-bright-green)' }}
                    />
                    <span className="text-xs font-medium" style={{ color: 'var(--color-off-white)' }}>
                      SCANNING
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Status Display */}
        <AnimatePresence mode="wait">
          <motion.div
            key={status}
            variants={statusVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={`${getStatusBadgeClass()} w-full mb-6 justify-start p-4`}
          >
            {getStatusIcon()}
            <div className="flex-1">
              <p className="font-semibold text-sm mb-1">{status}</p>
              {scannedData && (
                <p className="text-xs opacity-75">
                  ID: {scannedData}
                </p>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Enhanced Control Button */}
        <motion.button
          onClick={toggleScanner}
          className={`btn w-full ${isScanning ? 'btn-danger' : 'btn-primary'} focus-ring`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={!barcodeDetectorRef.current || isLoading}
        >
          {isLoading ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <ScanIcon weight="bold" className="h-5 w-5" />
              </motion.div>
              Initializing...
            </>
          ) : isScanning ? (
            <>
              <StopIcon weight="bold" className="h-5 w-5" />
              Stop Scanner
            </>
          ) : (
            <>
              <PlayIcon weight="fill" className="h-5 w-5" />
              Start Scanning
            </>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default QRScanner;