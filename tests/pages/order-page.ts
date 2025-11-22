import { expect, Locator, Page } from '@playwright/test'
import { faker } from '@faker-js/faker/locale/ar'
import { LoginPage } from './login-page'
import { AuthorizedPage } from './authorized-page'

export class OrderPage extends AuthorizedPage {
  readonly statusButton: Locator
  readonly nameField: Locator
  readonly phoneField: Locator
  readonly commentField: Locator
  readonly orderButton: Locator
  readonly orderPopup: Locator
  readonly nameFieldError: Locator
  readonly phoneFieldError: Locator

  constructor(page: Page) {
    super(page)
    this.statusButton = page.getByTestId('openStatusPopup-button')
    this.nameField = page.getByTestId('username-input')
    this.phoneField = page.getByTestId('phone-input')
    this.commentField = page.getByTestId('comment-input')
    this.orderButton = page.getByTestId('createOrder-button')
    this.orderPopup = page.getByTestId('orderSuccessfullyCreated-popup').locator('..')
    this.nameFieldError = page.getByTestId('username-input-error')
    this.phoneFieldError = page.getByTestId('phone-input-error')
  }

  async verifyPage() {
    await expect(this.statusButton).toBeVisible()
    await expect(this.nameField).toBeVisible()
    await expect(this.phoneField).toBeVisible()
    await expect(this.commentField).toBeVisible()
    await expect(this.orderButton).toBeVisible()
    await expect(this.logoutButton).toBeVisible()
    await this.isPopupVisible(false)
  }

  async isPopupVisible(visible = true) {
    await expect(this.orderPopup).toHaveClass(visible ? /popup_opened/ : /undefined/)
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
