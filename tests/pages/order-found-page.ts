import { expect, Locator, Page } from '@playwright/test'
import { AuthorizedPage } from './authorized-page'

export class OrderFoundPage extends AuthorizedPage {
  readonly orderDetailsContainer: Locator

  constructor(page: Page) {
    super(page)
    this.orderDetailsContainer = page.locator('.order-details')
  }

  async open(orderId = 13367) {
    await this.page.goto(`${this.url}order/${orderId}`)
    await this.page.waitForLoadState('networkidle');
    return new OrderFoundPage(this.page)
  }

  async verifyPage() {
    await expect(this.orderDetailsContainer).toBeVisible()
    //
  }
}