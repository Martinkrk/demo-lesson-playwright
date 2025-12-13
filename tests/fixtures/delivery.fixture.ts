import { Page, test as base } from '@playwright/test'
import { AUTH_URL, ORDER_URL, PASSWORD, SERVICE_URL, USERNAME } from '../../config/env-data'
import { OrderPage } from '../pages/order-page'
import { OrderFoundPage } from '../pages/order-found-page'
import { OrderNotFoundPage } from '../pages/order-not-found-page'
import { LoginPage } from '../pages/login-page'


type Order = {
  status: string;
  courierId: null;
  customerName: string;
  customerPhone: string;
  comment: string;
  id: number;
};

type Fixture = {
  defaultOrderStatus: string,
  defaultOrder: Order,
  jwt: string,
  auth: Page,
  loginPage: LoginPage,
  orderPage: OrderPage,
  orderFoundPage: OrderFoundPage,
  orderNotFoundPage: OrderNotFoundPage,
  newOrder: Order,
}


export const test = base.extend<Fixture>({
  defaultOrderStatus: ['OPEN', {option: true}],

  defaultOrder: async({ defaultOrderStatus }, use) => {
    const defaultOrder = {
      status: defaultOrderStatus,
      courierId: null,
      customerName: 'customerName',
      customerPhone: '777777',
      comment: 'comment',
      id: 0,
    }
    await use(defaultOrder)
  },

  page: async( { page }, use) => {
    await page.goto(SERVICE_URL)
    await use(page)
  },

  jwt: async( { request }, use) => {
    const response = await request.post(AUTH_URL, { data: {username: USERNAME, password: PASSWORD}})
    const jwt = await response.text()
    await use(jwt)
  },

  auth: async( { context, jwt }, use) => {
    await context.addInitScript((token) => {
      localStorage.setItem('jwt', token)
    }, jwt)

    const page = await context.newPage()
    await page.goto(SERVICE_URL)
    await use(page)
  },

  loginPage: async( { page }, use) => {
    const loginPage = new LoginPage(page)
    await loginPage.open()
    await use(loginPage)
  },

  orderPage: async( { auth }, use) => {
    const orderPage = new OrderPage(auth)
    await orderPage.open()
    await use(orderPage)
  },

  orderFoundPage: async( { auth }, use) => {
    const orderFoundPage = new OrderFoundPage(auth)
    await use(orderFoundPage)
  },

  orderNotFoundPage: async( { auth }, use) => {
    const orderNotFoundPage = new OrderNotFoundPage(auth)
    await use(orderNotFoundPage)
  },

  newOrder: async({ request, defaultOrder, jwt }, use) => {
    const response = await request.post(ORDER_URL, {
      data: {
        status: defaultOrder.status,
        customerName: defaultOrder.customerName,
        customerPhone: defaultOrder.customerPhone,
        comment: defaultOrder.comment,
      },
      headers: {
        Authorization: `Bearer ${jwt}`,
        'Content-Type': 'application/json',
      },
    })
    const orderResponse = await response.json()
    await use(orderResponse)
  }
})