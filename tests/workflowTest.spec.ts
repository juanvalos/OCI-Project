import { test, expect } from '@playwright/test';

// Tags: @workflow @e2e @multiuser @dashboard

test.describe('Complete Sprint and Task Management Workflow', () => {
  
  test('should allow creating, updating and deleting a Sprint and Task between multiple users', async ({ page }) => {
    // User 1 logs in
    await page.goto('http://159.54.148.57/');
    await page.getByRole('textbox', { name: 'username' }).fill('roxanaAranda');
    await page.getByRole('textbox', { name: 'password' }).fill('password123');
    await page.getByRole('button', { name: 'Login' }).click();

    // User 1 creates Sprint
    await page.getByRole('button', { name: '+ Create Sprint' }).click();
    await page.getByRole('textbox', { name: 'Nombre' }).fill('Test Sprint');
    await page.getByRole('textbox', { name: 'Descripción' }).fill('testing');
    await page.getByPlaceholder('mm / dd / aaaa').fill('2025-06-13');
    await page.getByRole('button', { name: 'Crear Sprint' }).click();

    // Enter Sprint
    await page.getByText('Test Sprinttesting').click();

    // Create a task in Sprint
    await page.getByRole('button', { name: '+ Add Task' }).click();
    await page.getByRole('combobox').first().selectOption('6');
    await page.getByRole('textbox', { name: 'Nombre de la tarea' }).fill('end to end');
    await page.getByRole('textbox', { name: 'Descripción' }).fill('testing');
    await page.locator('select[name="state"]').selectOption('En progreso');
    await page.getByPlaceholder('Horas esperadas').fill('2');
    await page.getByPlaceholder('Horas reales').fill('3');
    await page.getByPlaceholder('mm / dd / aaaa').fill('2025-06-13');
    await page.getByRole('button', { name: 'Crear Task' }).click();

    // Exit to dashboard and log out
    await page.getByRole('button', { name: 'Go Back' }).click();
    await page.getByRole('button', { name: 'Log out' }).click();

    // User 2 logs in and updates task
    await page.getByRole('textbox', { name: 'username' }).fill('dhaliTejeda');
    await page.getByRole('textbox', { name: 'password' }).fill('password123');
    await page.getByRole('button', { name: 'Login' }).click();
    await page.getByText('Test Sprinttesting').click();
    await page.getByText('end to endStatus: En progreso').click();
    await page.getByRole('combobox').selectOption('Terminada');
    await page.getByRole('spinbutton').fill('4');
    await page.getByRole('button', { name: 'Actualizar Task' }).click();
    await page.getByRole('button', { name: 'Go Back' }).click();
    await page.getByRole('button', { name: 'Log out' }).click();

    // User 1 logs in and deletes task and sprint
    await page.getByRole('textbox', { name: 'username' }).fill('roxanaAranda');
    await page.getByRole('textbox', { name: 'password' }).fill('password123');
    await page.getByRole('button', { name: 'Login' }).click();
    await page.getByText('Test Sprinttesting').click();
    await page.getByRole('heading', { name: 'end to end' }).click();
    await page.getByRole('button', { name: 'Eliminar Tarea' }).click();
    await expect(page.getByRole('heading', { name: 'end to end' })).toHaveCount(0, { timeout: 10000 });
    await page.getByRole('button', { name: 'Delete Sprint' }).click();

    // Test dashboard features
    await page.getByRole('button', { name: 'Sprint Effectiveness' }).click();
    await page.getByRole('combobox').selectOption('1');
    await page.getByRole('combobox').selectOption('3');
    await expect(page.getByText('Efectividad del Sprint')).toBeVisible();
    await expect(page.getByText('Roxana Aranda')).toBeVisible();
    await page.getByRole('button', { name: 'Go Back' }).click();

    await page.getByRole('button', { name: 'Sprint Productivity' }).click();
    await page.getByRole('combobox').selectOption('1');
    await expect(page.getByText('Productividad del Sprint')).toBeVisible();
    await expect(page.getByText('Roxana Aranda')).toBeVisible();
    await page.getByRole('button', { name: 'Go Back' }).click();

    await page.getByRole('button', { name: 'Hours per Sprint' }).click();
    await expect(page.getByText(/Sprint\s*[1-5]/).first()).toBeVisible();
    const chart = page.locator('svg.recharts-surface').first();
    await expect(chart).toBeVisible();
    await page.getByRole('button', { name: 'Go Back' }).click();


    await page.getByRole('button', { name: 'Dev Hours' }).click();
    await expect(page.getByText(/Sprint\s*[1-5]/).first()).toBeVisible();
    await page.getByRole('button', { name: 'Go Back' }).click();

    await page.getByRole('button', { name: 'Completed Tasks' }).click();
    await expect(page.getByText(/Sprint\s*[1-5]/).first()).toBeVisible();
    await page.getByRole('button', { name: 'Go Back' }).click();

  });
});