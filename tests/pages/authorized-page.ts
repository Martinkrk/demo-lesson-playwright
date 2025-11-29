import { BasePage } from './base-page'
import { Locator, Page } from '@playwright/test'
import { LoginPage } from './login-page'

export class AuthorizedPage extends BasePage {
  readonly statusButton: Locator
  readonly logoutButton: Locator
  readonly searchOrderInput: Locator
  readonly searchOrderButton: Locator

  constructor(page: Page) {
    super(page)
    this.statusButton = page.getByTestId('openStatusPopup-button')
    this.logoutButton = page.getByTestId('logout-button')
    this.searchOrderInput = page.getByTestId('searchOrder-input')
    this.searchOrderButton = page.getByTestId('searchOrder-submitButton')
  }

  async logout() {
    await this.logoutButton.click()
    return new LoginPage(this.page)
  }

  async openOrder(id: string) {
    await this.page.goto(`${this.url}order/${id}`)
  }

  async findOrderById(id: string) {
    await this.statusButton.click()
    await this.searchOrderInput.fill(String(id))
    await this.searchOrderButton.click()
  }
}
