export function PageHeader({ title, description }: { title: string; description?: string }) {
  return (
    <div>
      <h1 className="font-black text-3xl text-(--sea-ink) tracking-tight">{title}</h1>
      {description ? <p className="mt-1 text-muted-foreground">{description}</p> : null}
    </div>
  )
}
