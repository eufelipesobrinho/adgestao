import { createBrowserRouter, Navigate } from "react-router-dom"
import { AppLayout } from "@/components/layout/AppLayout"
import { RootRoute } from "@/components/routing/RootRoute"
import { DashboardPage } from "@/pages/DashboardPage"
import { MembrosPage } from "@/pages/MembrosPage"
import { FinanceiroPage } from "@/pages/FinanceiroPage"
import { DepartamentosPage } from "@/pages/DepartamentosPage"
import { RelatoriosPage } from "@/pages/RelatoriosPage"
import { ConfiguracoesPage } from "@/pages/ConfiguracoesPage"

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootRoute />,
  },
  {
    path: "/login",
    element: <Navigate to="/" replace />,
  },
  {
    element: <AppLayout />,
    children: [
      {
        path: "/dashboard",
        element: <DashboardPage />,
      },
      {
        path: "/membros",
        element: <MembrosPage />,
      },
      {
        path: "/financeiro",
        element: <FinanceiroPage />,
      },
      {
        path: "/departamentos",
        element: <DepartamentosPage />,
      },
      {
        path: "/relatorios",
        element: <RelatoriosPage />,
      },
      {
        path: "/configuracoes",
        element: <ConfiguracoesPage />,
      },
    ],
  },
])
