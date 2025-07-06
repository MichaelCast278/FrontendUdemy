import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
// @ts-ignore
import "swiper/css";
// @ts-ignore
import "swiper/css/navigation";

import { Navigation } from "swiper/modules";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";

import banner1 from "../assets/banner1.png";
import banner2 from "../assets/banner2.png";

const slides = [banner1, banner2];

export default function CarruselProBotones() {
  const swiperRef = useRef<any>(null); // referencia al Swiper

  return (
    <div className="relative w-full h-[400px]">
      <Swiper
        modules={[Navigation]}
        loop={true} // se repite de forma infinita
        onSwiper={(swiper) => (swiperRef.current = swiper)} // almacena instancia
        className="h-full"
      >
        {slides.map((src, i) => (
          <SwiperSlide key={i}>
            <img
              src={src}
              alt={`Slide ${i}`}
              className="w-full h-[400px] object-cover"
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Botón izquierdo */}
      <button
        onClick={() => swiperRef.current?.slidePrev()}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white rounded-full shadow p-2 z-10"
      >
        <HiChevronLeft className="w-6 h-6 text-gray-700" />
      </button>

      {/* Botón derecho */}
      <button
        onClick={() => swiperRef.current?.slideNext()}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white rounded-full shadow p-2 z-10"
      >
        <HiChevronRight className="w-6 h-6 text-gray-700" />
      </button>
    </div>
  );
}