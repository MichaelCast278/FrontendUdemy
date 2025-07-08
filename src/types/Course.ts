// src/types/Course.ts

export interface Course {
  curso_id: string
  tenant_id: string
  nombre: string
  descripcion: string
  instructor?: string
  precio: number
  precio_original?: number
  rating?: number
  estudiantes?: string
  duracion: string
  imagen_url: string
  categories: string[]
  nivel?: string
}
