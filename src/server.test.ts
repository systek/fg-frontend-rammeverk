import { test, describe, expect, beforeAll, beforeEach } from 'bun:test'

describe('API sanity checks', () => {
  beforeEach(async () => {
    await fetch('http://localhost:6969/dev/re-seed', { method: 'POST' })
  })

  test('GET /authors', async () => {
    const response = await fetch('http://localhost:6969/authors')
    const data = await response.json()

    expect(data).toHaveLength(8)
  })

  test('GET /books', async () => {
    const response = await fetch('http://localhost:6969/books')
    const data = await response.json()

    expect(data).toHaveLength(129)
  })

  test('GET /author/:uuid', async () => {
    const response = await fetch('http://localhost:6969/authors')
    const data = (await response.json()) as { uuid: string }[]
    const authorUuid = data[0].uuid

    const authorResponse = await fetch(`http://localhost:6969/author/${authorUuid}`)
    const authorData = await authorResponse.json()

    expect(authorData).toEqual({
      name: 'J.K. Rowling',
      bio: 'British author, best known for the Harry Potter series.',
      published_books: 20,
      uuid: authorUuid,
    })
  })

  test('GET /author/:uuid/books', async () => {
    const response = await fetch('http://localhost:6969/authors')
    const data = (await response.json()) as { uuid: string }[]
    const authorUuid = data[0].uuid

    const authorBooksResponse = await fetch(`http://localhost:6969/author/${authorUuid}/books`)
    const authorBooksData = await authorBooksResponse.json()

    expect(authorBooksData).toHaveLength(20)
  })

  test('POST /author', async () => {
    const response = await fetch('http://localhost:6969/author', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'New Author',
        bio: 'New author bio',
      }),
    })

    expect(response.status).toBe(201)
  })

  test('POST /book', async () => {
    const response = await fetch('http://localhost:6969/authors')
    const data = (await response.json()) as { uuid: string }[]
    const authorUuid = data[0].uuid

    const bookResponse = await fetch('http://localhost:6969/book', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: 'New Book',
        isbn: '1234567890',
        published_date: '2022-01-01',
        author_uuid: authorUuid,
      }),
    })

    expect(bookResponse.status).toBe(201)
  })

  test('POST /author, POST /book on author, GET /books from author', async () => {
    const authorResponse = await fetch('http://localhost:6969/author', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Author with book',
        bio: 'Author with book bio',
      }),
    })
    const authorData = (await authorResponse.json()) as { uuid: string }
    const authorUuid = authorData.uuid

    const bookResponse = await fetch('http://localhost:6969/book', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: 'Book from author',
        isbn: '1234567890',
        published_date: '2022-01-01',
        author_uuid: authorUuid,
      }),
    })
    expect(bookResponse.status).toBe(201)

    const authorBooksResponse = await fetch(`http://localhost:6969/author/${authorUuid}/books`)
    const authorBooksData = await authorBooksResponse.json()
    expect(authorBooksData).toHaveLength(1)
  })
})
