import { expect, Locator, type Page } from '@playwright/test'
import { OrderPage } from './order-page'
import { BasePage } from './base-page'

export class LoginPage extends BasePage {
  readonly signInButton: Locator
  readonly usernameField: Locator
  readonly passwordField: Locator

  constructor(page: Page) {
    super(page)
    this.signInButton = page.getByTestId('signIn-button')
    this.usernameField = page.getByTestId('username-input')
    this.passwordField = page.getByTestId('password-input')
  }

  async open() {
    await this.page.goto(this.url)
  }

  async signIn(username: string, password: string) {
    await this.usernameField.fill(username)
    await this.passwordField.fill(password)
    await this.signInButton.click()

    await this.page.waitForLoadState('networkidle')
    return new OrderPage(this.page)
  }

  async verifyPage() {
    await expect(this.signInButton).toBeVisible()
  }
}
