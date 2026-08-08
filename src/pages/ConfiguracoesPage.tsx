import { Building2, Navigation, Shield, Users } from "lucide-react"
import { GeralTab } from "@/components/configuracoes/GeralTab"
import { NavegacaoTab } from "@/components/configuracoes/NavegacaoTab"
import { SegurancaTab } from "@/components/configuracoes/SegurancaTab"
import { UsuariosTab } from "@/components/configuracoes/UsuariosTab"
import { FadeIn } from "@/components/ui/motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function ConfiguracoesPage() {
  return (
    <div className="space-y-6">
      <FadeIn>
        <div>
          <h1 className="text-2xl font-bold text-foreground md:text-3xl">
            Configurações
          </h1>
          <p className="mt-1 text-muted-foreground">
            Gerencie perfil, navegação, segurança e usuários
          </p>
        </div>
      </FadeIn>

      <FadeIn delay={0.05}>
        <Tabs defaultValue="geral" className="w-full">
          <TabsList className="scrollbar-none flex h-auto w-full flex-nowrap justify-start gap-1 overflow-x-auto sm:grid sm:grid-cols-2 lg:grid-cols-4">
            <TabsTrigger value="geral" className="shrink-0 gap-2 sm:flex-1">
              <Building2 className="h-4 w-4 shrink-0" />
              <span>Geral</span>
            </TabsTrigger>
            <TabsTrigger value="navegacao" className="shrink-0 gap-2 sm:flex-1">
              <Navigation className="h-4 w-4 shrink-0" />
              <span>Navegação</span>
            </TabsTrigger>
            <TabsTrigger value="seguranca" className="shrink-0 gap-2 sm:flex-1">
              <Shield className="h-4 w-4 shrink-0" />
              <span>Segurança</span>
            </TabsTrigger>
            <TabsTrigger value="usuarios" className="shrink-0 gap-2 sm:flex-1">
              <Users className="h-4 w-4 shrink-0" />
              <span>Usuários</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="geral">
            <GeralTab />
          </TabsContent>
          <TabsContent value="navegacao">
            <NavegacaoTab />
          </TabsContent>
          <TabsContent value="seguranca">
            <SegurancaTab />
          </TabsContent>
          <TabsContent value="usuarios">
            <UsuariosTab />
          </TabsContent>
        </Tabs>
      </FadeIn>
    </div>
  )
}
