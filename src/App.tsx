import{Route, Routes} from "react-router-dom"
import Home from './pages/Home.tsx'
import Login from './pages/Login.tsx'
import Register from './pages/Register.tsx'
import Dashboard from './pages/Dashboard.tsx'
import PrivateLayout from './layouts/PrivateLayout.tsx'
import CourseDetail from './pages/CursoDetalle.tsx'


function App() {
  return(
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/dashboard"
        element={
          <PrivateLayout>
            <Dashboard />
          </PrivateLayout>
        }
      />
      <Route
        path="/course/:courseId"
        element={
          <PrivateLayout>
            <CourseDetail />
          </PrivateLayout>
        }
      />

    </Routes>
    
  )
}

export default App
