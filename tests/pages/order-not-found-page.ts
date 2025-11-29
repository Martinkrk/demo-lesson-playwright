import { expect, Locator, Page } from '@playwright/test'
import { AuthorizedPage } from './authorized-page'

export class OrderNotFoundPage extends AuthorizedPage {
  readonly notFoundContainer: Locator

  constructor(page: Page) {
    super(page)
    this.notFoundContainer = page.getByTestId('orderNotFound-container')
  }

  async open(orderId = -1) {
    await this.page.goto(`${this.url}order/${orderId}`)
    await this.page.waitForLoadState('networkidle')
    return new OrderNotFoundPage(this.page)
  }

  async verifyPage() {
    await expect(this.notFoundContainer).toBeVisible()
    //
  }
}
