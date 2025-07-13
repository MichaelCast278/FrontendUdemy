"use client"
import { Link } from "react-router-dom"
import { Star, Clock, Users } from "lucide-react"
import type { Course } from "../types/Course" // ✅ Ajusta la ruta si es diferente

interface CourseCardProps {
  course: Course
}

export default function CourseCard({ course }: CourseCardProps) {
  const firstCategory = course.categories?.[0] || "General"
  const estrellasLlenas = Math.floor(course.rating ?? 4.5)

  return (
    <Link
      to={`/course/${course.curso_id}`}
      className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-200 group"
    >
      <div className="relative">
        <img
          src={course.imagen_url || "/placeholder.jpg"}
          alt={course.nombre}
          className="w-full h-48 object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement
            target.src = "/placeholder.jpg"
          }}
        />
        <div className="absolute top-2 left-2">
          <span className="bg-purple-600 text-white text-xs font-medium px-2 py-1 rounded">
            {firstCategory}
          </span>
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-bold text-gray-900 mb-2 text-sm line-clamp-2">{course.nombre}</h3>

        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{course.descripcion}</p>

        {/* Rating dinámico */}
        <div className="flex items-center mb-2">
          <span className="text-yellow-600 text-sm font-bold mr-1">{course.rating ?? 4.5}</span>
          <div className="flex mr-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-3 w-3 ${
                  i < estrellasLlenas ? "text-yellow-400 fill-current" : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-gray-500">({course.estudiantes ?? "1,234"})</span>
        </div>

        {/* Duración y nivel */}
        <div className="flex items-center text-xs text-gray-500 mb-3">
          <Clock className="h-3 w-3 mr-1" />
          <span className="mr-3">{course.duracion}</span>
          <Users className="h-3 w-3 mr-1" />
          <span>{course.nivel ?? "Principiante"}</span>
        </div>

        {/* Precio y categorías */}
        <div className="flex items-center justify-between">
          <div>
            <span className="font-bold text-gray-900">${course.precio}</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {course.categories?.slice(0, 2).map((cat, index) => (
              <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                {cat}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  )
}
