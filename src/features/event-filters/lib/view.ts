export type CatalogView = 'list' | 'map'
export const parseCatalogView = (value: unknown): CatalogView =>
  value === 'map' ? 'map' : 'list'
