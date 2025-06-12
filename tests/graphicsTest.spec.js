// @ts-check
import { test, expect } from "@playwright/test";

async function doLogin(page) {
  await page.route("**/login", async (route) => {
    const mockUser = {
      id: 42,
      username: "roxanaAranda",
      permits: 1,
    };
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(mockUser),
    });
  });

  await page.goto("http://localhost:5173/");
  await page.getByRole("textbox", { name: "Username" }).fill("roxanaAranda");
  await page.getByRole("textbox", { name: "Password" }).fill("password123");
  await page.getByRole("button", { name: "Log In" }).click();
}

async function sprintsData(page) {
  await page.route("**/sprints", async (route) => {
    const mockSprints = [
      {
        id: 123,
        name: "Sprint 1",
        description: "Description 1",
        dueDate: "2025-10-06",
      },
      {
        id: 2,
        name: "Sprint 2",
        description: "Description 2",
        dueDate: "2025-11-06",
      },
    ];
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(mockSprints),
    });
  });
}


test.describe('@sprint-visuals Sprint Performance Visual Tests', () => {
  test.beforeEach(async ({ page }) => {
    await doLogin(page);
    await sprintsData(page);
  });

  test("User checks sprint Effectiveness graphics", async ({ page }) => {

    await page.route("**/sprint/123/effectiveness", async (route) => {
    const mockEffectiveness = {
      "User A": 85.5,
      "User B": 90.0,
      "User C": 78.2,
    };
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(mockEffectiveness),
    });
  });
    
    await expect(
      page.getByRole("heading", { name: "Oracle Manager Dashboard" })
    ).toBeVisible();

    // Navigate to the Sprints effectivenes graphic section
    const button = page.getByRole("button", { name: "Efectividad por sprint" });
    await button.click();
    await expect(
      page.getByRole("heading", { name: "Sprint Effectiveness" })
    ).toBeVisible();

    
    const dropdown = page.getByRole("combobox");
    await expect(dropdown).toBeVisible();
    await dropdown.selectOption("Sprint 1");
    

    await expect(await page.getByText("User A")).toBeVisible();
    await expect(await page.getByText("85.50%")).toBeVisible();
    await expect(await page.getByText("User B")).toBeVisible();
    await expect(await page.getByText("90.00%")).toBeVisible();

    await expect(await page).toHaveScreenshot('sprint-effectiveness.png');
    


  });

  test("User checks sprint Productivity graphics", async ({ page }) => {

    await page.route("**/sprint/2/productivity", async (route) => {
      const mockProductivity = {
        "User A": 75.5,
        "User B": 80.0,
        "User C": 65.2,
      };
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(mockProductivity),
      });
    });

    await expect(
      page.getByRole("heading", { name: "Oracle Manager Dashboard" })
    ).toBeVisible();

    // Navigate to the Sprints productivity graphic section
    const button = page.getByRole("button", { name: "Productividad por sprint" });
    await button.click();
    await expect(
      page.getByRole("heading", { name: "Sprint Productivity" })
    ).toBeVisible();

    // Check if the dropdown for selecting a sprint is visible
    const dropdown = page.getByRole("combobox");
    await expect(dropdown).toBeVisible();
    await dropdown.selectOption("Sprint 2");

    await expect(await page.getByText("User A")).toBeVisible();
    await expect(await page.getByText("75.50%")).toBeVisible();
    await expect(await page.getByText("User C")).toBeVisible();
    await expect(await page.getByText("65.20%")).toBeVisible();
  });

  test("renders bar chart with total sprint hours", async ({ page }) => {
    await page.route("**/sprints/totalHours", async (route) => {
      const mockTotalHours = {
        "Sprint 1": 120,
        "Sprint 2": 150,
        "Sprint 3": 95,
      };

      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(mockTotalHours),
      });
    });
    await expect(
      page.getByRole("heading", { name: "Oracle Manager Dashboard" })
    ).toBeVisible();

    const button = page.getByRole("button", { name: "Hrs trabajadas por sprint" });
    await button.click();
    
    await expect(page.getByRole("heading", {
      name: "Horas totales trabajadas por Sprint"
    })).toBeVisible();

    
    await expect(await page.getByText("Sprint 1")).toBeVisible();
    await expect(await page.getByText("Sprint 2")).toBeVisible();
    await expect(page.getByText("Sprint 3")).toBeVisible();

    
    await expect(page).toHaveScreenshot("total-hours-chart.png");
  });



});
