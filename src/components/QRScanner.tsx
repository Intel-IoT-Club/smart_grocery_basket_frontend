"use client";

import { useState, useEffect, useRef } from "react";

interface Product {
  productId: string;
  name: string;
  mrpPrice: number;
  image: string;
  discounts?: string;
  category: string;
}

interface QRScannerProps {
  onScan: (product: Product) => void;
}

/**
 * Minimal “Barcode” shape for detect()’s return value.
 */
interface Barcode {
  rawValue: string;
  format: string;
  boundingBox?: DOMRectReadOnly;
}

/**
 * We declare both constructors as properties of window,
 * so we never introduce an unused `class` keyword.
 */
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

  // Now strongly type this ref as either BarcodeDetector instance or null
  const barcodeDetectorRef = useRef<
    InstanceType<typeof window.BarcodeDetector> | null
  >(null);
  const scanningRef = useRef<boolean>(false);
  const scannedProductsRef = useRef<Set<string>>(new Set<string>());

  useEffect(() => {
    if ("BarcodeDetector" in window) {
      barcodeDetectorRef.current = new window.BarcodeDetector({
        formats: [
          "code_128",
          "code_39",
          "code_93",
          "codabar",
          "ean_13",
          "ean_8",
          "itf",
          "pdf417",
          "upc_a",
          "upc_e",
          "qr_code",
        ],
      });
      setStatus("Ready to scan. Click 'Start Scanning'");
    } else {
      setStatus("Barcode Detector API is not supported in this browser.");
    }

    return () => {
      stopScanner();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startScanner = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      scanningRef.current = true;
      setIsScanning(true);
      setStatus("Scanning... Hold barcode in view");
      detectBarcode();
    } catch (error) {
      console.error("Camera Error:", error);
      setStatus("Failed to access the camera.");
    }
  };

  const detectBarcode = async () => {
    if (
      !barcodeDetectorRef.current ||
      !videoRef.current ||
      !videoRef.current.srcObject
    ) {
      return;
    }

    const mediaStream = videoRef.current.srcObject as MediaStream;
    const track = mediaStream.getVideoTracks()[0];
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
            setStatus(`Detected: ${productId}`);
            await processProductScan(productId);
          }
        }
      } catch (error) {
        console.error("Barcode detection error:", error);
      }

      if (scanningRef.current) {
        requestAnimationFrame(scanFrame);
      }
    };

    scanFrame();
  };

  const processProductScan = async (productId: string) => {
    try {
      const response = await fetch("http://localhost:5001/api/products");
      const products: Product[] = await response.json();
      const product = products.find((p) => p.productId === productId);

      if (product) {
        onScan(product);
        setStatus(`Product: ${product.name}`);
      } else {
        setStatus(`Unknown ProductId: ${productId}`);
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      setStatus(`Error fetching product: ${productId}`);
    }

    // Allow re-scanning after 3 seconds
    setTimeout(() => {
      scannedProductsRef.current.delete(productId);
    }, 3000);
  };

  const stopScanner = () => {
    scanningRef.current = false;
    setIsScanning(false);

    if (videoRef.current?.srcObject) {
      const mediaStream = videoRef.current.srcObject as MediaStream;
      mediaStream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }

    setStatus("Scanner stopped");
  };

  const toggleScanner = () => {
    if (isScanning) {
      stopScanner();
    } else {
      startScanner();
    }
  };

  return (
    <div className="card shadow-sm h-full">
      <div className="card-header bg-white py-3 px-4">
        <h3 className="text-xl font-semibold text-gray-800 mb-0 flex items-center">
          <i className="fas fa-camera mr-2" style={{ color: "#00a76f" }}></i>
          Barcode Scanner
        </h3>
      </div>

      <div className="p-4 flex flex-col items-center">
        <div className="relative mb-3 w-full">
          <div
            className={`relative ${
              isScanning ? "" : "bg-gray-100 rounded border"
            }`}
            style={{ minHeight: "200px" }}
          >
            <video
              ref={videoRef}
              className={`w-full rounded ${isScanning ? "border" : "hidden"}`}
              style={{ maxHeight: "300px", objectFit: "cover" }}
              autoPlay
              playsInline
              muted
            />

            {!isScanning && (
              <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center">
                <div className="text-center text-gray-500">
                  <i className="fas fa-camera text-5xl mb-3"></i>
                  <p>Camera inactive</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div
          className={`alert w-full mb-3 ${
            scannedData ? "alert-success" : "alert-secondary"
          }`}
        >
          <div className="flex items-center">
            <div className="mr-3">
              {scannedData ? (
                <i className="fas fa-check-circle text-2xl"></i>
              ) : (
                <i className="fas fa-info-circle text-2xl"></i>
              )}
            </div>
            <div>
              <p className="mb-0">{status}</p>
              {scannedData && (
                <p className="mb-0 text-green-600">
                  Last scanned: {scannedData}
                </p>
              )}
            </div>
          </div>
        </div>

        <button
          onClick={toggleScanner}
          className={`w-full font-semibold py-3 px-4 rounded-md transition-all duration-300 ${
            isScanning ? "btn-stop-scan" : "btn-start-scan"
          }`}
        >
          {isScanning ? (
            <>
              <i className="fas fa-stop mr-2"></i>Stop Scanning
            </>
          ) : (
            <>
              <i className="fas fa-play mr-2"></i>Start Scanning
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default QRScanner;
