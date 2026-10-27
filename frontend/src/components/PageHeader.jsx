export default function PageHeader({ eyebrow, title, description, action }) {
  return (
    <div className="mb-7 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        {eyebrow ? <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-mint">{eyebrow}</p> : null}
        <h1 className="text-3xl font-bold text-white md:text-4xl">{title}</h1>
        {description ? <p className="mt-3 max-w-2xl text-sm leading-6 text-white/60">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}
