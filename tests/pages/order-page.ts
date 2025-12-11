import { expect, Locator, Page } from '@playwright/test'
import { faker } from '@faker-js/faker/locale/ar'
import { LoginPage } from './login-page'
import { AuthorizedPage } from './authorized-page'

export class OrderPage extends AuthorizedPage {
  readonly statusButton: Locator
  readonly orderSearchInput: Locator
  readonly orderSearchButton: Locator
  readonly nameField: Locator
  readonly phoneField: Locator
  readonly commentField: Locator
  readonly orderButton: Locator
  readonly orderPopup: Locator
  readonly orderPopupSpan: Locator
  readonly nameFieldError: Locator
  readonly phoneFieldError: Locator

  constructor(page: Page) {
    super(page)
    this.statusButton = page.getByTestId('openStatusPopup-button')
    this.orderSearchInput = page.getByTestId('searchOrder-input')
    this.orderSearchButton = page.getByTestId('searchOrder-submitButton')
    this.nameField = page.getByTestId('username-input')
    this.phoneField = page.getByTestId('phone-input')
    this.commentField = page.getByTestId('comment-input')
    this.orderButton = page.getByTestId('createOrder-button')
    this.orderPopup = page.getByTestId('orderSuccessfullyCreated-popup').locator('..')
    this.orderPopupSpan = this.orderPopup.locator('span')
    this.nameFieldError = page.getByTestId('username-input-error')
    this.phoneFieldError = page.getByTestId('phone-input-error')
  }

  async getOrderIdByPopup() {
    return (await this.orderPopupSpan.innerText()).split(' ')[2]
  }

  async verifyPage() {
    await expect(this.statusButton).toBeVisible()
    await expect(this.nameField).toBeVisible()
    await expect(this.phoneField).toBeVisible()
    await expect(this.commentField).toBeVisible()
    await expect(this.orderButton).toBeVisible()
    await expect(this.logoutButton).toBeVisible()
    await this.verifyPopupVisible(false)
  }

  async verifyPopupVisible(visible = true) {
    await expect(this.orderPopup).toHaveClass(visible ? /popup_opened/ : /undefined/)
  }

  async verifyOrderId(orderId: string) {
    await this.verifyPopupVisible()
    expect(await this.getOrderIdByPopup()).toBe(orderId)
  }

  async createOrder() {
    await this.nameField.fill(faker.person.fullName())
    await this.phoneField.fill(faker.phone.imei())
    await this.commentField.fill(faker.lorem.sentence(20))
    await this.orderButton.click()
  }

  async signOut() {
    await this.logoutButton.click()

    await this.page.waitForLoadState('networkidle')
    return new LoginPage(this.page)
  }
}
