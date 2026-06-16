import { Link } from "react-router-dom"
import {
  Users,
  Wallet,
  BarChart3,
  Shield,
  MessageCircle,
} from "lucide-react"
import { Logo } from "@/components/brand/Logo"
import { WHATSAPP_SUPPORT_URL } from "@/lib/constants"
import { Button } from "@/components/ui/button"

const features = [
  {
    icon: Users,
    title: "Gestão de Membros",
    description:
      "Cadastro completo, histórico e acompanhamento pastoral em um só lugar.",
  },
  {
    icon: Wallet,
    title: "Controle Financeiro",
    description:
      "Dízimos, ofertas e despesas organizados com relatórios claros.",
  },
  {
    icon: BarChart3,
    title: "Relatórios Inteligentes",
    description:
      "Visualize a saúde financeira e cadastral da sua igreja em segundos.",
  },
  {
    icon: Shield,
    title: "Seguro e Confiável",
    description:
      "Dados protegidos com acesso controlado para cada departamento.",
  },
]

export function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Logo size="md" />
          <Button variant="outline" asChild>
            <Link to="/login">Login da Igreja</Link>
          </Button>
        </div>
      </header>

      <section className="bg-slate-900 px-4 py-20 text-center md:py-28">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl">
            Gestão Inteligente para sua Igreja
          </h1>
          <p className="mt-6 text-lg text-slate-300 md:text-xl">
            Chega de planilhas confusas e horas perdidas com burocracia.
            Concentre-se no que realmente importa: o pastoreio e o cuidado com
            as ovelhas.
          </p>
          <div className="mt-10">
            <Button variant="gold" size="lg" asChild>
              <a
                href={WHATSAPP_SUPPORT_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="h-5 w-5" />
                Falar com Suporte (WhatsApp)
              </a>
            </Button>
          </div>
        </div>
      </section>

      <section className="px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-3xl font-bold text-slate-900">
            Tudo que sua secretaria precisa
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-slate-600">
            Um sistema completo pensado para a realidade das igrejas brasileiras.
          </p>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-xl border bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-500/10">
                  <feature.icon className="h-6 w-6 text-amber-600" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-slate-900">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm text-slate-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-900 px-4 py-20">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-3xl font-bold text-white">
            Pronto para transformar a gestão da sua igreja?
          </h2>
          <p className="mt-4 text-slate-300">
            Fale com nossa equipe e descubra como o AD Gestão pode simplificar
            o dia a dia da sua secretaria.
          </p>
          <div className="mt-8">
            <Button variant="gold" size="lg" asChild>
              <a
                href={WHATSAPP_SUPPORT_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="h-5 w-5" />
                Falar com Suporte (WhatsApp)
              </a>
            </Button>
          </div>
        </div>
      </section>

      <footer className="border-t px-4 py-8 text-center text-sm text-slate-500">
        &copy; {new Date().getFullYear()} AD Gestão. Todos os direitos reservados.
      </footer>
    </div>
  )
}
