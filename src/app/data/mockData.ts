import { Person } from '../types/person';

export const mockPersons: Person[] = [
  {
    id: '1',
    firstName: 'Іван',
    lastName: 'Петренко',
    middleName: 'Миколайович',
    birthDate: '1920-05-15',
    deathDate: '1995-12-20',
    gender: 'male',
    parents: [],
    children: ['3', '4'],
    spouse: '2',
    description: 'Ветеран Другої світової війни, працював учителем історії.',
    facts: [
      'Нагороджений орденом Вітчизняної війни',
      'Викладав історію в школі 45 років',
      'Написав книгу спогадів про війну'
    ],
    photos: []
  },
  {
    id: '2',
    firstName: 'Марія',
    lastName: 'Петренко',
    middleName: 'Василівна',
    maidenName: 'Коваленко',
    birthDate: '1925-08-10',
    deathDate: '2000-03-15',
    gender: 'female',
    parents: [],
    children: ['3', '4'],
    spouse: '1',
    description: 'Медична сестра, працювала в обласній лікарні.',
    facts: [
      'Працювала медсестрою 40 років',
      'Мала відзнаку "Заслужений медичний працівник"',
      'Любила вишивати та співати в хорі'
    ],
    photos: []
  },
  {
    id: '3',
    firstName: 'Петро',
    lastName: 'Петренко',
    middleName: 'Іванович',
    birthDate: '1950-03-22',
    gender: 'male',
    parents: ['1', '2'],
    children: ['5', '6'],
    spouse: '7',
    description: 'Інженер-будівельник, керував великими будівельними проектами.',
    facts: [
      'Закінчив Київський будівельний інститут',
      'Керував будівництвом житлового комплексу',
      'Захоплювався шахами'
    ],
    photos: []
  },
  {
    id: '4',
    firstName: 'Олена',
    lastName: 'Сидоренко',
    middleName: 'Іванівна',
    maidenName: 'Петренко',
    birthDate: '1952-07-18',
    gender: 'female',
    parents: ['1', '2'],
    children: ['8'],
    spouse: '9',
    description: 'Вчителька української мови та літератури.',
    facts: [
      'Вчитель року 1985',
      'Підготувала 15 переможців олімпіад',
      'Писала вірші'
    ],
    photos: []
  },
  {
    id: '5',
    firstName: 'Андрій',
    lastName: 'Петренко',
    middleName: 'Петрович',
    birthDate: '1975-11-30',
    gender: 'male',
    parents: ['3', '7'],
    children: ['10'],
    spouse: '11',
    description: 'IT-спеціаліст, працює в міжнародній компанії.',
    facts: [
      'Закінчив факультет кібернетики',
      'Працює Team Lead в tech компанії',
      'Любить подорожувати'
    ],
    photos: []
  },
  {
    id: '6',
    firstName: 'Наталія',
    lastName: 'Мельник',
    middleName: 'Петрівна',
    maidenName: 'Петренко',
    birthDate: '1978-06-12',
    gender: 'female',
    parents: ['3', '7'],
    children: ['12'],
    spouse: '13',
    description: 'Лікар-педіатр, працює в дитячій лікарні.',
    facts: [
      'Закінчила медичний університет з відзнакою',
      'Спеціалізується на алергології',
      'Веде блог про здоров\'я дітей'
    ],
    photos: []
  },
  {
    id: '7',
    firstName: 'Тетяна',
    lastName: 'Петренко',
    middleName: 'Олександрівна',
    maidenName: 'Іваненко',
    birthDate: '1952-09-05',
    gender: 'female',
    parents: [],
    children: ['5', '6'],
    spouse: '3',
    description: 'Бухгалтер, працювала в державній установі.',
    facts: [
      'Працювала головним бухгалтером',
      'Любила готувати',
      'Вела родинний архів'
    ],
    photos: []
  },
  {
    id: '8',
    firstName: 'Максим',
    lastName: 'Сидоренко',
    middleName: 'Володимирович',
    birthDate: '1980-04-25',
    gender: 'male',
    parents: ['4', '9'],
    children: [],
    description: 'Адвокат, має власну юридичну практику.',
    facts: [
      'Закінчив юридичний факультет',
      'Спеціалізується на корпоративному праві',
      'Захоплюється спортом'
    ],
    photos: []
  },
  {
    id: '9',
    firstName: 'Володимир',
    lastName: 'Сидоренко',
    middleName: 'Миколайович',
    birthDate: '1950-02-14',
    gender: 'male',
    parents: [],
    children: ['8'],
    spouse: '4',
    description: 'Журналіст, працював у обласній газеті.',
    facts: [
      'Працював кореспондентом 35 років',
      'Отримав премію за серію репортажів',
      'Любив фотографувати'
    ],
    photos: []
  },
  {
    id: '10',
    firstName: 'Софія',
    lastName: 'Петренко',
    middleName: 'Андріївна',
    birthDate: '2005-08-20',
    gender: 'female',
    parents: ['5', '11'],
    children: [],
    description: 'Студентка, вивчає міжнародні відносини.',
    facts: [
      'Навчається на третьому курсі',
      'Знає три іноземні мови',
      'Займається волонтерством'
    ],
    photos: []
  },
  {
    id: '11',
    firstName: 'Олена',
    lastName: 'Петренко',
    middleName: 'Сергіївна',
    maidenName: 'Ткаченко',
    birthDate: '1980-01-15',
    gender: 'female',
    parents: [],
    children: ['10'],
    spouse: '5',
    description: 'Дизайнер інтер\'єрів.',
    facts: [
      'Має власну дизайн-студію',
      'Переможець дизайнерських конкурсів',
      'Викладає курси по дизайну'
    ],
    photos: []
  },
  {
    id: '12',
    firstName: 'Данило',
    lastName: 'Мельник',
    middleName: 'Олегович',
    birthDate: '2008-12-03',
    gender: 'male',
    parents: ['6', '13'],
    children: [],
    description: 'Школяр, захоплюється програмуванням.',
    facts: [
      'Навчається в 9 класі',
      'Переможець олімпіади з інформатики',
      'Займається робототехнікою'
    ],
    photos: []
  },
  {
    id: '13',
    firstName: 'Олег',
    lastName: 'Мельник',
    middleName: 'Вікторович',
    birthDate: '1975-10-22',
    gender: 'male',
    parents: [],
    children: ['12'],
    spouse: '6',
    description: 'Підприємець, власник мережі магазинів.',
    facts: [
      'Заснував бізнес у 2000 році',
      'Має 5 магазинів',
      'Підтримує місцеві спортивні команди'
    ],
    photos: []
  }
];
