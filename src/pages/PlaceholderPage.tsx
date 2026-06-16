interface PlaceholderPageProps {
  title: string
  description: string
}

export function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">{title}</h1>
      <p className="mt-2 max-w-md text-slate-500">{description}</p>
      <p className="mt-6 rounded-lg bg-amber-50 px-4 py-2 text-sm text-amber-700">
        Em breve — módulo em desenvolvimento
      </p>
    </div>
  )
}
