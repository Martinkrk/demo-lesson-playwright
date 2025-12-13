import { test } from '../fixtures/delivery.fixture'


test('5.0 Create order and test popup visibility', async ({ orderPage, defaultOrder }) => {
  await orderPage.nameField.fill(defaultOrder.customerName);
  await orderPage.phoneField.fill(defaultOrder.customerPhone);
  await orderPage.commentField.fill(defaultOrder.comment);

  const orderResponse = orderPage.page.waitForResponse('**/orders');
  await orderPage.orderButton.click();
  await orderResponse;

  await orderPage.verifyPopupVisible();
})

test('5.1 Find open order and test orderFoundPage', async ({ orderPage, orderFoundPage, newOrder }) => {
  await orderPage.statusButton.click();
  await orderPage.searchOrderInput.fill(String(newOrder.id));

  const orderResponse = orderPage.page.waitForResponse('**/orders/*');
  await orderPage.searchOrderButton.click();
  await orderResponse;

  await orderFoundPage.verifyPage()
  await orderFoundPage.verifyStatus('OPEN');
})

test.describe('DELIVERED orders', () => {
  test.use({defaultOrderStatus: 'DELIVERED'});

  test('5.2 Find delivered order and test orderFoundPage', async ({ orderPage, orderFoundPage, newOrder }) => {
    await orderPage.statusButton.click();
    await orderPage.searchOrderInput.fill(String(newOrder.id));

    const orderResponse = orderPage.page.waitForResponse('**/orders/*');
    await orderPage.searchOrderButton.click();
    await orderResponse;

    await orderFoundPage.verifyPage()
    await orderFoundPage.verifyStatus('DELIVERED');
  })
})
