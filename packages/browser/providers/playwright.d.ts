import type {
  BrowserContext,
  BrowserContextOptions,
  Frame,
  FrameLocator,
  LaunchOptions,
  Page,
  CDPSession,
  ConnectOptions
} from 'playwright'
import { Protocol } from 'playwright-core/types/protocol'
import '../matchers.js'
import type {} from "vitest/node"
import type {
  Locator,
  ScreenshotComparatorRegistry,
  ScreenshotMatcherOptions,
} from "@vitest/browser/context"

declare module 'vitest/node' {
  export interface BrowserProviderOptions {
    launch?: LaunchOptions
    connect?: {
      wsEndpoint: string
      options?: ConnectOptions
    }
    context?: Omit<
      BrowserContextOptions,
      'ignoreHTTPSErrors' | 'serviceWorkers'
    > & {
      /**
       * The maximum time in milliseconds to wait for `userEvent` action to complete.
       * @default 0 (no timeout)
       */
      actionTimeout?: number
    }
  }

  export interface BrowserCommandContext {
    page: Page
    frame(): Promise<Frame>
    iframe: FrameLocator
    context: BrowserContext
  }

  export interface ToMatchScreenshotOptions
    extends Omit<
      ScreenshotMatcherOptions,
      "comparatorName" | "comparatorOptions"
    > {}

  export interface ToMatchScreenshotComparators
    extends ScreenshotComparatorRegistry {}
}

type PWHoverOptions = NonNullable<Parameters<Page['hover']>[1]>
type PWClickOptions = NonNullable<Parameters<Page['click']>[1]>
type PWDoubleClickOptions = NonNullable<Parameters<Page['dblclick']>[1]>
type PWFillOptions = NonNullable<Parameters<Page['fill']>[2]>
type PWScreenshotOptions = NonNullable<Parameters<Page['screenshot']>[0]>
type PWSelectOptions = NonNullable<Parameters<Page['selectOption']>[2]>
type PWDragAndDropOptions = NonNullable<Parameters<Page['dragAndDrop']>[2]>
type PWSetInputFiles = NonNullable<Parameters<Page['setInputFiles']>[2]>

declare module '@vitest/browser/context' {
  export interface UserEventHoverOptions extends PWHoverOptions {}
  export interface UserEventClickOptions extends PWClickOptions {}
  export interface UserEventDoubleClickOptions extends PWDoubleClickOptions {}
  export interface UserEventTripleClickOptions extends PWClickOptions {}
  export interface UserEventFillOptions extends PWFillOptions {}
  export interface UserEventSelectOptions extends PWSelectOptions {}
  export interface UserEventDragAndDropOptions extends PWDragAndDropOptions {}
  export interface UserEventUploadOptions extends PWSetInputFiles {}

  export interface ScreenshotOptions extends Omit<PWScreenshotOptions, 'mask'> {
    mask?: ReadonlyArray<Element | Locator> | undefined
  }

  export interface CDPSession {
    send<T extends keyof Protocol.CommandParameters>(
      method: T,
      params?: Protocol.CommandParameters[T]
    ): Promise<Protocol.CommandReturnValues[T]>
    on<T extends keyof Protocol.Events>(
      event: T,
      listener: (payload: Protocol.Events[T]) => void
    ): this;
    once<T extends keyof Protocol.Events>(
      event: T,
      listener: (payload: Protocol.Events[T]) => void
    ): this;
    off<T extends keyof Protocol.Events>(
      event: T,
      listener: (payload: Protocol.Events[T]) => void
    ): this;
  }
}
