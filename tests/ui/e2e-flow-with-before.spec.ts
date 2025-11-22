import { test, expect } from '@playwright/test'
import { LoginPage } from '../pages/login-page'
import { faker } from '@faker-js/faker/locale/ar'
import { PASSWORD, USERNAME } from '../../config/env-data'
import { OrderNotFoundPage } from '../pages/order-not-found-page'
import { OrderFoundPage } from '../pages/order-found-page'

let authPage: LoginPage

test.beforeEach(async ({ page }) => {
  authPage = new LoginPage(page)
  await authPage.open()
})

test('3.0 signIn button disabled when incorrect data inserted', async ({}) => {
  await authPage.usernameField.fill(faker.lorem.word(2))
  await authPage.passwordField.fill(faker.lorem.word(7))
  await expect(authPage.signInButton).toBeDisabled()
})

test('3.1 login and verify order creation page', async ({}) => {
  const orderCreationPage = await authPage.signIn(USERNAME, PASSWORD)
  await orderCreationPage.verifyPage()
})

test('3.2 login and create order', async ({}) => {
  const orderCreationPage = await authPage.signIn(USERNAME, PASSWORD)
  await orderCreationPage.createOrder()
  await orderCreationPage.isPopupVisible(true)
})

test('3.3 login and input incorrect username and phone', async ({}) => {
  const orderCreationPage = await authPage.signIn(USERNAME, PASSWORD)
  await orderCreationPage.nameField.fill(faker.lorem.word(1))
  await orderCreationPage.phoneField.fill(faker.lorem.word(5))

  await expect(orderCreationPage.nameFieldError).toBeVisible()
  await expect(orderCreationPage.phoneFieldError).toBeVisible()
})

test('3.4 login and logout', async ({}) => {
  const orderCreationPage = await authPage.signIn(USERNAME, PASSWORD)
  const loginPage = await orderCreationPage.signOut()
  await loginPage.verifyPage()
})

test('3.5 search for nonexisting order', async ({}) => {
  const orderCreationPage = await authPage.signIn(USERNAME, PASSWORD)
  const orderNotFoundPage = new OrderNotFoundPage(orderCreationPage.page)
  await orderNotFoundPage.open()
  await orderNotFoundPage.verifyPage()
})

test('3.6 search for existing order', async ({}) => {
  const orderCreationPage = await authPage.signIn(USERNAME, PASSWORD)
  const orderFoundPage = new OrderFoundPage(orderCreationPage.page)
  await orderFoundPage.open()
  await orderFoundPage.verifyPage()
})
