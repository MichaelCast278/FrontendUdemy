"use client"
import { useState } from "react"
import type React from "react"
import { Star, Clock, Users, Play, CheckCircle, Award, Download, Globe, Smartphone } from "lucide-react"
import type { Course } from "../types/Course"

interface CourseTooltipProps {
  course: Course
  children: React.ReactNode
  isPurchased?: boolean
  className?: string
  disabled?: boolean
  onCourseClick?: (courseId: string) => void
}

// Función para generar "Lo que aprenderás" basado en categorías
const generateLearningOutcomes = (categories: string[], nivel?: string): string[] => {
  const outcomes: string[] = []

  categories.forEach((category) => {
    switch (category.toLowerCase()) {
      case "programación":
        outcomes.push("Fundamentos de programación y lógica")
        outcomes.push("Estructuras de datos y algoritmos básicos")
        break
      case "desarrollo web":
        outcomes.push("Crear páginas web modernas y responsivas")
        outcomes.push("Dominar HTML, CSS y JavaScript")
        break
      case "principiantes":
        outcomes.push("Conceptos básicos desde cero")
        outcomes.push("Ejercicios prácticos paso a paso")
        break
      case "javascript":
        outcomes.push("Programación con JavaScript moderno")
        outcomes.push("Manipulación del DOM y eventos")
        break
      case "react":
        outcomes.push("Crear aplicaciones con React")
        outcomes.push("Componentes y hooks de React")
        break
      case "node.js":
      case "nodejs":
        outcomes.push("Desarrollo backend con Node.js")
        outcomes.push("APIs REST y bases de datos")
        break
      case "python":
        outcomes.push("Programación con Python")
        outcomes.push("Librerías y frameworks populares")
        break
      case "full stack":
        outcomes.push("Desarrollo frontend y backend")
        outcomes.push("Integración de tecnologías completas")
        break
      case "devops":
        outcomes.push("Automatización y despliegue")
        outcomes.push("Herramientas de DevOps modernas")
        break
      case "docker":
        outcomes.push("Containerización con Docker")
        outcomes.push("Orquestación de contenedores")
        break
      case "kubernetes":
        outcomes.push("Orquestación con Kubernetes")
        outcomes.push("Despliegue en la nube")
        break
      case "diseño":
        outcomes.push("Principios de diseño visual")
        outcomes.push("Herramientas de diseño profesional")
        break
      case "negocios":
        outcomes.push("Estrategias de negocio digital")
        outcomes.push("Análisis y toma de decisiones")
        break
      case "management":
        outcomes.push("Técnicas de liderazgo")
        outcomes.push("Gestión de equipos y proyectos")
        break
      default:
        outcomes.push(`Dominar ${category} desde nivel ${nivel?.toLowerCase() || "básico"}`)
        break
    }
  })

  // Si no hay outcomes específicos, agregar genéricos
  if (outcomes.length === 0) {
    outcomes.push("Conceptos fundamentales del tema")
    outcomes.push("Aplicación práctica de conocimientos")
    outcomes.push("Mejores prácticas de la industria")
  }

  // Limitar a 4 outcomes únicos
  return [...new Set(outcomes)].slice(0, 4)
}

// Función para generar características del curso basado en nivel
const getCourseFeatures = (nivel?: string, duracion?: string) => {
  const features = [
    { icon: Clock, text: `${duracion || "8 horas"} de video bajo demanda` },
    { icon: Award, text: "Certificado de finalización" },
    { icon: Smartphone, text: "Acceso en móvil y TV" },
    { icon: Globe, text: "Acceso de por vida" },
  ]

  if (nivel?.toLowerCase().includes("principiante")) {
    features.push({ icon: Users, text: "Ideal para principiantes" })
  } else if (nivel?.toLowerCase().includes("avanzado")) {
    features.push({ icon: Download, text: "Recursos avanzados incluidos" })
  }

  return features.slice(0, 4)
}

// Función para formatear número de estudiantes
const formatStudents = (estudiantes?: string): string => {
  if (!estudiantes) return "1,234"

  // Si ya es un string formateado, devolverlo
  if (typeof estudiantes === "string" && estudiantes.includes(",")) {
    return estudiantes
  }

  // Si es un número, formatearlo
  const num = Number.parseInt(estudiantes.toString())
  if (isNaN(num)) return estudiantes

  return num.toLocaleString()
}

export default function CourseCardWithTooltip({
  course,
  children,
  isPurchased = false,
  className = "",
  disabled = false,
  onCourseClick,
  showTooltip = true,
}: CourseTooltipProps & { showTooltip?: boolean }) {
  const [isVisible, setIsVisible] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })

  const handleMouseEnter = (e: React.MouseEvent) => {
    if (disabled || window.innerWidth < 768) return

    const rect = e.currentTarget.getBoundingClientRect()
    const tooltipWidth = 400
    const tooltipHeight = 500

    let x = rect.right + 10
    let y = rect.top

    if (x + tooltipWidth > window.innerWidth) {
      x = rect.left - tooltipWidth - 10
    }

    if (y + tooltipHeight > window.innerHeight) {
      y = window.innerHeight - tooltipHeight - 10
    }

    if (y < 10) {
      y = 10
    }

    setPosition({ x, y })
    setIsVisible(true)
  }

  const handleMouseLeave = () => {
    setIsVisible(false)
  }

  const handleClick = (e: React.MouseEvent) => {
    // No prevenir la propagación del evento
    if (onCourseClick) {
      onCourseClick(course.curso_id)
    }
  }

  // Generar contenido dinámico basado en los datos disponibles
  const learningOutcomes = generateLearningOutcomes(course.categories, course.nivel)
  const courseFeatures = getCourseFeatures(course.nivel, course.duracion)
  const estrellasLlenas = Math.floor(course.rating || 4.5)
  const formattedStudents = formatStudents(course.estudiantes)

  return (
    <>
      <div
        className={`relative cursor-pointer ${className}`}
        onMouseEnter={showTooltip ? handleMouseEnter : undefined}
        onMouseLeave={showTooltip ? handleMouseLeave : undefined}
        onClick={handleClick}
      >
        {children}
      </div>

      {/* Tooltip Portal */}
      {isVisible && showTooltip && !disabled && (
        <div
          className="fixed z-50 w-96 bg-white border border-gray-200 rounded-lg shadow-2xl overflow-hidden animate-in fade-in-0 zoom-in-95 duration-200 pointer-events-none"
          style={{
            left: `${position.x}px`,
            top: `${position.y}px`,
          }}
        >
          {/* Course Image */}
          <div className="relative">
            <img
              src={course.imagen_url || "/placeholder.svg?height=200&width=400&query=course+preview"}
              alt={course.nombre}
              className="w-full h-48 object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.src = "/placeholder.svg?height=200&width=400"
              }}
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
              <Play className="h-12 w-12 text-white" />
            </div>

            {/* Purchased Badge */}
            {isPurchased && (
              <div className="absolute top-2 right-2">
                <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Adquirido
                </div>
              </div>
            )}

            {/* Category Badge */}
            <div className="absolute top-2 left-2">
              <span className="bg-purple-600 text-white text-xs font-medium px-2 py-1 rounded">
                {course.categories[0]}
              </span>
            </div>

            {/* Level Badge */}
            {course.nivel && (
              <div className="absolute bottom-2 left-2">
                <span className="bg-black bg-opacity-70 text-white text-xs font-medium px-2 py-1 rounded">
                  {course.nivel}
                </span>
              </div>
            )}

            {/* Discount Badge */}
            {course.precio_original && course.precio_original > course.precio && (
              <div className="absolute bottom-2 right-2">
                <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                  -{Math.round(((course.precio_original - course.precio) / course.precio_original) * 100)}%
                </span>
              </div>
            )}
          </div>

          <div className="p-4">
            {/* Course Title */}
            <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">{course.nombre}</h3>

            {/* Course Description */}
            <p className="text-sm text-gray-600 mb-3 line-clamp-3">{course.descripcion}</p>

            {/* Instructor */}
            {course.instructor && (
              <p className="text-sm text-gray-700 mb-2">
                <span className="font-medium">Por:</span> {course.instructor}
              </p>
            )}

            {/* Rating and Stats */}
            <div className="flex items-center mb-3">
              <span className="text-yellow-600 font-bold mr-1">{course.rating || 4.5}</span>
              <div className="flex mr-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3 w-3 ${i < estrellasLlenas ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-500">({formattedStudents} estudiantes)</span>
            </div>

            {/* Course Info */}
            <div className="flex items-center text-sm text-gray-600 mb-3 space-x-4">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                <span>{course.duracion}</span>
              </div>
              {course.nivel && (
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  <span>{course.nivel}</span>
                </div>
              )}
            </div>

            {/* What you'll learn - Generado dinámicamente */}
            <div className="mb-4">
              <h4 className="font-semibold text-gray-900 mb-2">Lo que aprenderás:</h4>
              <ul className="space-y-1">
                {learningOutcomes.map((item, index) => (
                  <li key={index} className="flex items-start text-sm text-gray-700">
                    <div className="flex-shrink-0 w-4 h-4 bg-green-100 rounded-full flex items-center justify-center mt-0.5 mr-2">
                      <div className="w-1.5 h-1.5 bg-green-600 rounded-full"></div>
                    </div>
                    <span className="line-clamp-1">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Course Features - Generado dinámicamente */}
            <div className="mb-4">
              <h4 className="font-semibold text-gray-900 mb-2">Este curso incluye:</h4>
              <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                {courseFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <feature.icon className="h-3 w-3 mr-1" />
                    <span>{feature.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Price and Categories */}
            <div className="flex items-center justify-between mb-4">
              <div>
                {isPurchased ? (
                  <span className="font-bold text-green-600">✓ Adquirido</span>
                ) : (
                  <div className="flex items-center">
                    <span className="text-2xl font-bold text-gray-900">${course.precio}</span>
                    {course.precio_original && course.precio_original > course.precio && (
                      <span className="text-sm text-gray-500 line-through ml-2">${course.precio_original}</span>
                    )}
                  </div>
                )}
              </div>
              <div className="flex flex-wrap gap-1">
                {course.categories.slice(0, 2).map((cat, index) => (
                  <span
                    key={index}
                    className={`text-xs px-2 py-1 rounded ${
                      isPurchased ? "bg-green-100 text-green-600" : "bg-purple-100 text-purple-800"
                    }`}
                  >
                    {cat}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Button */}
            <div className="space-y-2">
              {isPurchased ? (
                <button className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded transition-colors flex items-center justify-center text-sm">
                  <Play className="h-4 w-4 mr-2" />
                  Continuar aprendiendo
                </button>
              ) : (
                <button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded transition-colors text-sm">
                  Ver detalles del curso
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
