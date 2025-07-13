"use client"

import { CheckCircle, Download, Play, X } from "lucide-react"
import { Link } from "react-router-dom"

interface PurchaseConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  courseName: string
  courseId: string
  orderNumber: string
  amount: number
}

export default function PurchaseConfirmationModal({
  isOpen,
  onClose,
  courseName,
  courseId,
  orderNumber,
  amount,
}: PurchaseConfirmationModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-lg w-full p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X className="h-6 w-6" />
        </button>

        <div className="text-center">
          <div className="mb-6">
            <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">¡Compra Exitosa!</h2>
            <p className="text-gray-600">Tu compra se ha procesado correctamente</p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
            <h3 className="font-semibold text-gray-900 mb-3">Detalles de la compra:</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Curso:</span>
                <span className="font-medium text-gray-900">{courseName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Número de orden:</span>
                <span className="font-medium text-gray-900">{orderNumber.slice(0, 8)}...</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total pagado:</span>
                <span className="font-bold text-green-600">${amount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Fecha:</span>
                <span className="font-medium text-gray-900">{new Date().toLocaleDateString("es-ES")}</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Link
              to={`/course/${courseId}`}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded transition-colors flex items-center justify-center"
              onClick={onClose}
            >
              <Play className="h-4 w-4 mr-2" />
              Empezar Curso
            </Link>

            <Link
              to="/my-purchases"
              className="w-full border border-gray-300 hover:bg-gray-50 text-gray-900 font-medium py-3 px-4 rounded transition-colors flex items-center justify-center"
              onClick={onClose}
            >
              <Download className="h-4 w-4 mr-2" />
              Ver Mis Compras
            </Link>

            <button
              onClick={onClose}
              className="w-full text-gray-600 hover:text-gray-800 font-medium py-2 transition-colors"
            >
              Continuar navegando
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
