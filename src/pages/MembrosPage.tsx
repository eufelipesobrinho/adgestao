import { useCallback, useEffect, useState } from "react"
import { Loader2, UserPlus } from "lucide-react"
import { toast } from "sonner"
import { getSupabaseErrorMessage } from "@/lib/errors"
import { fetchMembros } from "@/services/membros"
import type { Membro } from "@/types/membro"
import { AddMembroDialog } from "@/components/membros/AddMembroDialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat("pt-BR").format(new Date(dateString))
}

function StatusBadge({ status }: { status: Membro["status"] }) {
  if (status === "Ativo") {
    return <Badge variant="success">Ativo</Badge>
  }
  return <Badge variant="destructive">Inadimplente</Badge>
}

export function MembrosPage() {
  const [membros, setMembros] = useState<Membro[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)

  const loadMembros = useCallback(async () => {
    setIsLoading(true)
    try {
      const data = await fetchMembros()
      setMembros(data)
    } catch (err) {
      toast.error(getSupabaseErrorMessage(err))
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadMembros()
  }, [loadMembros])

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">
            Membros
          </h1>
          <p className="mt-1 text-slate-500">
            Gerencie o cadastro dos membros da igreja
          </p>
        </div>
        <Button variant="gold" onClick={() => setDialogOpen(true)}>
          <UserPlus className="h-4 w-4" />
          Adicionar Membro
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Lista de Membros</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
            </div>
          ) : membros.length === 0 ? (
            <div className="py-16 text-center text-slate-500">
              Nenhum membro cadastrado ainda.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Data de Cadastro</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {membros.map((membro) => (
                  <TableRow key={membro.id}>
                    <TableCell className="font-medium">{membro.nome}</TableCell>
                    <TableCell>{membro.telefone ?? "—"}</TableCell>
                    <TableCell>{membro.email ?? "—"}</TableCell>
                    <TableCell>
                      <StatusBadge status={membro.status} />
                    </TableCell>
                    <TableCell className="text-right text-slate-500">
                      {formatDate(membro.created_at)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <AddMembroDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSuccess={loadMembros}
      />
    </div>
  )
}
