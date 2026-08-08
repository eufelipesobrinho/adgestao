import { useCallback, useEffect, useState } from "react"
import {
  CreditCard,
  Landmark,
  Loader2,
  MoreVertical,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react"
import { toast } from "sonner"
import { formatCurrency } from "@/lib/dates"
import { getSupabaseErrorMessage } from "@/lib/errors"
import {
  deleteBankAccount,
  deleteCreditCard,
  fetchBankAccounts,
  fetchCreditCards,
} from "@/services/contas"
import type { BankAccount, CreditCard as CreditCardType } from "@/types/conta"
import { CartaoSheet } from "@/components/contas/CartaoSheet"
import { ContaSheet } from "@/components/contas/ContaSheet"
import { SensitiveValue } from "@/components/privacy/SensitiveValue"
import { MobileCard, MobileDetailRow } from "@/components/mobile/mobile-list"
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { FadeIn } from "@/components/ui/motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function ContasPage() {
  const [accounts, setAccounts] = useState<BankAccount[]>([])
  const [cards, setCards] = useState<CreditCardType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [contaSheetOpen, setContaSheetOpen] = useState(false)
  const [cartaoSheetOpen, setCartaoSheetOpen] = useState(false)
  const [editingAccount, setEditingAccount] = useState<BankAccount | null>(null)
  const [editingCard, setEditingCard] = useState<CreditCardType | null>(null)
  const [deletingAccount, setDeletingAccount] = useState<BankAccount | null>(null)
  const [deletingCard, setDeletingCard] = useState<CreditCardType | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const loadData = useCallback(async () => {
    setIsLoading(true)
    try {
      const [accountsData, cardsData] = await Promise.all([
        fetchBankAccounts(),
        fetchCreditCards(),
      ])
      setAccounts(accountsData)
      setCards(cardsData)
    } catch (err) {
      toast.error(getSupabaseErrorMessage(err))
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  const handleDeleteAccount = async () => {
    if (!deletingAccount) return
    setIsDeleting(true)
    try {
      await deleteBankAccount(deletingAccount.id)
      toast.success("Conta excluída com sucesso!")
      setDeletingAccount(null)
      loadData()
    } catch (err) {
      toast.error(getSupabaseErrorMessage(err))
    } finally {
      setIsDeleting(false)
    }
  }

  const handleDeleteCard = async () => {
    if (!deletingCard) return
    setIsDeleting(true)
    try {
      await deleteCreditCard(deletingCard.id)
      toast.success("Cartão excluído com sucesso!")
      setDeletingCard(null)
      loadData()
    } catch (err) {
      toast.error(getSupabaseErrorMessage(err))
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="space-y-6">
      <FadeIn>
        <div>
          <h1 className="text-2xl font-bold text-foreground md:text-3xl">
            Contas e Cartões
          </h1>
          <p className="mt-1 text-muted-foreground">
            Cadastre contas bancárias e cartões para vincular às movimentações
          </p>
        </div>
      </FadeIn>

      <FadeIn delay={0.05}>
        <Tabs defaultValue="contas" className="w-full">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <TabsList className="grid w-full grid-cols-2 sm:w-auto sm:min-w-[320px]">
              <TabsTrigger value="contas" className="gap-2">
                <Landmark className="h-4 w-4" />
                Contas
              </TabsTrigger>
              <TabsTrigger value="cartoes" className="gap-2">
                <CreditCard className="h-4 w-4" />
                Cartões
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="contas" className="mt-4 space-y-4">
            <div className="flex justify-end">
              <Button
                variant="gold"
                onClick={() => {
                  setEditingAccount(null)
                  setContaSheetOpen(true)
                }}
              >
                <Plus className="h-4 w-4" />
                Nova Conta
              </Button>
            </div>

            {isLoading ? (
              <div className="flex justify-center py-16">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : accounts.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border bg-muted/30 py-16 text-center">
                <p className="font-medium text-foreground">Nenhuma conta cadastrada</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Cadastre a primeira conta bancária ou o caixa da igreja.
                </p>
              </div>
            ) : (
              <>
                <div className="hidden gap-4 md:grid md:grid-cols-2 xl:grid-cols-3">
                  {accounts.map((account) => (
                    <Card key={account.id} className="border-border shadow-sm">
                      <CardHeader className="flex flex-row items-start justify-between gap-2 pb-2">
                        <div className="min-w-0">
                          <CardTitle className="truncate text-lg">
                            {account.nome_banco}
                          </CardTitle>
                          <p className="mt-1 text-sm text-muted-foreground">
                            {account.tipo}
                          </p>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => {
                                setEditingAccount(account)
                                setContaSheetOpen(true)
                              }}
                            >
                              <Pencil className="h-4 w-4" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => setDeletingAccount(account)}
                              className="text-red-600"
                            >
                              <Trash2 className="h-4 w-4" />
                              Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </CardHeader>
                      <CardContent className="space-y-1 text-sm text-muted-foreground">
                        <p>
                          Agência: {account.agencia || "—"} · Conta:{" "}
                          {account.conta || "—"}
                        </p>
                        <p className="text-base font-semibold text-foreground">
                          Saldo inicial:{" "}
                          <SensitiveValue>
                            {formatCurrency(Number(account.saldo_inicial))}
                          </SensitiveValue>
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="flex flex-col gap-3 md:hidden">
                  {accounts.map((account) => (
                    <MobileCard key={account.id}>
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="font-semibold text-foreground">
                            {account.nome_banco}
                          </p>
                          <p className="text-sm text-muted-foreground">{account.tipo}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => {
                            setEditingAccount(account)
                            setContaSheetOpen(true)
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="mt-3 space-y-2 border-t border-border pt-3">
                        <MobileDetailRow label="Agência">
                          {account.agencia || "—"}
                        </MobileDetailRow>
                        <MobileDetailRow label="Conta">
                          {account.conta || "—"}
                        </MobileDetailRow>
                        <MobileDetailRow label="Saldo inicial">
                          <SensitiveValue>
                            {formatCurrency(Number(account.saldo_inicial))}
                          </SensitiveValue>
                        </MobileDetailRow>
                      </div>
                    </MobileCard>
                  ))}
                </div>
              </>
            )}
          </TabsContent>

          <TabsContent value="cartoes" className="mt-4 space-y-4">
            <div className="flex justify-end">
              <Button
                variant="gold"
                onClick={() => {
                  setEditingCard(null)
                  setCartaoSheetOpen(true)
                }}
              >
                <Plus className="h-4 w-4" />
                Novo Cartão
              </Button>
            </div>

            {isLoading ? (
              <div className="flex justify-center py-16">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : cards.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border bg-muted/30 py-16 text-center">
                <p className="font-medium text-foreground">Nenhum cartão cadastrado</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Cadastre cartões de crédito com limite e datas do ciclo.
                </p>
              </div>
            ) : (
              <>
                <div className="hidden gap-4 md:grid md:grid-cols-2 xl:grid-cols-3">
                  {cards.map((card) => (
                    <Card key={card.id} className="border-border shadow-sm">
                      <CardHeader className="flex flex-row items-start justify-between gap-2 pb-2">
                        <div className="min-w-0">
                          <CardTitle className="truncate text-lg">
                            {card.nome_cartao}
                          </CardTitle>
                          <p className="mt-1 text-sm text-muted-foreground">
                            {card.bandeira}
                          </p>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => {
                                setEditingCard(card)
                                setCartaoSheetOpen(true)
                              }}
                            >
                              <Pencil className="h-4 w-4" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => setDeletingCard(card)}
                              className="text-red-600"
                            >
                              <Trash2 className="h-4 w-4" />
                              Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </CardHeader>
                      <CardContent className="space-y-1 text-sm text-muted-foreground">
                        <p>
                          Fecha dia {card.dia_fechamento} · Vence dia{" "}
                          {card.dia_vencimento}
                        </p>
                        <p className="text-base font-semibold text-foreground">
                          Limite:{" "}
                          <SensitiveValue>
                            {formatCurrency(Number(card.limite))}
                          </SensitiveValue>
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="flex flex-col gap-3 md:hidden">
                  {cards.map((card) => (
                    <MobileCard key={card.id}>
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="font-semibold text-foreground">
                            {card.nome_cartao}
                          </p>
                          <p className="text-sm text-muted-foreground">{card.bandeira}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => {
                            setEditingCard(card)
                            setCartaoSheetOpen(true)
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="mt-3 space-y-2 border-t border-border pt-3">
                        <MobileDetailRow label="Fechamento">
                          Dia {card.dia_fechamento}
                        </MobileDetailRow>
                        <MobileDetailRow label="Vencimento">
                          Dia {card.dia_vencimento}
                        </MobileDetailRow>
                        <MobileDetailRow label="Limite">
                          <SensitiveValue>
                            {formatCurrency(Number(card.limite))}
                          </SensitiveValue>
                        </MobileDetailRow>
                      </div>
                    </MobileCard>
                  ))}
                </div>
              </>
            )}
          </TabsContent>
        </Tabs>
      </FadeIn>

      <ContaSheet
        open={contaSheetOpen}
        onOpenChange={setContaSheetOpen}
        onSuccess={loadData}
        account={editingAccount}
      />
      <CartaoSheet
        open={cartaoSheetOpen}
        onOpenChange={setCartaoSheetOpen}
        onSuccess={loadData}
        card={editingCard}
      />

      <AlertDialog
        open={!!deletingAccount}
        onOpenChange={(open) => !open && setDeletingAccount(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir conta?</AlertDialogTitle>
            <AlertDialogDescription>
              A conta &quot;{deletingAccount?.nome_banco}&quot; será removida. Transações
              vinculadas ficarão sem conta associada.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteAccount} disabled={isDeleting}>
              {isDeleting ? "Excluindo..." : "Excluir"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={!!deletingCard}
        onOpenChange={(open) => !open && setDeletingCard(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir cartão?</AlertDialogTitle>
            <AlertDialogDescription>
              O cartão &quot;{deletingCard?.nome_cartao}&quot; será removido. Transações
              vinculadas ficarão sem cartão associado.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteCard} disabled={isDeleting}>
              {isDeleting ? "Excluindo..." : "Excluir"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
