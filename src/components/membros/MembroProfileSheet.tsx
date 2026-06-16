import {
  Calendar,
  Mail,
  MapPin,
  Phone,
  User,
} from "lucide-react"
import { formatDateBR } from "@/lib/dates"
import { getInitials } from "@/lib/motion"
import type { Membro } from "@/types/membro"
import { Badge } from "@/components/ui/badge"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"

interface MembroProfileSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  membro: Membro | null
}

function ProfileField({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Mail
  label: string
  value: string
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl bg-slate-50/80 p-4">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm">
        <Icon className="h-4 w-4 text-slate-500" />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium text-slate-500">{label}</p>
        <p className="mt-0.5 text-sm font-medium text-slate-900">{value}</p>
      </div>
    </div>
  )
}

export function MembroProfileSheet({
  open,
  onOpenChange,
  membro,
}: MembroProfileSheetProps) {
  if (!membro) return null

  const initials = getInitials(membro.nome)

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex w-full flex-col overflow-hidden p-0">
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 px-6 pb-8 pt-6 text-white">
          <SheetHeader className="space-y-4 text-left">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500 text-xl font-bold text-slate-900 shadow-lg">
                {initials}
              </div>
              <div>
                <SheetTitle className="text-xl text-white">{membro.nome}</SheetTitle>
                <SheetDescription className="text-slate-300">
                  Perfil do Membro
                </SheetDescription>
              </div>
            </div>
            <Badge
              variant={membro.status_dizimo === "Ativo" ? "success" : "destructive"}
              className="w-fit"
            >
              {membro.status_dizimo}
            </Badge>
          </SheetHeader>
        </div>

        <div className="flex-1 space-y-3 overflow-y-auto px-6 py-6">
          <ProfileField
            icon={Mail}
            label="E-mail"
            value={membro.email ?? "Não informado"}
          />
          <ProfileField
            icon={Phone}
            label="Telefone"
            value={membro.telefone ?? "Não informado"}
          />
          <ProfileField
            icon={MapPin}
            label="Endereço"
            value={membro.endereco ?? "Não informado"}
          />
          <ProfileField
            icon={Calendar}
            label="Data de Nascimento"
            value={
              membro.data_nascimento
                ? formatDateBR(membro.data_nascimento)
                : "Não informada"
            }
          />
          <ProfileField
            icon={User}
            label="Data de Cadastro"
            value={formatDateBR(membro.data_cadastro)}
          />
        </div>
      </SheetContent>
    </Sheet>
  )
}
