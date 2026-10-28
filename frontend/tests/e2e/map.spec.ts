import { expect, test } from '@playwright/test';
import type { RouteResponse } from '../../src/types/route';

test('API retorna somente geometrias de rota distintas', async ({
  request,
}) => {
  const response = await request.post(
    'http://localhost:43784/api/routes/alternatives',
    {
      data: {
        origin: { lat: -21.7523, lon: -41.3304 },
        destination: { lat: -21.7635, lon: -41.3181 },
        stops: [{ lat: -21.7568, lon: -41.3288 }],
      },
    },
  );
  expect(response.ok()).toBe(true);
  const payload = (await response.json()) as RouteResponse;
  expect(payload.routes).toHaveLength(3);
  const signatures = new Set(
    payload.routes.map((route) => JSON.stringify(route.geometry)),
  );
  expect(signatures.size).toBe(payload.routes.length);
});

test('mantém os tiles visíveis após seis níveis de zoom', async ({ page }) => {
  const failedTiles: string[] = [];
  page.on('response', (response) => {
    if (
      response.url().includes('tile.openstreetmap') &&
      response.status() >= 400
    ) {
      failedTiles.push(`${response.status()} ${response.url()}`);
    }
  });
  page.on('requestfailed', (request) => {
    if (request.url().includes('tile.openstreetmap')) {
      failedTiles.push(`failed ${request.url()}`);
    }
  });

  await page.goto('/#/map');
  await expect(page.getByText('Rotas de Campos')).toBeVisible();
  const map = page.locator('.leaflet-container');
  await expect(map).toBeVisible();
  await expect(page.locator('.leaflet-tile-loaded').first()).toBeVisible({
    timeout: 15_000,
  });

  const zoomIn = page.locator('.leaflet-control-zoom-in');
  for (let click = 1; click <= 6; click += 1) {
    const expectedZoom = 13 + click;
    await test.step(`zoom ${expectedZoom}`, async () => {
      await zoomIn.click();
      await expect
        .poll(
          () =>
            page
              .locator(`.leaflet-tile-loaded[src*="/${expectedZoom}/"]`)
              .count(),
          { timeout: 15_000 },
        )
        .toBeGreaterThanOrEqual(8);
      const invalidTiles = await page
        .locator(`.leaflet-tile-loaded[src*="/${expectedZoom}/"]`)
        .evaluateAll(
          (tiles) =>
            tiles.filter((tile) => {
              const image = tile as HTMLImageElement;
              const rect = image.getBoundingClientRect();
              return (
                image.naturalWidth === 0 ||
                rect.width === 0 ||
                rect.height === 0
              );
            }).length,
        );
      expect(invalidTiles, `tile inválido após o zoom ${click}`).toBe(0);
      await page.waitForTimeout(350);
    });
  }

  await expect(
    page.getByText('Tiles indisponíveis. Verifique sua conexão.'),
  ).toHaveCount(0);
  expect(
    failedTiles.length,
    `falhas de tile toleradas pelo fallback:\n${failedTiles.join('\n')}`,
  ).toBeLessThanOrEqual(2);
  await page.screenshot({
    path: 'test-results/map-zoom-19.png',
    fullPage: true,
  });
});

test('layout mobile permite navegação e zoom por gesto de pinça', async ({
  browser,
}) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  });
  const page = await context.newPage();
  await page.goto('/#/map');

  const map = page.locator('.leaflet-container');
  await expect(map).toBeVisible();
  await expect(page.locator('.leaflet-tile-loaded').first()).toBeVisible({
    timeout: 15_000,
  });
  await expect(page.getByText('Rotas de Campos')).toBeVisible();
  await expect(
    page.getByRole('button', { name: 'Calcular 3 rotas' }),
  ).toBeVisible();

  const bounds = await map.boundingBox();
  expect(bounds).not.toBeNull();
  const centerX = bounds!.x + bounds!.width / 2;
  const centerY = bounds!.y + bounds!.height / 2;
  const session = await context.newCDPSession(page);

  await session.send('Input.dispatchTouchEvent', {
    type: 'touchStart',
    touchPoints: [
      { x: centerX - 35, y: centerY, id: 0 },
      { x: centerX + 35, y: centerY, id: 1 },
    ],
  });
  for (let distance = 45; distance <= 120; distance += 15) {
    await session.send('Input.dispatchTouchEvent', {
      type: 'touchMove',
      touchPoints: [
        { x: centerX - distance, y: centerY, id: 0 },
        { x: centerX + distance, y: centerY, id: 1 },
      ],
    });
    await page.waitForTimeout(40);
  }
  await session.send('Input.dispatchTouchEvent', {
    type: 'touchEnd',
    touchPoints: [],
  });

  await expect
    .poll(
      () =>
        page.locator('.leaflet-tile-loaded').evaluateAll((tiles) =>
          Math.max(
            ...tiles.map((tile) => {
              const match = (tile as HTMLImageElement).src.match(
                /\/(\d+)\/\d+\/\d+/,
              );
              return match ? Number(match[1]) : 0;
            }),
          ),
        ),
      { timeout: 15_000 },
    )
    .toBeGreaterThan(13);
  await page.screenshot({
    path: 'test-results/mobile-pinch-zoom.png',
    fullPage: true,
  });
  await context.close();
});

test('início e apresentação respondem em todos os breakpoints Tailwind', async ({
  page,
}) => {
  const breakpoints = [
    { name: 'base', width: 390 },
    { name: 'sm', width: 640 },
    { name: 'md', width: 768 },
    { name: 'lg', width: 1024 },
    { name: 'xl', width: 1280 },
    { name: '2xl', width: 1536 },
  ];

  for (const breakpoint of breakpoints) {
    await test.step(breakpoint.name, async () => {
      await page.setViewportSize({ width: breakpoint.width, height: 900 });
      await page.goto('/#/');
      await expect(
        page.getByRole('heading', { name: /As ruas de Campos/ }),
      ).toBeVisible();
      await expect(
        page.getByRole('link', { name: 'Apresentação', exact: true }).last(),
      ).toBeVisible();
      await expect(
        page.getByRole('link', { name: 'Ver mapa', exact: true }).last(),
      ).toBeVisible();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth,
        ),
      ).toBe(true);

      await page.goto('/#/presentation');
      await expect(page.getByText('01 / 19')).toBeVisible();
      await expect(page.getByText('Slide 1 de 19 · faltam 18')).toBeVisible();
      for (let slide = 1; slide <= 19; slide += 1) {
        expect(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= window.innerWidth,
          ),
        ).toBe(true);
        if (slide < 19) {
          await page.getByRole('button', { name: 'Próximo →' }).click();
        }
      }
      await expect(page.getByText('19 / 19')).toBeVisible();
      await expect(
        page.getByText('Slide 19 de 19 · apresentação concluída'),
      ).toBeVisible();
    });
  }
});

test('desenha as conexões B-D e B-E no exemplo de Dijkstra', async ({
  page,
}) => {
  await page.goto('/#/presentation');
  for (let slide = 1; slide < 11; slide += 1) {
    await page.getByRole('button', { name: 'Próximo →' }).click();
  }
  await expect(page.getByText('11 / 19')).toBeVisible();
  for (const edge of ['B-D', 'B-E', 'D-F', 'E-F']) {
    const connection = page.locator(`[data-edge="${edge}"]`);
    await expect(connection).toBeVisible();
    const box = await connection.boundingBox();
    expect(box?.width).toBeGreaterThan(0);
    expect(box?.height).toBeGreaterThan(0);
  }
});

test('gera screenshots reais do mapa e das rotas', async ({ page }) => {
  await page.goto('/#/map');
  await expect(page.locator('.leaflet-tile-loaded').first()).toBeVisible({
    timeout: 15_000,
  });
  await page.screenshot({
    path: '../docs/mapa-sem-rota.png',
    fullPage: true,
  });

  await page.getByRole('button', { name: 'Calcular 3 rotas' }).click();
  await expect(page.getByText(/rotas encontradas/)).toBeVisible({
    timeout: 15_000,
  });
  await page.screenshot({
    path: '../docs/mapa-com-rotas.png',
    fullPage: true,
  });
});
