import { supabase } from "@/lib/supabase"
import type { Departamento } from "@/types/departamento"

export async function fetchDepartamentos(): Promise<Departamento[]> {
  const { data, error } = await supabase
    .from("departamentos")
    .select("*")
    .order("nome", { ascending: true })

  if (error) throw error
  return (data ?? []) as Departamento[]
}
