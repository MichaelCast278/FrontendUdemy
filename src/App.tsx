import{Route, Routes} from "react-router-dom"
import Home from './pages/Home.tsx'
import Login from './pages/Login.tsx'
import Register from './pages/Register.tsx'
import Dashboard from './pages/Dashboard.tsx'
import CourseDetail from './pages/CursoDetalle.tsx'
import MyPurchases from './pages/Mis-compras.tsx'
import { CartProvider } from './contextos/Context-Carrito'
import Cart from './pages/Carrito.tsx'
import Profile from './pages/Perfil.tsx'
import MyLearning from "./pages/MyAprendizaje.tsx"



function App() {
  return (
    <CartProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/course/:courseId" element={<CourseDetail />} />
        <Route path="/my-purchases" element={<MyPurchases />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/my-learning" element={<MyLearning />} />
      </Routes>
    </CartProvider>
  )
}


export default App
