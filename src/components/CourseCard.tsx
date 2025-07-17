"use client"

import { Link } from "react-router-dom"
import { Star, Clock, Users, CheckCircle, Lock, Play } from "lucide-react"
import type { Course } from "../types/Course"

interface CourseCardProps {
  course: Course
  isPurchased?: boolean
  progress?: number
  showProgress?: boolean
}

export default function CourseCardEnhanced({
  course,
  isPurchased = false,
  progress = 0,
  showProgress = false,
}: CourseCardProps) {
  const firstCategory = course.categories?.[0] || "General"
  const estrellasLlenas = Math.floor(course.rating ?? 4.5)

  return (
    <Link
      to={isPurchased ? `/course/${course.curso_id}/learn` : `/course/${course.curso_id}`}
      className={`bg-white border rounded-lg overflow-hidden hover:shadow-lg transition-all duration-200 group relative ${
        isPurchased ? "border-green-200 shadow-sm ring-1 ring-green-100" : "border-gray-200"
      }`}
    >
      {/* Purchased Badge */}
      {isPurchased && (
        <div className="absolute top-2 right-2 z-10">
          <div className="bg-green-500 text-white rounded-full p-1">
            <CheckCircle className="h-4 w-4" />
          </div>
        </div>
      )}

      <div className="relative">
        <img
          src={course.imagen_url || "/placeholder.jpg"}
          alt={course.nombre}
          className={`w-full h-48 object-cover transition-all ${isPurchased ? "opacity-100" : "opacity-90"}`}
          onError={(e) => {
            const target = e.target as HTMLImageElement
            target.src = "/placeholder.jpg"
          }}
        />

        {/* Category Badge */}
        <div className="absolute top-2 left-2">
          <span
            className={`text-white text-xs font-medium px-2 py-1 rounded ${
              isPurchased ? "bg-green-600" : "bg-purple-600"
            }`}
          >
            {firstCategory}
          </span>
        </div>

        {/* Overlay */}
        <div
          className={`absolute inset-0 bg-black transition-opacity flex items-center justify-center ${
            isPurchased ? "bg-opacity-0 group-hover:bg-opacity-20" : "bg-opacity-0 group-hover:bg-opacity-30"
          }`}
        >
          {isPurchased ? (
            <Play className="h-12 w-12 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
          ) : (
            <Lock className="h-8 w-8 text-white opacity-0 group-hover:opacity-70 transition-opacity" />
          )}
        </div>

        {/* Progress Bar for purchased courses */}
        {isPurchased && showProgress && progress > 0 && (
          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-2">
            <div className="w-full bg-gray-300 rounded-full h-1">
              <div className="bg-green-500 h-1 rounded-full transition-all" style={{ width: `${progress}%` }}></div>
            </div>
            <p className="text-white text-xs mt-1">{progress}% completado</p>
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className={`font-bold mb-2 text-sm line-clamp-2 ${isPurchased ? "text-green-900" : "text-gray-900"}`}>
          {course.nombre}
        </h3>

        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{course.descripcion}</p>

        {/* Rating */}
        <div className="flex items-center mb-2">
          <span className="text-yellow-600 text-sm font-bold mr-1">{course.rating ?? 4.5}</span>
          <div className="flex mr-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-3 w-3 ${i < estrellasLlenas ? "text-yellow-400 fill-current" : "text-gray-300"}`}
              />
            ))}
          </div>
          <span className="text-xs text-gray-500">({course.estudiantes ?? "1,234"})</span>
        </div>

        {/* Duration and Level */}
        <div className="flex items-center text-xs text-gray-500 mb-3">
          <Clock className="h-3 w-3 mr-1" />
          <span className="mr-3">{course.duracion}</span>
          <Users className="h-3 w-3 mr-1" />
          <span>{course.nivel ?? "Principiante"}</span>
        </div>

        {/* Price and Status */}
        <div className="flex items-center justify-between">
          <div>
            {isPurchased ? (
              <span className="font-bold text-green-600 text-sm">✓ Adquirido</span>
            ) : (
              <span className="font-bold text-gray-900">${course.precio}</span>
            )}
          </div>

          <div className="flex flex-wrap gap-1">
            {course.categories?.slice(0, 2).map((cat, index) => (
              <span
                key={index}
                className={`text-xs px-2 py-1 rounded ${
                  isPurchased ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-600"
                }`}
              >
                {cat}
              </span>
            ))}
          </div>
        </div>

        {/* Action Button */}
        {isPurchased && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <button className="w-full bg-green-600 hover:bg-green-700 text-white text-sm font-medium py-2 px-4 rounded transition-colors flex items-center justify-center">
              <Play className="h-4 w-4 mr-2" />
              {progress === 0 ? "Empezar curso" : "Continuar aprendiendo"}
            </button>
          </div>
        )}
      </div>
    </Link>
  )
}
