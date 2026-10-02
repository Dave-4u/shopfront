// Browser smoke test: browse → add to bag → checkout → success.
require("./harness").run("shopfront smoke", async (page, base, ok) => {
  await page.goto(base + "/");
  ok((await page.locator(".product-card").count()) === 12, "all 12 products render");
  await page.fill("#search-input", "mug");
  ok((await page.locator(".product-card").count()) === 1, "search narrows the catalog");
  await page.fill("#search-input", "zzzz");
  ok(await page.isVisible("#empty-catalog"), "empty state shows for no matches");
  await page.click("#clear-filters");
  ok((await page.locator(".product-card").count()) === 12, "clear filters resets");
  await page.click('[data-add="mug-09"]');
  await page.click('[data-add="watch-06"]');
  ok((await page.textContent("#cart-count")) === "2", "bag badge counts items");
  await page.click("#cart-toggle");
  ok((await page.textContent(".ship-text")).includes("free delivery") || (await page.textContent(".ship-text")).includes("on us"), "free-delivery nudge shows");
  await page.click("#go-checkout");
  ok(await page.isVisible("#checkout-view"), "checkout view opens");
  await page.click('#checkout-form button[type="submit"]');
  ok((await page.locator(".field-error:not(:empty)").count()) > 3, "empty form shows friendly errors");
  const f = { "#full-name": "Ada Obi", "#email": "ada@example.com", "#phone": "08012345678", "#address": "12 Admiralty Way", "#city": "Lekki", "#state": "Lagos", "#zip": "106104", "#card-name": "Ada Obi", "#card-number": "4242424242424242", "#card-expiry": "1229", "#card-cvc": "123" };
  for (const [sel, v] of Object.entries(f)) await page.fill(sel, v);
  await page.dispatchEvent("#card-number", "input");
  ok((await page.inputValue("#card-number")) === "4242 4242 4242 4242", "card number auto-formats");
  await page.dispatchEvent("#card-expiry", "input");
  await page.click('#checkout-form button[type="submit"]');
  ok(await page.isVisible("#success-view"), "order completes");
  ok((await page.textContent("#order-id")).startsWith("Order reference: SF-"), "order reference shown");
});
