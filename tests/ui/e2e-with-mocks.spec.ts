import { test } from '@playwright/test'
import { LoginPage } from '../pages/login-page'
import { OrderFoundPage } from '../pages/order-found-page'
import { OrderPage } from '../pages/order-page'
import { OrderNotFoundPage } from '../pages/order-not-found-page'

const jwt = 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJnZXJzdG1hbiIsImV4cCI6MTc2NTQ3OTgxNSwiaWF0IjoxNzY1NDYxODE1fQ.LSVyInkMUAOvT8cxEVuZzC71kNwPLt9FpPcKPxXRMPAkzf-YImNcZz6DMXXsIp4bJhvTMStubfIMvw7-G1TaNg'

test('4.0 (mock) Create order', async ({ context }) => {
  const order = {
    status: 'OPEN',
    courierId: null,
    customerName: 'customerName',
    customerPhone: '777777',
    comment: 'comment',
    id: 100,
  }

  await context.addInitScript((token) => {
    localStorage.setItem('jwt', token)
  }, jwt)
  const page = await context.newPage()
  const loginPage = new LoginPage(page)
  const orderPage = new OrderPage(page)
  await loginPage.open()

  await page.route('**/orders', async (route) => {
    await route.fulfill({
      status: 200,
      json: order,
    })
  })

  await orderPage.nameField.fill(order.customerName)
  await orderPage.phoneField.fill(order.customerPhone)
  await orderPage.commentField.fill(order.comment)
  const createOrderResponse = page.waitForResponse('**/orders')
  await orderPage.orderButton.click()
  await createOrderResponse

  await orderPage.verifyOrderId(String(order.id))
})

test('4.1 (mock) Find order [OPEN]', async ({ context }) => {
  const order = {
    status: 'OPEN',
    courierId: null,
    customerName: 'customerName',
    customerPhone: '777777',
    comment: 'comment',
    id: 100,
  }

  await context.addInitScript((token) => {
    localStorage.setItem('jwt', token)
  }, jwt)
  const page = await context.newPage()
  const loginPage = new LoginPage(page)
  const orderPage = new OrderPage(page)
  const foundPage = new OrderFoundPage(page)
  await loginPage.open()

  await page.route('**/orders/*', async (route) => {
    await route.fulfill({
      status: 200,
      json: order,
    })
  })

  await orderPage.statusButton.click()
  await orderPage.orderSearchInput.fill(String(order.id))
  const findOrderResponse = page.waitForResponse('**/orders/*')
  await orderPage.orderSearchButton.click()
  await findOrderResponse

  await foundPage.verifyPage()
  await foundPage.verifyStatus(order.status)
})

test('4.2 (mock) Find order [DELIVERED]', async ({ context }) => {
  const order = {
    status: 'DELIVERED',
    courierId: null,
    customerName: 'customerName',
    customerPhone: '777777',
    comment: 'comment',
    id: 100,
  }

  await context.addInitScript((token) => {
    localStorage.setItem('jwt', token)
  }, jwt)
  const page = await context.newPage()
  const loginPage = new LoginPage(page)
  const orderPage = new OrderPage(page)
  const foundPage = new OrderFoundPage(page)
  await loginPage.open()

  await page.route('**/orders/*', async (route) => {
    await route.fulfill({
      status: 200,
      json: order,
    })
  })

  await orderPage.statusButton.click()
  await orderPage.orderSearchInput.fill(String(order.id))
  const findOrderResponse = page.waitForResponse('**/orders/*')
  await orderPage.orderSearchButton.click()
  await findOrderResponse

  await foundPage.verifyPage()
  await foundPage.verifyStatus(order.status)
})

test('4.3 (mock) Find order with response 500', async ({ context }) => {
  const order = {
    status: 'OPEN',
    courierId: null,
    customerName: 'customerName',
    customerPhone: '777777',
    comment: 'comment',
    id: 100,
  }

  await context.addInitScript((token) => {
    localStorage.setItem('jwt', token)
  }, jwt)
  const page = await context.newPage()
  const loginPage = new LoginPage(page)
  const orderPage = new OrderPage(page)
  const notFoundPage = new OrderNotFoundPage(page)
  await loginPage.open()

  await page.route('**/orders/*', async (route) => {
    await route.fulfill({
      status: 500,
    })
  })

  await orderPage.statusButton.click()
  await orderPage.orderSearchInput.fill(String(order.id))
  const findOrderResponse = page.waitForResponse('**/orders/*')
  await orderPage.orderSearchButton.click()
  await findOrderResponse

  await notFoundPage.verifyPage()
})
