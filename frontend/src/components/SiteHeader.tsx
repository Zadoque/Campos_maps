type SiteHeaderProps = {
  compact?: boolean;
};

export function SiteHeader({ compact = false }: SiteHeaderProps) {
  return (
    <header
      className={`flex items-center justify-between gap-3 px-4 text-slate-100 sm:px-7 ${compact ? 'min-h-14 bg-emerald-950 py-3 sm:h-16 sm:py-0' : 'py-5'}`}
    >
      <a
        href="#/"
        className="font-bold tracking-[2px]"
        aria-label="Campos Maps — início"
      >
        <span className="mr-2 text-lime-300">✦</span>CAMPOS
        <span className="ml-1 font-normal text-emerald-300">MAPS</span>
      </a>
      <nav className="flex items-center gap-1 text-[11px] font-semibold sm:gap-2 sm:text-xs">
        <a
          className="rounded-md px-2 py-2 hover:bg-white/10 sm:px-3"
          href="#/presentation"
        >
          Apresentação
        </a>
        <a
          className="rounded-md bg-lime-300 px-2 py-2 text-emerald-950 hover:bg-lime-200 sm:px-3"
          href="#/map"
        >
          Ver mapa
        </a>
      </nav>
    </header>
  );
}
