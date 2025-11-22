import { Locator, Page } from '@playwright/test'
import { SERVICE_URL } from '../../config/env-data'

export abstract class BasePage {
  readonly page: Page
  readonly url: string
  readonly footer: Locator

  protected constructor(page: Page) {
    this.page = page
    this.url = SERVICE_URL
    this.footer = page.locator('.Footer');
  }
}