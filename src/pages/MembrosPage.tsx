import { useCallback, useEffect, useState } from "react"
import { Loader2, Pencil, Trash2, UserPlus } from "lucide-react"
import { toast } from "sonner"
import { getSupabaseErrorMessage } from "@/lib/errors"
import { formatDateBR } from "@/lib/dates"
import { deleteMembro, fetchMembros } from "@/services/membros"
import type { Membro } from "@/types/membro"
import { MembroDialog } from "@/components/membros/MembroDialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { DeleteConfirmDialog } from "@/components/ui/delete-confirm-dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

function StatusBadge({ status }: { status: Membro["status_dizimo"] }) {
  if (status === "Ativo") {
    return <Badge variant="success">Ativo</Badge>
  }
  return <Badge variant="destructive">Inadimplente</Badge>
}

export function MembrosPage() {
  const [membros, setMembros] = useState<Membro[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [editingMembro, setEditingMembro] = useState<Membro | null>(null)

  const selectedMembro = membros.find((m) => m.id === selectedId) ?? null

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

  const handleSelect = (id: string, checked: boolean) => {
    setSelectedId(checked ? id : null)
  }

  const handleAdd = () => {
    setEditingMembro(null)
    setDialogOpen(true)
  }

  const handleEdit = () => {
    if (!selectedMembro) return
    setEditingMembro(selectedMembro)
    setDialogOpen(true)
  }

  const handleDelete = async () => {
    if (!selectedId) return
    setIsDeleting(true)
    try {
      await deleteMembro(selectedId)
      toast.success("Membro excluído com sucesso!")
      setSelectedId(null)
      setDeleteOpen(false)
      loadMembros()
    } catch (err) {
      toast.error(getSupabaseErrorMessage(err))
    } finally {
      setIsDeleting(false)
    }
  }

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
        <Button variant="gold" onClick={handleAdd}>
          <UserPlus className="h-4 w-4" />
          Adicionar Membro
        </Button>
      </div>

      {selectedMembro && (
        <div className="flex flex-wrap items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
          <span className="text-sm text-slate-700">
            Selecionado: <strong>{selectedMembro.nome}</strong>
          </span>
          <div className="ml-auto flex gap-2">
            <Button variant="outline" size="sm" onClick={handleEdit}>
              <Pencil className="h-4 w-4" />
              Editar
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-red-200 text-red-700 hover:bg-red-50"
              onClick={() => setDeleteOpen(true)}
            >
              <Trash2 className="h-4 w-4" />
              Excluir
            </Button>
          </div>
        </div>
      )}

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
                  <TableHead className="w-12" />
                  <TableHead>Nome</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Data de Cadastro</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {membros.map((membro) => (
                  <TableRow
                    key={membro.id}
                    data-state={selectedId === membro.id ? "selected" : undefined}
                    className={selectedId === membro.id ? "bg-amber-50/50" : undefined}
                  >
                    <TableCell>
                      <Checkbox
                        checked={selectedId === membro.id}
                        onCheckedChange={(checked) =>
                          handleSelect(membro.id, checked === true)
                        }
                        aria-label={`Selecionar ${membro.nome}`}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{membro.nome}</TableCell>
                    <TableCell>{membro.telefone ?? "—"}</TableCell>
                    <TableCell>{membro.email ?? "—"}</TableCell>
                    <TableCell>
                      <StatusBadge status={membro.status_dizimo} />
                    </TableCell>
                    <TableCell className="text-right text-slate-500">
                      {formatDateBR(membro.data_cadastro)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <MembroDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSuccess={() => {
          setSelectedId(null)
          loadMembros()
        }}
        membro={editingMembro}
      />

      <DeleteConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Excluir membro"
        description={`Tem certeza que deseja excluir "${selectedMembro?.nome}"? Esta ação não pode ser desfeita.`}
        onConfirm={handleDelete}
        isDeleting={isDeleting}
      />
    </div>
  )
}
