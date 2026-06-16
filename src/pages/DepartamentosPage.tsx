import { useCallback, useEffect, useState } from "react"
import { Building2, Loader2, Plus } from "lucide-react"
import { toast } from "sonner"
import { getSupabaseErrorMessage } from "@/lib/errors"
import {
  deleteDepartamento,
  fetchDepartamentosComMetricas,
} from "@/services/departamentos"
import type { DepartamentoComMetricas } from "@/types/departamento"
import { DepartamentoCard } from "@/components/departamentos/DepartamentoCard"
import { DepartamentoCardSkeleton } from "@/components/departamentos/DepartamentoCardSkeleton"
import { DepartamentoSheet } from "@/components/departamentos/DepartamentoSheet"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { FadeIn } from "@/components/ui/motion"

export function DepartamentosPage() {
  const [departamentos, setDepartamentos] = useState<DepartamentoComMetricas[]>(
    []
  )
  const [isLoading, setIsLoading] = useState(true)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [editingDepartamento, setEditingDepartamento] =
    useState<DepartamentoComMetricas | null>(null)
  const [deletingDepartamento, setDeletingDepartamento] =
    useState<DepartamentoComMetricas | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const loadDepartamentos = useCallback(async () => {
    setIsLoading(true)
    try {
      const data = await fetchDepartamentosComMetricas()
      setDepartamentos(data)
    } catch (err) {
      toast.error(getSupabaseErrorMessage(err))
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadDepartamentos()
  }, [loadDepartamentos])

  const handleCreate = () => {
    setEditingDepartamento(null)
    setSheetOpen(true)
  }

  const handleEdit = (departamento: DepartamentoComMetricas) => {
    setEditingDepartamento(departamento)
    setSheetOpen(true)
  }

  const handleDelete = async () => {
    if (!deletingDepartamento) return
    setIsDeleting(true)
    try {
      await deleteDepartamento(deletingDepartamento.id)
      toast.success("Departamento excluído com sucesso!")
      setDeletingDepartamento(null)
      loadDepartamentos()
    } catch (err) {
      toast.error(getSupabaseErrorMessage(err))
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="space-y-6">
      <FadeIn>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">
              Departamentos
            </h1>
            <p className="mt-1 text-slate-500">
              Organize ministérios e acompanhe o desempenho financeiro
            </p>
          </div>
          <Button variant="gold" onClick={handleCreate}>
            <Plus className="h-4 w-4" />
            Novo Departamento
          </Button>
        </div>
      </FadeIn>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <DepartamentoCardSkeleton key={index} />
          ))}
        </div>
      ) : departamentos.length === 0 ? (
        <FadeIn delay={0.05}>
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/50 py-20 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
              <Building2 className="h-7 w-7 text-slate-400" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-slate-900">
              Nenhum departamento cadastrado
            </h3>
            <p className="mt-1 max-w-sm text-sm text-slate-500">
              Crie departamentos como Jovens, Missões ou Louvor para organizar
              suas finanças.
            </p>
            <Button variant="gold" className="mt-6" onClick={handleCreate}>
              <Plus className="h-4 w-4" />
              Novo Departamento
            </Button>
          </div>
        </FadeIn>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {departamentos.map((departamento, index) => (
            <DepartamentoCard
              key={departamento.id}
              departamento={departamento}
              index={index}
              onEdit={handleEdit}
              onDelete={setDeletingDepartamento}
            />
          ))}
        </div>
      )}

      <DepartamentoSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        onSuccess={loadDepartamentos}
        departamento={editingDepartamento}
      />

      <AlertDialog
        open={!!deletingDepartamento}
        onOpenChange={(open) => !open && setDeletingDepartamento(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir departamento</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir &quot;{deletingDepartamento?.nome}
              &quot;? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault()
                handleDelete()
              }}
              disabled={isDeleting}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Excluindo...
                </>
              ) : (
                "Excluir"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
