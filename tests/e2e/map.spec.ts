import { expect, test } from '@playwright/test';

test('exibe mapa de Campos e formulário de rotas', async ({ page }) => {
  await page.goto('/#/map');
  await expect(page.getByText('Rotas de Campos')).toBeVisible();
  await expect(page.getByText('Calcular 3 rotas')).toBeVisible();
  await expect(page.getByText('Pronto para explorar')).toBeVisible();
});
