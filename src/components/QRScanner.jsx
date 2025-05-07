"use client"

import { useState, useRef, useEffect } from "react"
import { FaCamera, FaInfoCircle, FaQrcode } from "react-icons/fa"

const QRScanner = ({ onScan }) => {
  const [isScanning, setIsScanning] = useState(false)
  const [error, setError] = useState(null)
  const [permissionState, setPermissionState] = useState("prompt") // "prompt", "granted", "denied"
  const videoRef = useRef(null)
  const canvasRef = useRef(null)

  useEffect(() => {
    // Check if BarcodeDetector is supported
    if (!("BarcodeDetector" in window)) {
      setError("Barcode Detector API is not supported in this browser.")
    }

    // Check camera permission status if available
    if (navigator.permissions && navigator.permissions.query) {
      navigator.permissions
        .query({ name: "camera" })
        .then((permissionStatus) => {
          setPermissionState(permissionStatus.state)

          // Listen for permission changes
          permissionStatus.onchange = () => {
            setPermissionState(permissionStatus.state)
          }
        })
        .catch((err) => {
          console.error("Permission query error:", err)
        })
    }

    return () => {
      stopCamera()
    }
  }, [])

  const startCamera = async () => {
    setError(null)

    try {
      const constraints = {
        video: { facingMode: "environment" },
      }

      const stream = await navigator.mediaDevices.getUserMedia(constraints)

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        console.log('Camera stream set:', stream)
        setIsScanning(true)
        videoRef.current.onloadedmetadata = () => {
          scanBarcode()
        }
        setPermissionState("granted")
      } else {
        console.error('videoRef.current is not available')
      }
    } catch (err) {
      console.error("Error accessing camera:", err)

      if (err.name === "NotAllowedError") {
        setError("Camera access denied. Please allow camera access in your browser settings.")
        setPermissionState("denied")
      } else {
        setError("Unable to access camera. Please check your device.")
      }
    }
  }

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks()
      tracks.forEach((track) => track.stop())
      videoRef.current.srcObject = null
    }
    setIsScanning(false)
  }

  const scanBarcode = async () => {
    if (!isScanning || !videoRef.current || !("BarcodeDetector" in window)) return

    try {
      const barcodeDetector = new window.BarcodeDetector({
        formats: ["qr_code", "ean_13", "ean_8", "upc_a", "upc_e"],
      })

      // Draw video frame to canvas for detection
      if (canvasRef.current && videoRef.current.readyState === 4) {
        const canvas = canvasRef.current
        const context = canvas.getContext("2d")
        canvas.width = videoRef.current.videoWidth
        canvas.height = videoRef.current.videoHeight
        context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height)

        const barcodes = await barcodeDetector.detect(canvas)

        if (barcodes.length > 0) {
          // Found a barcode
          const barcode = barcodes[0]
          console.log("Barcode detected:", barcode.rawValue)

          // REMOVE BEFORE DEPLOYMENT: Replace with actual product lookup from database
          // This mock product should be replaced with real data from your backend
          // Uncomment the following block for testing with mock data
          // const mockProduct = {
          //   id: Math.random().toString(36).substr(2, 9),
          //   name: `Product ${barcode.rawValue.substring(0, 4)}`,
          //   price: Number.parseFloat((Math.random() * 20 + 1).toFixed(2)),
          //   serialNumber: `PRD${Math.floor(Math.random() * 10000).toString().padStart(5, "0")}`,
          //   quantity: 1,
          // }

          // Only call onScan if mockProduct is defined (for real implementation, replace with actual product)
          // if (mockProduct) {
          //   onScan(mockProduct)
          //   stopCamera()
          // } else {
          //   // Continue scanning
          //   requestAnimationFrame(scanBarcode)
          // }

          // For now, just stop scanning after detection (remove this in production)
          stopCamera()
        } else {
          // Continue scanning
          requestAnimationFrame(scanBarcode)
        }
      } else {
        requestAnimationFrame(scanBarcode)
      }
    } catch (err) {
      console.error("Barcode detection error:", err)
      setError("Error detecting barcode. Please try again.")
      stopCamera()
    }
  }

  const toggleScanning = () => {
    if (isScanning) {
      stopCamera()
    } else {
      startCamera()
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 h-full">
      <div className="flex items-center gap-2 mb-4">
        <FaQrcode className="text-green-500 text-xl" />
        <h2 className="text-xl font-semibold text-gray-800">Barcode Scanner</h2>
      </div>

      <div className="relative">
        <div className="bg-gray-100 rounded-lg overflow-hidden aspect-video flex items-center justify-center">
          <video
            ref={videoRef}
            className={`w-full h-64 sm:h-80 object-cover rounded-md border border-gray-200 mb-4 ${!isScanning ? 'hidden' : ''}`}
            autoPlay
            playsInline
            muted
          />
          {!isScanning && (
            <div className="flex flex-col items-center justify-center p-8 text-gray-500 w-full h-full absolute top-0 left-0">
              <FaCamera className="text-5xl mb-4 text-gray-300" />
              <p className="text-center">{permissionState === "denied" ? "Camera access denied" : "Camera inactive"}</p>
              {permissionState === "denied" && (
                <p className="text-xs text-center mt-2 text-gray-400">
                  Please enable camera access in your browser settings
                </p>
              )}
            </div>
          )}
          <canvas ref={canvasRef} className="hidden" />
        </div>

        {error && (
          <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-md p-3 flex items-start gap-2">
            <FaInfoCircle className="text-yellow-500 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-yellow-700">{error}</p>
          </div>
        )}

        <button
          onClick={toggleScanning}
          className="w-full bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-md font-medium transition-colors text-lg sm:text-xl"
        >
          {isScanning ? "Stop Scanning" : "Start Scanning"}
        </button>

        <div className="mt-4 text-sm text-gray-500">
          <p>Tip: Position the barcode within the camera view for scanning.</p>
        </div>
      </div>
    </div>
  )
}

export default QRScanner
