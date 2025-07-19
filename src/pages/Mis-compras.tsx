"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Calendar, DollarSign, Package, Eye } from "lucide-react"
import PrivateLayout from "../layouts/PrivateLayout"

interface Purchase {
  tenant_id: string
  order_id: string
  user_id: string
  curso_id: string
  quantity: number
  price: number
  timestamp: string
}

interface PurchaseWithCourse extends Purchase {
  course_name?: string
  course_image?: string
  instructor?: string
}

export default function MyPurchases() {
  const [purchases, setPurchases] = useState<PurchaseWithCourse[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const API_BASE_URL = "https://qek7hwbtb8.execute-api.us-east-1.amazonaws.com/dev"

  const fetchPurchases = async () => {
    try {
      setIsLoading(true)
      const token = localStorage.getItem("authToken")

      const userId = localStorage.getItem("userId")

      if (!userId) {
        setError("Debes iniciar sesión para ver tus compras")
        return
      }

      const response = await fetch(`${API_BASE_URL}/compras?user_id=${userId}&limit=50`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,

        },
      })

      if (response.ok) {
        const data = await response.json()
        console.log("✅ Compras obtenidas:", data)
        setPurchases(data.compras || [])
      } else {
        setError("Error al cargar las compras")
      }
    } catch (error) {
      setError("Error de conexión")
      console.error("❌ Error al obtener compras:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchPurchases()
  }, [])

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const calculateTotal = () => {
    return purchases.reduce((total, purchase) => total + purchase.price * purchase.quantity, 0).toFixed(2)
  }

  if (isLoading) {
    return (
      <PrivateLayout>
        <div className="min-h-screen bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-300 rounded w-1/3 mb-8"></div>
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="bg-white p-6 rounded-lg shadow-sm">
                    <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
                    <div className="h-3 bg-gray-300 rounded w-1/3"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </PrivateLayout>
    )
  }

  if (error) {
    return (
      <PrivateLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{error}</h2>
            <Link to="/dashboard" className="text-purple-600 hover:text-purple-800 font-medium">
              Volver al dashboard
            </Link>
          </div>
        </div>
      </PrivateLayout>
    )
  }

  return (
    <PrivateLayout>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Mis Compras</h1>
            <p className="text-gray-600">Historial completo de tus adquisiciones</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center">
                <Package className="h-8 w-8 text-purple-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Total de Cursos</p>
                  <p className="text-2xl font-bold text-gray-900">{purchases.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center">
                <DollarSign className="h-8 w-8 text-green-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Gastado</p>
                  <p className="text-2xl font-bold text-gray-900">${calculateTotal()}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-blue-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Última Compra</p>
                  <p className="text-sm font-bold text-gray-900">
                    {purchases.length > 0 ? formatDate(purchases[0].timestamp).split(",")[0] : "Sin compras"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Purchases List */}
          {purchases.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No tienes compras aún</h3>
              <p className="text-gray-600 mb-6">Explora nuestros cursos y comienza tu aprendizaje</p>
              <Link
                to="/dashboard"
                className="inline-flex items-center px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors"
              >
                Explorar Cursos
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {purchases.map((purchase) => (
                <div
                  key={purchase.order_id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">Curso ID: {purchase.curso_id}</h3>
                        <span className="text-lg font-bold text-green-600">
                          ${(purchase.price * purchase.quantity).toFixed(2)}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">Orden:</span> {purchase.order_id.slice(0, 8)}...
                        </div>
                        <div>
                          <span className="font-medium">Cantidad:</span> {purchase.quantity}
                        </div>
                        <div>
                          <span className="font-medium">Fecha:</span> {formatDate(purchase.timestamp)}
                        </div>
                      </div>
                    </div>

                    <div className="ml-6 flex space-x-2">
                      <Link
                        to={`/course/${purchase.curso_id}`}
                        className="inline-flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded transition-colors"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Ver Curso
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </PrivateLayout>
  )
}
