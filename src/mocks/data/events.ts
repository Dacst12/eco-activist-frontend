import type { EventDetails } from '@/entities/event'

const CENTER = { lat: 56.8333, lng: 60.5833 }

const types = [
  { id: '1', name: 'Субботник' },
  { id: '2', name: 'Сбор вторсырья' },
  { id: '3', name: 'Посадка деревьев' },
  { id: '4', name: 'Экоквест' },
  { id: '5', name: 'Лекция' },
]

const districts = [
  { id: '1', name: 'Центральный' },
  { id: '2', name: 'Северный' },
  { id: '3', name: 'Южный' },
]

const organizers = [
  { id: '1', name: 'Зелёный город' },
  { id: '2', name: 'Эковолонтёры вуза' },
  { id: '3', name: 'Чистый берег' },
]

const titles = [
  'Уборка набережной',
  'Сбор пластика у школы',
  'Посадка клёнов в парке',
  'Экоквест для студентов',
  'Лекция о сортировке отходов',
  'Субботник во дворе',
  'Сбор макулатуры',
  'Высадка саженцев у реки',
  'Уборка лесопарка',
  'Сбор батареек',
  'Экоквест «Чистый район»',
  'Лекция о компостировании',
]

const pointsByType: Record<string, number> = {
  '1': 10,
  '2': 5,
  '3': 15,
  '4': 10,
  '5': 5,
}

const day = 24 * 60 * 60 * 1000

export const events: EventDetails[] = titles.map((title, i) => {
  const type = types[i % types.length]
  const startsAt = new Date(Date.now() + (i + 1) * day)
  startsAt.setHours(10 + (i % 4) * 2, 0, 0, 0)
  const capacity = [10, 20, 30, 15][i % 4]

  return {
    id: String(i + 1),
    title,
    type,
    district: districts[i % districts.length],
    organizer: organizers[i % organizers.length],
    startsAt: startsAt.toISOString(),
    endsAt: new Date(startsAt.getTime() + 3 * 60 * 60 * 1000).toISOString(),
    address: `ул. Тестовая, ${i + 1}`,
    location: {
      lat: CENTER.lat + Math.sin(i * 1.7) * 0.03,
      lng: CENTER.lng + Math.cos(i * 1.7) * 0.05,
    },
    capacity,
    registeredCount:
      i % 5 === 0 ? capacity : Math.floor(capacity / (2 + (i % 3))),
    points: pointsByType[type.id],
    status: 'published',
    description: `Присоединяйтесь к мероприятию «${title}». Подробности уточняйте у организатора.`,
    inventory: ['Перчатки', 'Мешки для мусора'],
    organizerContacts: 't.me/eco_example',
  }
})

export const toSummary = ({
  description,
  inventory,
  organizerContacts,
  ...summary
}: EventDetails) => summary
