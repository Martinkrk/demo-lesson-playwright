import { expect, Locator, Page } from '@playwright/test'
import { AuthorizedPage } from './authorized-page'

export class OrderFoundPage extends AuthorizedPage {
  readonly orderDetailsContainer: Locator
  readonly statusOpen: Locator
  readonly statusDelivered: Locator

  constructor(page: Page) {
    super(page)
    this.orderDetailsContainer = page.locator('.order-details')
    this.statusOpen = page.getByTestId('status-item-0')
    this.statusDelivered = page.getByTestId('status-item-3')
  }

  async open(orderId = 13367) {
    await this.page.goto(`${this.url}order/${orderId}`)
    await this.page.waitForLoadState('networkidle')
    return new OrderFoundPage(this.page)
  }

  async verifyPage() {
    await expect(this.orderDetailsContainer).toBeVisible()
  }

  async verifyStatus(status: string) {
    if (status === 'OPEN') {
      await expect(this.statusOpen.locator('span')).toContainClass('status-list__status_active')
    } else if (status === 'DELIVERED') {
      await expect(this.statusDelivered.locator('span')).toContainClass(
        'status-list__status_active',
      )
    }
  }
}
