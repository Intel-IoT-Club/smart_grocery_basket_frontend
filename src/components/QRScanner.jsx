"use client"

import { useState, useRef, useEffect } from "react"
import { FaCamera, FaInfoCircle, FaQrcode } from "react-icons/fa"
import PropTypes from 'prop-types'

const QRScanner = ({ onScan }) => {
  const [isScanning, setIsScanning] = useState(false)
  const [error, setError] = useState(null)
  const [isCameraSupported, setIsCameraSupported] = useState(true)
  const videoRef = useRef(null)
  const canvasRef = useRef(null)

  useEffect(() => {
    // Check if BarcodeDetector is supported
    if (!("BarcodeDetector" in window)) {
      setError("Barcode Detector API is not supported in this browser.")
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
        setIsScanning(true)
        scanBarcode()
      }
    } catch (err) {
      console.error("Error accessing camera:", err)
      setError("Unable to access camera. Please check permissions.")
      setIsCameraSupported(false)
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

          // Mock product lookup based on barcode
          const mockProduct = {
            id: Math.random().toString(36).substr(2, 9),
            name: `Product ${barcode.rawValue.substring(0, 4)}`,
            price: Number.parseFloat((Math.random() * 20 + 1).toFixed(2)),
            image: `/placeholder.svg?height=100&width=100`,
            quantity: 1,
          }

          onScan(mockProduct)
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
          {isScanning ? (
            <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
          ) : (
            <div className="flex flex-col items-center justify-center p-8 text-gray-500">
              <FaCamera className="text-5xl mb-4 text-gray-300" />
              <p className="text-center">Camera inactive</p>
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
          disabled={!isCameraSupported && !isScanning}
          className={`mt-4 w-full py-3 px-4 rounded-md font-medium flex items-center justify-center gap-2 ${
            isScanning ? "bg-red-500 hover:bg-red-600 text-white" : "bg-green-500 hover:bg-green-600 text-white"
          } transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
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

QRScanner.propTypes = {
  onScan: PropTypes.func.isRequired
}

export default QRScanner
