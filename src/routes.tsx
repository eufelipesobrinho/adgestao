import { createBrowserRouter } from "react-router-dom"
import { AppLayout } from "@/components/layout/AppLayout"
import { LandingPage } from "@/pages/LandingPage"
import { LoginPage } from "@/pages/LoginPage"
import { DashboardPage } from "@/pages/DashboardPage"
import { MembrosPage } from "@/pages/MembrosPage"
import { PlaceholderPage } from "@/pages/PlaceholderPage"

export const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
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
        element: (
          <PlaceholderPage
            title="Financeiro"
            description="Controle dízimos, ofertas, despesas e o fluxo de caixa."
          />
        ),
      },
      {
        path: "/departamentos",
        element: (
          <PlaceholderPage
            title="Departamentos"
            description="Organize os departamentos e ministérios da igreja."
          />
        ),
      },
      {
        path: "/relatorios",
        element: (
          <PlaceholderPage
            title="Relatórios"
            description="Visualize relatórios financeiros e cadastrais detalhados."
          />
        ),
      },
      {
        path: "/configuracoes",
        element: (
          <PlaceholderPage
            title="Configurações"
            description="Configure preferências e dados da sua igreja."
          />
        ),
      },
    ],
  },
])
