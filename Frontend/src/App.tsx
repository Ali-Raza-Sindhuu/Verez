import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AdminRouteLayout } from './routes/AdminRouteLayout'
import { ProductsPage } from './pages/ProductsPage'
import { HomePage } from './pages/HomePage'
import { AdminDashboardPage } from './pages/AdminDashboardPage'
import { NotFoundPage } from './pages/NotFoundPage'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />

        <Route path="/admin" element={<AdminRouteLayout />}>
          <Route index element={<AdminDashboardPage />} />
          <Route path="dashboard" element={<AdminDashboardPage />} />
          <Route path="products" element={<ProductsPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App