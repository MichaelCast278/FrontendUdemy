"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { Trash2, Star, Clock, ShoppingBag, ArrowLeft } from "lucide-react"
import PrivateLayout from "../layouts/PrivateLayout"
import { useCart } from "../contextos/Context-Carrito"
import PurchaseConfirmationModal from "../components/Confirmacion-compra"

export default function Cart() {
  const { state, removeItem, clearCart } = useCart()
  const [isProcessing, setIsProcessing] = useState(false)
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false)
  const [purchaseData, setPurchaseData] = useState<any>(null)

  const realizarCompra = async (items: any[]) => {
    try {
      const token = localStorage.getItem("authToken")
      const tenantId = localStorage.getItem("tenantId")
      const userId = localStorage.getItem("userId")

      if (!token || !tenantId || !userId) {
        throw new Error("Faltan datos de sesión. Inicia sesión nuevamente.")
      }

      setIsProcessing(true)
      const purchases = []

      // Process each item in the cart
      for (const item of items) {
        const body = {
          user_id: userId,
          curso_id: item.curso_id,
          quantity: 1,
          price: item.precio,
        }
        console.log("🚀 Enviando compra al backend:", body)

        const response = await fetch(`https://y4bndl0fk1.execute-api.us-east-1.amazonaws.com/dev/compras`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify(body),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || "Error al realizar la compra")
        }

        const data = await response.json()
        purchases.push(data.compra)
      }

      console.log("✅ Compras realizadas con éxito:", purchases)

      // Set purchase data for modal
      setPurchaseData({
        courseName: items.length === 1 ? items[0].nombre : `${items.length} cursos`,
        courseId: items.length === 1 ? items[0].curso_id : "multiple",
        orderNumber: purchases[0]?.order_id || "MULTI-" + Date.now(),
        amount: state.total,
      })

      // Clear cart after successful purchase
      clearCart()
      setIsPurchaseModalOpen(true)

      return purchases
    } catch (error: any) {
      console.error("❌ Error en la compra:", error)
      alert("Error al realizar la compra: " + error.message)
      throw error
    } finally {
      setIsProcessing(false)
    }
  }

  const handlePurchase = async () => {
    if (state.items.length === 0) return

    try {
      await realizarCompra(state.items)
    } catch (error) {
      console.error("No se pudo completar la compra:", error)
    }
  }

  const handleRemoveItem = (cursoId: string) => {
    removeItem(cursoId)
  }

  if (state.items.length === 0) {
  return (
        <PrivateLayout>
          <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="text-center py-16">
                <ShoppingBag className="h-24 w-24 text-gray-400 mx-auto mb-6" />
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  {purchaseData ? '¡Gracias por tu compra!' : 'Tu carrito está vacío'}
                </h2>
                <p className="text-gray-600 mb-8">
                  {purchaseData
                    ? 'Puedes revisar tus productos adquiridos en la sección de Mis Cursos.'
                    : 'Explora nuestros cursos y añade algunos a tu carrito para comenzar tu aprendizaje'}
                </p>
                <Link
                  to={purchaseData ? "/my-learning" : "/dashboard"}
                  className="inline-flex items-center px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  {purchaseData ? 'Ir a Mis Cursos' : 'Explorar Cursos'}
                </Link>
              </div>
            </div>
          </div>
        </PrivateLayout>
      )
    }


  return (
    <PrivateLayout>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <Link
              to="/dashboard"
              className="inline-flex items-center text-purple-600 hover:text-purple-800 font-medium mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Continuar explorando
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Carrito de Compras</h1>
            <p className="text-gray-600">
              {state.itemCount} curso{state.itemCount !== 1 ? "s" : ""} en tu carrito
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {state.items.map((item) => (
                <div key={item.curso_id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-start space-x-4">
                    <img
                      src={item.imagen_url || "/placeholder.svg?height=120&width=200"}
                      alt={item.nombre}
                      className="w-32 h-20 object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.nombre}</h3>
                      <p className="text-sm text-gray-600 mb-2">Por {item.instructor || "Instructor Experto"}</p>

                      <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                        {item.rating && (
                          <div className="flex items-center">
                            <span className="text-yellow-600 font-medium mr-1">{item.rating}</span>
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-3 w-3 ${
                                    i < Math.floor(item.rating || 0) ? "text-yellow-400 fill-current" : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        )}
                        {item.duracion && (
                          <div className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            <span>{item.duracion}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-xl font-bold text-purple-600">${item.precio}</span>
                        <button
                          onClick={() => handleRemoveItem(item.curso_id)}
                          className="flex items-center text-red-600 hover:text-red-800 text-sm font-medium"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Eliminar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumen del pedido</h3>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      Subtotal ({state.itemCount} curso{state.itemCount !== 1 ? "s" : ""})
                    </span>
                    <span className="font-medium">${state.total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Descuentos</span>
                    <span className="font-medium text-green-600">-$0.00</span>
                  </div>
                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between">
                      <span className="text-lg font-semibold text-gray-900">Total</span>
                      <span className="text-lg font-bold text-purple-600">${state.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handlePurchase}
                  disabled={isProcessing}
                  className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white font-bold py-3 px-4 rounded-lg transition-colors mb-4"
                >
                  {isProcessing ? "Procesando..." : "Finalizar Compra"}
                </button>

                <div className="text-xs text-gray-500 text-center">
                  <p className="mb-2">Garantía de devolución de 30 días</p>
                  <p>Acceso de por vida completo</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Purchase Confirmation Modal */}
      {purchaseData && (
        <PurchaseConfirmationModal
          isOpen={isPurchaseModalOpen}
          onClose={() => setIsPurchaseModalOpen(false)}
          courseName={purchaseData.courseName}
          courseId={purchaseData.courseId}
          orderNumber={purchaseData.orderNumber}
          amount={purchaseData.amount}
        />
      )}
    </PrivateLayout>
  )
}
