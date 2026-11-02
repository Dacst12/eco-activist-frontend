import Form from 'next/form'
import Link from 'next/link'
import type { DictionaryItem } from '@/entities/dictionary'
import type { EventFilters as Filters } from '@/entities/event'
import { Button, buttonClass, DateRangeField, Field, Select } from '@/shared/ui'

type EventFiltersProps = {
  filters: Filters
  types: DictionaryItem[]
  districts: DictionaryItem[]
  organizers: DictionaryItem[]
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
  types,
  districts,
  organizers,
}: EventFiltersProps) {
  return (
    <Form
      action="/"
      key={JSON.stringify(filters)}
      className="mt-6 flex flex-col gap-4"
    >
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
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

        <Field label="Организатор">
          <Select
            name="organizer"
            aria-label="Организатор"
            defaultValue={filters.organizer ?? ''}
          >
            <option value="">Все организаторы</option>
            <Options items={organizers} />
          </Select>
        </Field>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="seats"
            value="1"
            defaultChecked={filters.seats === '1'}
            className="accent-primary size-4"
          />
          Только со свободными местами
        </label>

        <div className="flex gap-4">
          <Link href="/" className={buttonClass('secondary')}>
            Сбросить фильтры
          </Link>
          <Button type="submit">Найти</Button>
        </div>
      </div>
    </Form>
  )
}
