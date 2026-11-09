import Form from 'next/form'
import Link from 'next/link'
import type { DictionaryItem } from '@/entities/dictionary'
import type { EventFilters as Filters } from '@/entities/event'
import { Button, buttonClass, DateRangeField, Field, Select } from '@/shared/ui'
import { catalogHref, CatalogView } from '../lib/view'
import { ViewSwitch } from './ViewSwitch'

type EventFiltersProps = {
  filters: Filters
  view: CatalogView
  types: DictionaryItem[]
  districts: DictionaryItem[]
}

function Options({ items }: { items: DictionaryItem[] }) {
  return items.map((item) => (
    <option key={item.id} value={item.id}>
      {item.name}
    </option>
  ))
}

export function EventFilters({
  filters,
  view,
  types,
  districts,
}: EventFiltersProps) {
  return (
    <Form
      action="/"
      key={JSON.stringify(filters)}
      className="mt-6 flex flex-col gap-4"
    >
      {view === 'map' && <input type="hidden" name="view" value="map" />}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Field label="Район">
          <Select
            name="district"
            aria-label="Район"
            defaultValue={filters.district ?? ''}
          >
            <option value="">Все районы</option>
            <Options items={districts} />
          </Select>
        </Field>

        <Field label="Дата">
          <DateRangeField
            label="Дата"
            defaultFrom={filters.from}
            defaultTo={filters.to}
          />
        </Field>

        <Field label="Категория">
          <Select
            name="type"
            aria-label="Категория"
            defaultValue={filters.type ?? ''}
          >
            <option value="">Все категории</option>
            <Options items={types} />
          </Select>
        </Field>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <ViewSwitch filters={filters} view={view} />

        <div className="flex gap-4">
          <Link
            href={catalogHref({}, view)}
            className={buttonClass('secondary')}
          >
            Сбросить фильтры
          </Link>
          <Button type="submit">Найти</Button>
        </div>
      </div>
    </Form>
  )
}
