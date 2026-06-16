export interface Departamento {
  id: string
  igreja_id: string
  nome: string
  descricao: string | null
}

export interface DepartamentoFormData {
  nome: string
  descricao: string
}

export interface DepartamentoComMetricas extends Departamento {
  totalArrecadado: number
  totalSaidas: number
}
