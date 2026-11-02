let resolveReady: () => void = () => {}

export const mocksReady = new Promise<void>((resolve) => {
  resolveReady = resolve
})

export const markMocksReady = () => resolveReady()
