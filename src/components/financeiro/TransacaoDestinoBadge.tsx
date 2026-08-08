import type { Transacao } from "@/types/transacao"
import { Badge } from "@/components/ui/badge"

export function TransacaoDestinoBadge({
  transacao,
}: {
  transacao: Transacao
}) {
  if (!transacao.departamento_id) {
    return (
      <Badge variant="secondary" className="font-normal text-muted-foreground">
        Caixa Geral
      </Badge>
    )
  }

  return (
    <Badge variant="muted" className="font-normal text-foreground">
      {transacao.departamentos?.nome ?? "Departamento"}
    </Badge>
  )
}
