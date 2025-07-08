import { useRef ,useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
// @ts-ignore
import "swiper/css";
// @ts-ignore
import "swiper/css/navigation";

import { Navigation } from "swiper/modules"
import { HiChevronLeft, HiChevronRight } from "react-icons/hi"
import { Link } from "react-router-dom"

import banner1 from "../assets/banner3.jpg"
import banner2 from "../assets/banner2.png"
import banner3 from "../assets/banner4.jpg"
import banner4 from "../assets/banner5.png"

const slides = [
  { img: banner1 }, // Slide 0 (personalizado)
  { img: banner2, text: "Explora cientos de cursos diseñados para ti." },
  { img: banner3, text: "Aprende a tu ritmo, sin límites." },
  { img: banner4, text: "Únete a miles de estudiantes hoy." },
]

export default function CarruselProBotones() {
  const swiperRef = useRef<any>(null)
  const [userName, setUserName] = useState("Usuario")

  useEffect(() => {
    const stored = localStorage.getItem("userId") || sessionStorage.getItem("userId")
    if (stored) {
      const name = stored.split("@")[0]
      setUserName(name.charAt(0).toUpperCase() + name.slice(1))
    }
  }, [])

  return (
    <div className="relative w-full h-[400px]">
      <Swiper
        modules={[Navigation]}
        loop={true}
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        className="h-full"
      >
        {slides.map((slide, i) => (
          <SwiperSlide key={i}>
            <div className="relative w-full h-[400px]">
              <img
                src={slide.img}
                alt={`Slide ${i}`}
                className="w-full h-full object-cover"
              />

              {/* Texto superpuesto */}
              {i === 0 ? (
                <div className="absolute top-1/2 left-16 transform -translate-y-1/2 bg-white p-6 rounded-lg shadow-md max-w-md z-20">
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    Te extrañamos, {userName}
                  </h1>
                  <p className="text-gray-600 mb-8">
                    Vuelve a la pista y logra tus objetivos. 5-10 minutos al día es todo lo que necesitas.
                  </p>
                  <Link
                    to="/learning"
                    className="text-purple-600 hover:text-purple-700 font-medium underline"
                  >
                    Volver a la pista
                  </Link>
                </div>
              ) : (
                <div className="absolute top-1/2 left-16 transform -translate-y-1/2 bg-white p-6 rounded-lg shadow-md max-w-md z-20">
                  <h2 className="text-xl font-semibold text-gray-900">{slide.text}</h2>
                </div>
              )}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Botón izquierdo */}
      <button
        onClick={() => swiperRef.current?.slidePrev()}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white rounded-full shadow p-2 z-30"
      >
        <HiChevronLeft className="w-6 h-6 text-gray-700" />
      </button>

      {/* Botón derecho */}
      <button
        onClick={() => swiperRef.current?.slideNext()}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white rounded-full shadow p-2 z-30"
      >
        <HiChevronRight className="w-6 h-6 text-gray-700" />
      </button>
    </div>
  )
}
