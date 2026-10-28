import { useEffect, useState, type ReactNode } from 'react';
import { SiteHeader } from '../components/SiteHeader';

type Slide = {
  eyebrow: string;
  title: string;
  content: ReactNode;
};

const codeClass =
  'mt-4 overflow-x-auto rounded-lg bg-slate-950 p-4 font-mono text-xs leading-6 text-lime-200 sm:text-sm';

const dijkstraSteps = [
  {
    selected: 'A',
    distances: ['0', '4', '2', '∞', '∞', '∞'],
    previous: ['—', 'A', 'A', '—', '—', '—'],
    note: 'Partimos de A. Relaxamos A→B (4) e A→C (2).',
  },
  {
    selected: 'C',
    distances: ['0', '3', '2', '10', '12', '∞'],
    previous: ['—', 'C', 'A', 'C', 'C', '—'],
    note: 'C é o menor não visitado. A rota A→C→B custa 3 e melhora B.',
  },
  {
    selected: 'B',
    distances: ['0', '3', '2', '8', '12', '∞'],
    previous: ['—', 'C', 'A', 'B', 'C', '—'],
    note: 'B é fixado com custo 3. B→D reduz D de 10 para 8.',
  },
  {
    selected: 'D',
    distances: ['0', '3', '2', '8', '10', '14'],
    previous: ['—', 'C', 'A', 'B', 'D', 'D'],
    note: 'D é fixado. D→E melhora E para 10 e D→F cria custo 14.',
  },
  {
    selected: 'E',
    distances: ['0', '3', '2', '8', '10', '13'],
    previous: ['—', 'C', 'A', 'B', 'D', 'E'],
    note: 'E é fixado. E→F reduz o destino de 14 para 13.',
  },
  {
    selected: 'F',
    distances: ['0', '3', '2', '8', '10', '13'],
    previous: ['—', 'C', 'A', 'B', 'D', 'E'],
    note: 'F é fixado. Pelos predecessores: F←E←D←B←C←A. Caminho final: A–C–B–D–E–F.',
  },
];

function DijkstraExample({ step }: { step: number }) {
  const current = dijkstraSteps[step];
  const nodes = ['A', 'B', 'C', 'D', 'E', 'F'];
  const positions: Record<string, string> = {
    A: 'left-[10%] top-1/2',
    B: 'left-[34%] top-[22%]',
    C: 'left-[34%] top-[78%]',
    D: 'left-[61%] top-[22%]',
    E: 'left-[61%] top-[78%]',
    F: 'left-[88%] top-1/2',
  };
  const edges = [
    ['left-[13%] top-[38%] w-[25%] rotate-[-25deg]', '4', 'A-B'],
    ['left-[13%] top-[62%] w-[25%] rotate-[25deg]', '2', 'A-C'],
    ['left-[34%] top-[22%] w-[36%] rotate-90', '1', 'C-B'],
    ['left-[37%] top-[22%] w-[27%]', '5', 'B-D'],
    ['left-[37%] top-[22%] w-[41%] rotate-[55deg]', '7', 'B-E'],
    ['left-[37%] top-[78%] w-[41%] rotate-[-55deg]', '8', 'C-D'],
    ['left-[37%] top-[78%] w-[27%]', '10', 'C-E'],
    ['left-[61%] top-[22%] w-[36%] rotate-90', '2', 'D-E'],
    ['left-[64%] top-[22%] w-[27%] rotate-[25deg]', '6', 'D-F'],
    ['left-[64%] top-[78%] w-[27%] rotate-[-25deg]', '3', 'E-F'],
  ];
  const visited = new Set(
    dijkstraSteps.slice(0, step + 1).map((item) => item.selected),
  );
  return (
    <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
      <div className="rounded-xl bg-slate-950 p-4 text-white">
        <div className="relative h-64 rounded-lg border border-emerald-800 bg-slate-950 text-center sm:h-80">
          {edges.map(([lineClass, weight, edge]) => (
            <div
              className={`absolute h-0.5 origin-left transition-colors duration-500 ${lineClass} ${visited.has(edge[0]) && visited.has(edge[2]) ? 'bg-lime-300' : 'bg-emerald-800'}`}
              data-edge={edge}
              key={edge}
            >
              <span className="absolute -top-5 left-1/2 rounded bg-emerald-900 px-1.5 py-0.5 font-mono text-[11px] text-lime-200">
                {weight}
              </span>
            </div>
          ))}
          {nodes.map((node) => (
            <div
              key={node}
              className={`absolute flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 font-bold shadow-lg transition-all duration-500 sm:h-14 sm:w-14 ${positions[node]} ${node === current.selected ? 'scale-125 border-lime-200 bg-lime-300 text-emerald-950' : visited.has(node) ? 'border-lime-400 bg-emerald-500 text-white' : 'border-emerald-600 bg-emerald-950 text-emerald-100'}`}
            >
              {node}
            </div>
          ))}
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2 font-mono text-xs text-emerald-200 sm:grid-cols-3">
          {[
            'A—B 4',
            'A—C 2',
            'C—B 1',
            'C—D 8',
            'C—E 10',
            'B—E 7',
            'B—D 5',
            'D—E 2',
            'D—F 6',
            'E—F 3',
          ].map((edge) => (
            <span key={edge} className="rounded bg-white/5 px-2 py-1">
              {edge}
            </span>
          ))}
        </div>
      </div>
      <div className="min-w-0">
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full min-w-[520px] border-collapse text-center text-sm">
            <thead className="bg-emerald-950 text-white">
              <tr>
                <th className="p-3 text-left">Vetor</th>
                {nodes.map((node) => (
                  <th className="p-3" key={node}>
                    {node}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-slate-200">
                <th className="p-3 text-left">distância</th>
                {current.distances.map((value, index) => (
                  <td
                    className={`p-3 font-mono ${nodes[index] === current.selected ? 'bg-lime-100 font-bold' : ''}`}
                    key={nodes[index]}
                  >
                    {value}
                  </td>
                ))}
              </tr>
              <tr className="border-t border-slate-200">
                <th className="p-3 text-left">anterior</th>
                {current.previous.map((value, index) => (
                  <td className="p-3 font-mono" key={nodes[index]}>
                    {value}
                  </td>
                ))}
              </tr>
              <tr className="border-t border-slate-200">
                <th className="p-3 text-left">visitado</th>
                {nodes.map((node) => (
                  <td className="p-3" key={node}>
                    {visited.has(node) ? '✓' : '·'}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-4 rounded-lg bg-lime-100 p-4 text-base leading-7 text-emerald-950">
          {current.note}
        </p>
      </div>
    </div>
  );
}

const slides: Slide[] = [
  {
    eyebrow: 'SUMÁRIO',
    title: 'O caminho desta apresentação',
    content: (
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {[
          ['01', 'Problema e objetivo'],
          ['02', 'Fonte e preparação dos dados'],
          ['03', 'Modelagem e importação no Neo4j'],
          ['04', 'Consultas e alternativas de rota'],
          ['05', 'Dijkstra passo a passo'],
          ['06', 'Arquitetura, qualidade e execução'],
        ].map(([number, topic]) => (
          <div
            className="flex items-center gap-4 rounded-xl border border-slate-200 p-4"
            key={number}
          >
            <span className="font-mono text-xl font-bold text-emerald-700">
              {number}
            </span>
            <span className="text-sm font-semibold text-slate-700">
              {topic}
            </span>
          </div>
        ))}
      </div>
    ),
  },
  {
    eyebrow: '02 · O PROBLEMA',
    title: 'Como representar uma cidade para encontrar caminhos?',
    content: (
      <div className="grid gap-4 md:grid-cols-3">
        {[
          [
            'Entrada',
            'Origem, destino e paradas pesquisados em endereços reais.',
          ],
          [
            'Processamento',
            'A malha viária vira um grafo ponderado e direcionado.',
          ],
          [
            'Saída',
            'Até três caminhos distintos, ordenados pela distância total.',
          ],
        ].map(([title, text]) => (
          <article
            className="rounded-xl border border-slate-200 bg-white p-5"
            key={title}
          >
            <h3 className="text-lg font-semibold text-emerald-900">{title}</h3>
            <p className="mt-2 text-base leading-7 text-slate-600">{text}</p>
          </article>
        ))}
      </div>
    ),
  },
  {
    eyebrow: '03 · COMPARAÇÃO',
    title: 'Qual modelo representa melhor uma rede viária?',
    content: (
      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full min-w-[720px] border-collapse text-left text-base">
          <thead className="bg-emerald-950 text-white">
            <tr>
              <th className="p-4">Modelo</th>
              <th className="p-4">Como representaria</th>
              <th className="p-4">Ponto forte</th>
              <th className="p-4">Limitação neste projeto</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            <tr>
              <th className="p-4 text-emerald-900">Relacional</th>
              <td className="p-4 text-slate-600">
                Tabelas de ruas, pontos e uma tabela de segmentos ligando chaves
                estrangeiras.
              </td>
              <td className="p-4 text-slate-600">
                Integridade, transações e consultas tabulares muito maduras.
              </td>
              <td className="p-4 text-slate-600">
                Cada travessia exige vários JOINs recursivos; a conexão fica
                indireta.
              </td>
            </tr>
            <tr>
              <th className="p-4 text-amber-800">Documentos</th>
              <td className="p-4 text-slate-600">
                Um documento JSON por rua, contendo coordenadas e atributos.
              </td>
              <td className="p-4 text-slate-600">
                Flexibilidade de estrutura e leitura simples do documento
                inteiro.
              </td>
              <td className="p-4 text-slate-600">
                Conexões entre milhares de documentos não são o foco natural do
                modelo.
              </td>
            </tr>
            <tr className="bg-lime-50">
              <th className="p-4 text-emerald-950">Grafo · Neo4j</th>
              <td className="p-4 text-slate-600">
                Nós são pontos da via; relacionamentos são segmentos com peso e
                direção.
              </td>
              <td className="p-4 text-slate-600">
                A topologia da cidade é nativa: vizinhos, caminhos e pesos ficam
                explícitos.
              </td>
              <td className="p-4 text-slate-600">
                Exige uma modelagem específica para o domínio e conhecimento de
                Cypher.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    ),
  },
  {
    eyebrow: '04 · DECISÃO',
    title: 'Por que o Neo4j é a escolha adequada?',
    content: (
      <div className="grid gap-4 md:grid-cols-2">
        {[
          [
            'Relacionamentos são dados',
            'Em uma cidade, o mais importante não é apenas guardar uma rua: é saber quais segmentos estão conectados e por onde podemos continuar.',
          ],
          [
            'Travessia natural',
            'shortestPath percorre relações ROAD diretamente. A consulta expressa o domínio sem montar uma cadeia de JOINs ou reconstruir conexões na aplicação.',
          ],
          [
            'Atributos no caminho',
            'Cada relação carrega meters, name, highway e direção. O algoritmo usa esses pesos para comparar alternativas reais.',
          ],
          [
            'Flexível para evoluir',
            'Podemos acrescentar acidentes, pontos de interesse, restrições ou transporte público como novos nós e relações sem redesenhar várias tabelas.',
          ],
        ].map(([title, text]) => (
          <article
            className="rounded-xl border border-emerald-200 bg-emerald-50 p-5"
            key={title}
          >
            <h3 className="text-lg font-bold text-emerald-950">{title}</h3>
            <p className="mt-2 text-base leading-7 text-slate-700">{text}</p>
          </article>
        ))}
        <p className="rounded-xl bg-lime-100 p-5 text-base font-semibold leading-7 text-emerald-950 md:col-span-2">
          A escolha não significa que Neo4j seja melhor para qualquer problema.
          Para este trabalho, em que o núcleo é encontrar caminhos em uma rede
          conectada, o modelo de grafos reduz a distância entre o problema e a
          consulta.
        </p>
      </div>
    ),
  },
  {
    eyebrow: '05 · DADOS REAIS',
    title: 'Do OpenStreetMap ao recorte de Campos',
    content: (
      <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
        <div className="space-y-4 text-sm leading-6 text-slate-600">
          <p>
            O dataset não é mockado. O pipeline baixa o extrato PBF integral do
            estado do Rio de Janeiro em <b>download.openstreetmap.fr</b>,
            distribuído sob a licença ODbL.
          </p>
          <ol className="space-y-3">
            <li>
              <b>1.</b> Download do PBF do RJ com tentativas automáticas.
            </li>
            <li>
              <b>2.</b> Validação MD5 antes de qualquer transformação.
            </li>
            <li>
              <b>3.</b> Recorte geográfico de Campos com{' '}
              <code>osmium extract</code>.
            </li>
            <li>
              <b>4.</b> Filtro de objetos <code>way</code> com tag{' '}
              <code>highway</code>.
            </li>
            <li>
              <b>5.</b> Exportação GeoJSON e importação em lotes no Neo4j.
            </li>
          </ol>
        </div>
        <pre className={codeClass}>
          <code>{`osmium extract -b \
  -41.45,-21.90,-41.18,-21.62 RJ.pbf
osmium tags-filter campos.osm.pbf w/highway
osmium export campos-roads.osm.pbf \
  -o campos-roads.geojson`}</code>
        </pre>
      </div>
    ),
  },
  {
    eyebrow: '06 · MODELAGEM NEO4J',
    title: 'A malha viária como property graph',
    content: (
      <div className="grid gap-6 lg:grid-cols-2">
        <div>
          <div className="flex items-center justify-center gap-3 rounded-xl bg-emerald-950 p-6 text-center text-xs text-white sm:gap-5 sm:text-sm">
            <span className="rounded-full bg-lime-300 px-4 py-5 text-emerald-950">
              RoadNode A
            </span>
            <span className="min-w-20 border-t-2 border-lime-300 pt-2 font-mono">
              ROAD →
            </span>
            <span className="rounded-full bg-lime-300 px-4 py-5 text-emerald-950">
              RoadNode B
            </span>
          </div>
          <pre className={codeClass}>
            <code>{`(:RoadNode {
  id, lat, lon
})
[:ROAD {
  osm_id, segment, meters,
  name, highway
}]`}</code>
          </pre>
        </div>
        <div className="space-y-3 text-sm leading-6 text-slate-600">
          <p>
            <b>Nó:</b> cada coordenada de interseção ou vértice de uma via.
          </p>
          <p>
            <b>Relacionamento:</b> cada segmento trafegável entre dois pontos
            consecutivos.
          </p>
          <p>
            <b>Peso:</b> distância geodésica aproximada em metros, calculada
            durante a importação.
          </p>
          <p>
            <b>Direção:</b> vias de mão única criam apenas uma aresta; as demais
            recebem a relação inversa.
          </p>
          <p>
            <b>Integridade:</b> uma constraint única em <code>RoadNode.id</code>{' '}
            evita nós duplicados.
          </p>
        </div>
      </div>
    ),
  },
  {
    eyebrow: '07 · EXEMPLO OSM',
    title: 'Uma rua de Campos: do OSM ao grafo',
    content: (
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-4">
          <div className="rounded-xl border border-slate-200 bg-lime-50 p-5">
            <p className="font-mono text-sm text-emerald-700">
              OSM way · exemplo ilustrativo
            </p>
            <h3 className="mt-2 text-2xl font-bold text-emerald-950">
              Rua Voluntários da Pátria
            </h3>
            <dl className="mt-4 grid grid-cols-2 gap-3 text-sm text-slate-700">
              <div>
                <dt className="font-semibold">highway</dt>
                <dd>residential</dd>
              </div>
              <div>
                <dt className="font-semibold">name</dt>
                <dd>Rua Voluntários da Pátria</dd>
              </div>
              <div>
                <dt className="font-semibold">oneway</dt>
                <dd>no</dd>
              </div>
              <div>
                <dt className="font-semibold">osm_id</dt>
                <dd>way/123456</dd>
              </div>
            </dl>
          </div>
          <p className="text-base leading-7 text-slate-600">
            O OSM fornece uma geometria com vários vértices. O importador quebra
            cada par consecutivo em um segmento e calcula <code>meters</code>.
          </p>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-center gap-2 rounded-xl bg-emerald-950 p-5 text-center text-sm text-white sm:gap-4">
            <span className="rounded-full border-2 border-lime-300 bg-emerald-700 px-3 py-4">
              Nó A<br />
              <small>lat/lon</small>
            </span>
            <span className="font-mono text-lime-300">
              ROAD
              <br />
              meters · name
            </span>
            <span className="rounded-full border-2 border-lime-300 bg-emerald-700 px-3 py-4">
              Nó B<br />
              <small>lat/lon</small>
            </span>
          </div>
          <pre className={codeClass}>
            <code>{`MATCH (a:RoadNode)-[r:ROAD]->(b:RoadNode)
WHERE r.name = 'Rua Voluntários da Pátria'
RETURN a.lat, a.lon, r.meters, r.highway,
       r.name, b.lat, b.lon`}</code>
          </pre>
          <p className="rounded-lg bg-slate-100 p-4 text-base leading-7 text-slate-700">
            O resultado preserva a origem e o destino do segmento, o peso usado
            pelo algoritmo e os atributos da rua para exibir os passos da rota.
          </p>
        </div>
      </div>
    ),
  },
  {
    eyebrow: '08 · IMPORTAÇÃO',
    title: 'Cypher idempotente e processamento em lotes',
    content: (
      <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <pre className={codeClass}>
          <code>{`UNWIND $rows AS row // percorre cada segmento do lote
MERGE (a:RoadNode {id: row.ak}) // cria ou reutiliza o nó inicial
  SET a.lat = row.alat, a.lon = row.alon // salva as coordenadas do início
MERGE (b:RoadNode {id: row.bk}) // cria ou reutiliza o nó final
MERGE (a)-[r:ROAD { // cria ou reutiliza a conexão entre os nós
  osm_id: row.osm, // guarda o identificador original do OSM
  segment: row.segment // identifica este segmento da via
}]->(b) // mantém o sentido de a para b
SET r.meters = row.meters, // define o peso da relação em metros
    r.name = row.name, // guarda o nome da rua
    r.highway = row.highway // guarda o tipo da via`}</code>
        </pre>
        <div className="space-y-4 text-sm leading-6 text-slate-600">
          <p>
            O Python lê o GeoJSON e fragmenta cada LineString em pares de
            coordenadas.
          </p>
          <p>
            Os segmentos são enviados em lotes de <b>1.000</b>, reduzindo
            transações e uso de memória.
          </p>
          <p>
            <code>MERGE</code> torna a criação determinística, enquanto a
            constraint acelera e protege a identidade dos nós.
          </p>
        </div>
      </div>
    ),
  },
  {
    eyebrow: '09 · CONSULTA DE ROTAS',
    title: 'Como a menor rota é calculada no grafo',
    content: (
      <div>
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            [
              'Snap',
              'Localiza o RoadNode mais próximo das coordenadas de entrada.',
            ],
            [
              'Busca',
              'Executa shortestPath com profundidade máxima de 120 relações.',
            ],
            [
              'Peso',
              'Soma ROAD.meters para distância e ordenação do resultado.',
            ],
          ].map(([title, text]) => (
            <div className="rounded-lg bg-emerald-50 p-4" key={title}>
              <b className="text-emerald-950">{title}</b>
              <p className="mt-2 text-xs leading-5 text-slate-600">{text}</p>
            </div>
          ))}
        </div>
        <pre className={codeClass}>
          <code>
            <span className="text-lime-200">
              MATCH path = shortestPath((a)-[:ROAD*..120]-&gt;(b))
            </span>
            <span className="text-sky-300"> // encontra o menor caminho</span>
            {'\n'}
            <span className="text-lime-200">
              WHERE all(r IN relationships(path)
            </span>
            <span className="text-sky-300"> // verifica todas as relações</span>
            {'\n'}
            <span className="text-lime-200">
              {' '}
              WHERE NOT elementId(r) IN $blockedRelationshipIds)
            </span>
            <span className="text-sky-300">
              {' '}
              // ignora segmentos bloqueados
            </span>
            {'\n'}
            <span className="text-lime-200">
              WITH path, reduce(total = 0.0, r IN relationships(path) |
            </span>
            <span className="text-sky-300"> // prepara a soma dos pesos</span>
            {'\n'}
            <span className="text-lime-200"> total + r.meters) AS meters</span>
            <span className="text-sky-300"> // calcula a distância total</span>
            {'\n'}
            <span className="text-lime-200">
              RETURN nodes(path), relationships(path), meters
            </span>
            <span className="text-sky-300">
              {' '}
              // devolve nós, conexões e distância
            </span>
          </code>
        </pre>
      </div>
    ),
  },
  {
    eyebrow: '10 · TRÊS ALTERNATIVAS',
    title: 'Rotas distintas, paradas e deduplicação',
    content: (
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-3 text-sm leading-6 text-slate-600">
          <p>
            A primeira execução encontra o caminho-base para cada trecho: origem
            → paradas → destino.
          </p>
          <p>
            Para produzir alternativas, o serviço bloqueia uma relação da
            rota-base por vez e consulta novamente.
          </p>
          <p>
            As pernas são reunidas, ordenadas por metros e limitadas a três. Uma
            assinatura da geometria em um <code>LinkedHashMap</code> impede
            rotas iguais.
          </p>
          <p>
            Se o grafo não tiver três caminhos realmente diferentes, a API
            retorna menos de três — nunca duplica.
          </p>
        </div>
        <div className="rounded-xl bg-slate-950 p-5 font-mono text-xs leading-7 text-slate-200">
          <p className="text-blue-400">rota 1 · caminho-base</p>
          <p className="text-amber-400">rota 2 · bloqueia relação X</p>
          <p className="text-red-400">rota 3 · bloqueia relação Y</p>
          <p className="mt-4 text-lime-300">signature(geometry) → unique</p>
        </div>
      </div>
    ),
  },
  ...dijkstraSteps.map((step, index) => ({
    eyebrow: `DIJKSTRA · ITERAÇÃO ${index + 1} DE ${dijkstraSteps.length}`,
    title:
      index === 0
        ? 'Dijkstra passo a passo: inicialização'
        : `Fixar ${step.selected} e relaxar seus vizinhos`,
    content: <DijkstraExample step={index} />,
  })),
  {
    eyebrow: '17 · ARQUITETURA',
    title: 'Responsabilidades separadas ponta a ponta',
    content: (
      <div className="grid gap-4 md:grid-cols-3">
        <article className="rounded-xl border border-slate-200 p-5">
          <h3 className="font-semibold text-emerald-950">React + TypeScript</h3>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            pages compõem; components exibem; hooks controlam efeitos; context
            guarda pontos; services acessam HTTP; types contêm schemas.
          </p>
        </article>
        <article className="rounded-xl border border-slate-200 p-5">
          <h3 className="font-semibold text-emerald-950">
            Spring Boot + Java 21
          </h3>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            controller, DTO, service, repository, entity, mapper, analytics e
            tratamento centralizado de exceções.
          </p>
        </article>
        <article className="rounded-xl border border-slate-200 p-5">
          <h3 className="font-semibold text-emerald-950">Neo4j</h3>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Persistência orientada a grafos, conexões explícitas e travessia
            natural da rede viária real.
          </p>
        </article>
      </div>
    ),
  },
  {
    eyebrow: '18 · QUALIDADE DO FRONTEND',
    title: 'Contratos, estilo e comportamento verificáveis',
    content: (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          [
            'Zod',
            'Valida requests e responses em runtime. Os tipos TypeScript são inferidos dos schemas.',
          ],
          [
            'ESLint 10',
            'TypeScript recomendado, hooks, 2 espaços, aspas simples, sem variáveis ociosas e limite de 140 colunas.',
          ],
          [
            'Tailwind CSS',
            'Design mobile-first; breakpoints progressivos e alvos de toque de pelo menos 44 px.',
          ],
          [
            'Playwright',
            'Rotas distintas, zoom 13–19, gesto de pinça e layout em sm, md, lg, xl e 2xl.',
          ],
        ].map(([title, text]) => (
          <article className="rounded-xl bg-slate-100 p-5" key={title}>
            <h3 className="font-semibold text-emerald-950">{title}</h3>
            <p className="mt-2 text-xs leading-5 text-slate-600">{text}</p>
          </article>
        ))}
      </div>
    ),
  },
  {
    eyebrow: '19 · EXECUÇÃO E RESULTADO',
    title: 'Uma demonstração reproduzível',
    content: (
      <div className="grid gap-6 lg:grid-cols-2">
        <div>
          <pre className={codeClass}>
            <code>{`nix develop
docker compose up -d
./scripts/download-osm.sh
./scripts/import-osm.sh
cd backend && mvn spring-boot:run
cd frontend && npm run dev`}</code>
          </pre>
        </div>
        <div className="space-y-4 text-sm leading-6 text-slate-600">
          <p>
            O <code>flake.nix</code> fixa Java 21, Maven, Node, osmium, Docker e
            Chromium.
          </p>
          <p>
            A aplicação roda nas portas altas 43783/43784 e pode ser exposta com{' '}
            <code>ngrok http 43783</code>.
          </p>
          <p className="rounded-lg bg-lime-100 p-4 font-semibold text-emerald-950">
            Resultado: um banco de grafos construído a partir de vias reais e
            consultado de forma visual, transparente e testada.
          </p>
        </div>
      </div>
    ),
  },
];

export default function PresentationPage() {
  const [index, setIndex] = useState(0);
  const slide = slides[index];

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight')
        setIndex((current) => Math.min(current + 1, slides.length - 1));
      if (event.key === 'ArrowLeft')
        setIndex((current) => Math.max(current - 1, 0));
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  return (
    <main className="min-h-screen bg-slate-100 text-slate-800">
      <div className="bg-emerald-950">
        <SiteHeader compact />
      </div>
      <section className="mx-auto flex min-h-[calc(100dvh-3.5rem)] max-w-7xl flex-col px-4 py-5 sm:px-7 sm:py-7 lg:px-10">
        <div className="mb-4 flex items-center justify-between font-mono text-[10px] text-slate-500 sm:text-xs">
          <span>APRESENTAÇÃO · BD NOSQL</span>
          <span>
            {String(index + 1).padStart(2, '0')} /{' '}
            {String(slides.length).padStart(2, '0')}
          </span>
        </div>
        <article className="flex flex-1 flex-col justify-center rounded-2xl bg-white p-5 shadow-sm sm:p-8 lg:p-12">
          <p className="font-mono text-xs tracking-[0.18em] text-emerald-700 sm:text-sm">
            {slide.eyebrow}
          </p>
          <h1 className="mb-7 mt-3 max-w-5xl text-3xl font-bold leading-tight text-slate-900 sm:text-4xl md:text-5xl lg:mb-9 lg:text-6xl">
            {slide.title}
          </h1>
          {slide.content}
        </article>
        <div className="mt-4 grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 sm:gap-3">
          <button
            type="button"
            className="min-h-11 rounded-lg border border-slate-300 px-3 text-xs font-semibold disabled:opacity-30 sm:px-5"
            onClick={() => setIndex((current) => current - 1)}
            disabled={index === 0}
          >
            ← Anterior
          </button>
          <div
            className="hidden justify-center gap-1.5 sm:flex"
            aria-label="Progresso dos slides"
          >
            {slides.map((item, slideIndex) => (
              <button
                key={item.eyebrow}
                type="button"
                aria-label={`Ir para slide ${slideIndex + 1}`}
                onClick={() => setIndex(slideIndex)}
                className={`h-2 rounded-full transition-all ${slideIndex === index ? 'w-6 bg-emerald-700' : 'w-2 bg-slate-300'}`}
              />
            ))}
          </div>
          <button
            type="button"
            className="min-h-11 rounded-lg bg-emerald-950 px-3 text-xs font-semibold text-white disabled:opacity-30 sm:px-5"
            onClick={() => setIndex((current) => current + 1)}
            disabled={index === slides.length - 1}
          >
            Próximo →
          </button>
        </div>
        <footer className="mt-2 text-center font-mono text-[10px] text-slate-500 sm:text-xs">
          Slide {index + 1} de {slides.length} ·{' '}
          {index === slides.length - 1
            ? 'apresentação concluída'
            : `faltam ${slides.length - index - 1}`}
        </footer>
      </section>
    </main>
  );
}
