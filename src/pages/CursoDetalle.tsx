"use client"

import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import {
  Play,
  Star,
  Users,
  Clock,
  Download,
  Award,
  Globe,
  Smartphone,
  ChevronDown,
  ChevronUp,
  Heart,
  Share2,
  ShoppingCart,
  Check,
} from "lucide-react"
import PrivateLayout from "../layouts/PrivateLayout"
import type { Course } from "../types/Course"
import { useCart } from "../contextos/Context-Carrito"

interface CourseDetail extends Course {
  descripcion_larga?: string
  requisitos?: string[]
  que_aprenderas?: string[]
  contenido?: {
    seccion: string
    lecciones: number
    duracion: string
  }[]
  instructor_bio?: string
  certificado?: boolean
  acceso_movil?: boolean
  descargas?: boolean
  subtitulos?: boolean
}

export default function CourseDetail() {
  const { courseId } = useParams<{ courseId: string }>()
  const [course, setCourse] = useState<CourseDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedSection, setExpandedSection] = useState<string | null>(null)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [showAddedToCart, setShowAddedToCart] = useState(false)

  const { addItem, state: cartState } = useCart()
  const API_BASE_URL = "https://t1uohu23vl.execute-api.us-east-1.amazonaws.com/dev"

  // Check if course is already in cart
  const isInCart = course ? cartState.items.some((item) => item.curso_id === course.curso_id) : false

  const fetchCourseDetail = async () => {
    if (!courseId) return

    try {
      setIsLoading(true)
      const token = localStorage.getItem("authToken")
      const tenantId = localStorage.getItem("tenantId")

      const response = await fetch(`${API_BASE_URL}/cursos/${courseId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        console.log("✅ Detalle del curso:", data)
        setCourse(data.curso || data)
      } else {
        setError("Error al cargar el curso")
        console.error("❌ Error HTTP:", response.status)
      }
    } catch (error) {
      setError("Error de conexión")
      console.error("❌ Error al hacer fetch:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchCourseDetail()
  }, [courseId])

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section)
  }

  const handleAddToCart = () => {
    if (!course || isInCart) return

    const cartItem = {
      curso_id: course.curso_id,
      nombre: course.nombre,
      precio: Number(course.precio),
      imagen_url: course.imagen_url,
      instructor: course.instructor,
      duracion: course.duracion,
      rating: course.rating,
    }

    addItem(cartItem)
    setShowAddedToCart(true)

    // Hide the "added to cart" message after 3 seconds
    setTimeout(() => {
      setShowAddedToCart(false)
    }, 3000)
  }

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted)
  }

  if (isLoading) {
    return (
      <PrivateLayout>
        <div className="min-h-screen bg-gray-50">
          <div className="animate-pulse">
            <div className="bg-gray-900 h-96">
              <div className="max-w-7xl mx-auto px-4 py-16">
                <div className="grid lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2">
                    <div className="h-8 bg-gray-700 rounded mb-4"></div>
                    <div className="h-4 bg-gray-700 rounded mb-2 w-3/4"></div>
                    <div className="h-4 bg-gray-700 rounded w-1/2"></div>
                  </div>
                  <div className="bg-gray-800 h-64 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </PrivateLayout>
    )
  }

  if (error || !course) {
    return (
      <PrivateLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{error || "Curso no encontrado"}</h2>
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
        {/* Hero Section */}
        <section className="bg-gray-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                {/* Breadcrumb */}
                <nav className="mb-6">
                  <div className="flex items-center space-x-2 text-sm">
                    <Link to="/dashboard" className="text-purple-400 hover:text-purple-300">
                      Dashboard
                    </Link>
                    <span className="text-gray-400">/</span>
                    <span className="text-gray-300">{course.nombre}</span>
                  </div>
                </nav>

                <h1 className="text-3xl lg:text-4xl font-bold mb-4">{course.nombre}</h1>
                <p className="text-xl text-gray-300 mb-6">
                  {course.descripcion || "Aprende las habilidades más demandadas del mercado"}
                </p>

                {/* Course Stats */}
                <div className="flex flex-wrap items-center gap-6 mb-6">
                  <div className="flex items-center">
                    <span className="text-yellow-400 font-bold mr-2">{course.rating || 4.5}</span>
                    <div className="flex mr-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(course.rating || 4.5) ? "text-yellow-400 fill-current" : "text-gray-400"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-purple-400">({course.estudiantes || "1,234"} estudiantes)</span>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <Users className="h-4 w-4 mr-2" />
                    <span>{course.estudiantes || "1,234"} estudiantes</span>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>{course.duracion || "8 horas"} de contenido</span>
                  </div>
                </div>

                <p className="text-gray-300">
                  Creado por{" "}
                  <span className="text-purple-400 font-medium">{course.instructor || "Instructor Experto"}</span>
                </p>
              </div>

              {/* Course Preview Card */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow-xl overflow-hidden sticky top-8">
                  <div className="relative">
                    <img
                      src={course.imagen_url || "/placeholder.svg?height=200&width=400"}
                      alt={course.nombre}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                      <button className="bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-4 transition-all">
                        <Play className="h-8 w-8 text-gray-900 ml-1" />
                      </button>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="mb-4">
                      <div className="flex items-baseline">
                        <span className="text-3xl font-bold text-gray-900">${course.precio || "84.99"}</span>
                        {course.precio_original && (
                          <span className="text-lg text-gray-500 line-through ml-2">${course.precio_original}</span>
                        )}
                      </div>
                    </div>

                    <div className="space-y-3">
                      {/* Add to Cart Button */}
                      <button
                        onClick={handleAddToCart}
                        disabled={isInCart}
                        className={`w-full font-bold py-3 px-4 rounded transition-colors flex items-center justify-center ${
                          isInCart
                            ? "bg-green-600 text-white cursor-not-allowed"
                            : showAddedToCart
                              ? "bg-green-600 text-white"
                              : "bg-purple-600 hover:bg-purple-700 text-white"
                        }`}
                      >
                        {isInCart ? (
                          <>
                            <Check className="h-4 w-4 mr-2" />
                            En el carrito
                          </>
                        ) : showAddedToCart ? (
                          <>
                            <Check className="h-4 w-4 mr-2" />
                            ¡Añadido al carrito!
                          </>
                        ) : (
                          <>
                            <ShoppingCart className="h-4 w-4 mr-2" />
                            Agregar al carrito
                          </>
                        )}
                      </button>

                      {/* Go to Cart Button - Show when item is in cart */}
                      {isInCart && (
                        <Link
                          to="/cart"
                          className="w-full border-2 border-purple-600 text-purple-600 hover:bg-purple-50 font-medium py-3 px-4 rounded transition-colors flex items-center justify-center"
                        >
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          Ir al carrito
                        </Link>
                      )}

                      <button
                        onClick={handleWishlist}
                        className="w-full border border-gray-300 hover:bg-gray-50 text-gray-900 font-medium py-3 px-4 rounded transition-colors flex items-center justify-center"
                      >
                        <Heart className={`h-4 w-4 mr-2 ${isWishlisted ? "fill-current text-red-500" : ""}`} />
                        {isWishlisted ? "En lista de deseos" : "Agregar a lista de deseos"}
                      </button>

                      <button className="w-full border border-gray-300 hover:bg-gray-50 text-gray-900 font-medium py-3 px-4 rounded transition-colors flex items-center justify-center">
                        <Share2 className="h-4 w-4 mr-2" />
                        Compartir
                      </button>
                    </div>

                    {/* Course Features */}
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <h4 className="font-semibold text-gray-900 mb-3">Este curso incluye:</h4>
                      <ul className="space-y-2 text-sm text-gray-600">
                        <li className="flex items-center">
                          <Clock className="h-4 w-4 mr-2" />
                          {course.duracion || "8 horas"} de video bajo demanda
                        </li>
                        <li className="flex items-center">
                          <Download className="h-4 w-4 mr-2" />
                          Recursos descargables
                        </li>
                        <li className="flex items-center">
                          <Smartphone className="h-4 w-4 mr-2" />
                          Acceso en móvil y TV
                        </li>
                        <li className="flex items-center">
                          <Award className="h-4 w-4 mr-2" />
                          Certificado de finalización
                        </li>
                        <li className="flex items-center">
                          <Globe className="h-4 w-4 mr-2" />
                          Acceso de por vida
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Course Content */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* What you'll learn */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Lo que aprenderás</h2>
            <div className="grid md:grid-cols-2 gap-3">
              {(
                course.que_aprenderas || [
                  "Conceptos fundamentales del desarrollo",
                  "Mejores prácticas de la industria",
                  "Proyectos prácticos y reales",
                  "Técnicas avanzadas de programación",
                ]
              ).map((item, index) => (
                <div key={index} className="flex items-start">
                  <div className="flex-shrink-0 w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mt-0.5 mr-3">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  </div>
                  <span className="text-gray-700">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Course Description */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Descripción</h2>
            <div className="prose max-w-none text-gray-700">
              <p>
                {course.descripcion_larga ||
                  course.descripcion ||
                  "Este curso te proporcionará todas las habilidades necesarias para dominar esta tecnología. Aprenderás desde los conceptos básicos hasta técnicas avanzadas, con proyectos prácticos que te permitirán aplicar lo aprendido en situaciones reales."}
              </p>
            </div>
          </div>

          {/* Requirements */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Requisitos</h2>
            <ul className="space-y-2">
              {(
                course.requisitos || [
                  "Conocimientos básicos de programación",
                  "Computadora con acceso a internet",
                  "Ganas de aprender y practicar",
                ]
              ).map((req, index) => (
                <li key={index} className="flex items-start text-gray-700">
                  <span className="text-gray-400 mr-2">•</span>
                  {req}
                </li>
              ))}
            </ul>
          </div>

          {/* Course Content/Curriculum */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Contenido del curso</h2>
            <div className="space-y-2">
              {(
                course.contenido || [
                  { seccion: "Introducción", lecciones: 5, duracion: "45 min" },
                  { seccion: "Conceptos Fundamentales", lecciones: 8, duracion: "2 horas" },
                  { seccion: "Práctica Avanzada", lecciones: 12, duracion: "3 horas" },
                  { seccion: "Proyecto Final", lecciones: 6, duracion: "2.5 horas" },
                ]
              ).map((section, index) => (
                <div key={index} className="border border-gray-200 rounded">
                  <button
                    onClick={() => toggleSection(`section-${index}`)}
                    className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-gray-50"
                  >
                    <div>
                      <h3 className="font-medium text-gray-900">{section.seccion}</h3>
                      <p className="text-sm text-gray-500">
                        {section.lecciones} lecciones • {section.duracion}
                      </p>
                    </div>
                    {expandedSection === `section-${index}` ? (
                      <ChevronUp className="h-5 w-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                  {expandedSection === `section-${index}` && (
                    <div className="px-4 pb-3 border-t border-gray-200 bg-gray-50">
                      <div className="pt-3 space-y-2">
                        {[...Array(section.lecciones)].map((_, lessonIndex) => (
                          <div key={lessonIndex} className="flex items-center text-sm text-gray-600">
                            <Play className="h-3 w-3 mr-2" />
                            <span>Lección {lessonIndex + 1}: Contenido de ejemplo</span>
                            <span className="ml-auto">5:30</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </PrivateLayout>
  )
}
