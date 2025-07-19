"use client"
import { Star, Users, Clock, Play, CheckCircle } from "lucide-react"
import CourseTooltip from "./Tooltip"
import type { Course } from "../types/Course"

interface CourseCardWithTooltipProps {
  course: Course
  isPurchased?: boolean
  onCourseClick?: (courseId: string) => void // ← Agregar esta propiedad
  showTooltip?: boolean
  className?: string
}

export default function CourseCardWithTooltip({
  course,
  isPurchased = false,
  onCourseClick,
  showTooltip = true,
  className = "",
}: CourseCardWithTooltipProps) {
  const handleClick = () => {
    if (onCourseClick) {
      onCourseClick(course.curso_id)
    }
  }

  const courseCard = (
    <div
      onClick={handleClick}
      className={`border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow group relative bg-white cursor-pointer ${className}`}
    >
      {/* Purchased Badge */}
      {isPurchased && (
        <div className="absolute top-2 right-2 z-10">
          <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center shadow-sm">
            <CheckCircle className="h-3 w-3 mr-1" />
            Comprado
          </div>
        </div>
      )}

      <div className="relative">
        <img
          src={
            course.imagen_url && course.imagen_url.startsWith("http")
              ? course.imagen_url
              : "/placeholder.svg?height=160&width=300&query=course+thumbnail"
          }
          alt={course.nombre}
          className="w-full h-40 object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement
            target.src = "/placeholder.svg?height=160&width=300"
          }}
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity flex items-center justify-center">
          <Play className="h-12 w-12 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors">
          {course.nombre}
        </h3>
        <p className="text-sm text-gray-600 mb-2">{course.instructor || "Instructor"}</p>

        {/* Rating */}
        <div className="flex items-center mb-2">
          <span className="text-yellow-500 text-sm font-semibold mr-1">{course.rating || 4.5}</span>
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-3 w-3 ${
                  i < Math.floor(course.rating || 4.5) ? "text-yellow-400 fill-current" : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-gray-500 ml-2">({course.estudiantes || "1,234"})</span>
        </div>

        {/* Course info */}
        <div className="flex items-center text-xs text-gray-500 mb-3">
          <Clock className="h-3 w-3 mr-1" />
          <span>{course.duracion || "8 horas"}</span>
          <Users className="h-3 w-3 ml-3 mr-1" />
          <span>{course.nivel || "Principiante"}</span>
        </div>

        {/* Price and category */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <span className="font-bold text-gray-900">${course.precio || 84.99}</span>
            {course.precio_original && course.precio_original > course.precio && (
              <span className="text-sm text-gray-500 line-through ml-2">${course.precio_original}</span>
            )}
          </div>
          {course.categories?.length > 0 && (
            <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">{course.categories[0]}</span>
          )}
        </div>

        {/* Action Button */}
        {isPurchased ? (
          <button className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded transition-colors flex items-center justify-center text-sm">
            <Play className="h-4 w-4 mr-2" />
            Continuar aprendiendo
          </button>
        ) : (
          <button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded transition-colors flex items-center justify-center text-sm">
            Ver detalles
          </button>
        )}
      </div>
    </div>
  )

  // Wrap with tooltip if enabled
  if (showTooltip) {
    return (
      <CourseTooltip course={course} isPurchased={isPurchased} className={className}>
        {courseCard}
      </CourseTooltip>
    )
  }

  return courseCard
}
