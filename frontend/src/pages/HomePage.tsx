import { SiteHeader } from '../components/SiteHeader';

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-hidden bg-emerald-950 text-white">
      <SiteHeader />
      <section className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-7xl items-center gap-10 px-5 py-12 sm:px-8 md:grid-cols-[1.1fr_0.9fr] md:py-16 lg:px-12">
        <div>
          <p className="font-mono text-xs tracking-[0.22em] text-lime-300">
            PROJETO DE BANCO DE DADOS NOSQL
          </p>
          <h1 className="mt-5 max-w-3xl text-4xl font-bold leading-[1.05] sm:text-5xl lg:text-7xl">
            As ruas de Campos como um{' '}
            <span className="text-lime-300">grafo navegável.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-emerald-100 sm:text-lg">
            Uma aplicação acadêmica que transforma dados reais do OpenStreetMap
            em nós e relacionamentos no Neo4j para calcular três rotas distintas
            pela cidade.
          </p>
          <div className="mt-8 grid max-w-xl grid-cols-1 gap-3 sm:grid-cols-2">
            <a
              href="#/presentation"
              className="flex min-h-12 items-center justify-center rounded-lg border border-emerald-600 px-5 font-semibold hover:bg-white/10"
            >
              Apresentação
            </a>
            <a
              href="#/map"
              className="flex min-h-12 items-center justify-center rounded-lg bg-lime-300 px-5 font-semibold text-emerald-950 hover:bg-lime-200"
            >
              Ver mapa
            </a>
          </div>
        </div>
        <div className="relative mx-auto w-full max-w-lg">
          <div className="absolute -inset-10 rounded-full bg-lime-300/10 blur-3xl" />
          <div className="relative rounded-2xl border border-emerald-700 bg-emerald-900/70 p-5 shadow-2xl sm:p-7">
            <div className="mb-6 flex items-center justify-between font-mono text-[10px] text-emerald-300">
              <span>GRAFO VIÁRIO REAL</span>
              <span>NEO4J</span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                'RoadNode',
                'ROAD',
                'shortestPath',
                'OSM/PBF',
                'Zod',
                'Playwright',
              ].map((item, index) => (
                <div
                  key={item}
                  className={`flex aspect-square items-center justify-center rounded-full border text-center text-[10px] font-semibold sm:text-xs ${index === 1 || index === 2 ? 'border-lime-300 bg-lime-300 text-emerald-950' : 'border-emerald-600 bg-emerald-950 text-emerald-100'}`}
                >
                  {item}
                </div>
              ))}
            </div>
            <div className="mt-5 rounded-lg bg-emerald-950 p-3 font-mono text-[10px] leading-5 text-emerald-200 sm:text-xs">
              (origem)-[:ROAD {'{ meters }'}]-&gt;(destino)
              <br />
              MATCH path = shortestPath(...)
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
