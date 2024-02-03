export type DbBook = {
  uuid: string
  title: string
  published_date: Date
  isbn: string
  author_id: number
}

export type DbAuthor = {
  id: number
  uuid: string
  name: string
  bio: string
}
