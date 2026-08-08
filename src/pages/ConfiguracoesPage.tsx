import { Building2, Shield, Users } from "lucide-react"
import { GeralTab } from "@/components/configuracoes/GeralTab"
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
            Gerencie o perfil da igreja, segurança e usuários. O tema claro/escuro
            fica no ícone no topo da tela.
          </p>
        </div>
      </FadeIn>

      <FadeIn delay={0.05}>
        <Tabs defaultValue="geral" className="w-full">
          <TabsList className="grid h-auto w-full grid-cols-3 gap-1">
            <TabsTrigger value="geral" className="gap-2">
              <Building2 className="h-4 w-4 shrink-0" />
              <span>Geral</span>
            </TabsTrigger>
            <TabsTrigger value="seguranca" className="gap-2">
              <Shield className="h-4 w-4 shrink-0" />
              <span>Segurança</span>
            </TabsTrigger>
            <TabsTrigger value="usuarios" className="gap-2">
              <Users className="h-4 w-4 shrink-0" />
              <span>Usuários</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="geral">
            <GeralTab />
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
