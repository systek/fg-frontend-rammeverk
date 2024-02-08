import { Elysia, t } from 'elysia'
import { getClient, initDb } from './db.ts'
import swagger from '@elysiajs/swagger'
import { DbAuthor, DbBook } from './db-types.ts'
import path from 'path'
import { cwd } from 'node:process'

await initDb()

let slowness = 1000
let jitter = 300

const app = new Elysia()
  .use(
    swagger({
      documentation: {
        info: {
          title: 'Fake Bookshop',
          description: 'For fg-frontendrammeverk 2024',
          version: '1.0.0',
        },
      },
    }),
  )
  .onBeforeHandle(async (ctx) => {
    await new Promise((resolve) => setTimeout(resolve, slowness + Math.random() * jitter))
  })
  .get(
    'authors',
    async () => {
      const result = await getClient().query<DbAuthor>('SELECT * FROM authors')

      return result.rows.map((it) => ({
        uuid: it.uuid,
        name: it.name,
        bio: it.bio,
      }))
    },
    {
      response: t.Array(
        t.Object({
          uuid: t.String(),
          name: t.String(),
          bio: t.String(),
        }),
        { description: 'Get all authors' },
      ),
    },
  )
  .get(
    'author/:uuid',
    async ({ params: { uuid } }) => {
      const client = getClient()
      const result = await client.query<DbAuthor>('SELECT * FROM authors WHERE uuid = $1', [uuid])

      if (result.rows.length === 0) {
        return null
      }

      const author = result.rows[0]
      const publishedBooks = await client.query('SELECT COUNT(*) FROM books WHERE author_id = $1', [author.id])
      return {
        uuid: author.uuid,
        name: author.name,
        bio: author.bio,
        published_books: +publishedBooks.rows[0].count,
      }
    },
    {
      response: t.Nullable(
        t.Object(
          {
            uuid: t.String(),
            name: t.String(),
            bio: t.String(),
            published_books: t.Number({ description: 'Number of published books' }),
          },
          { description: 'Get author by UUID' },
        ),
      ),
    },
  )
  .post(
    'author',
    async ({ body, set }) => {
      const client = getClient()
      if (await client.query('SELECT * FROM authors WHERE name = $1', [body.name]).then((it) => it.rows.length > 0)) {
        set.status = 'Conflict'
        return null
      }

      const newAuthor = await client.query<{ uuid: string }>(
        'INSERT INTO authors (name, bio) VALUES ($1, $2) RETURNING uuid',
        [body.name, body.bio],
      )

      set.status = 'Created'

      const newAuthorId: string = newAuthor.rows[0].uuid
      return { uuid: newAuthorId }
    },
    {
      body: t.Object({
        name: t.String(),
        bio: t.String(),
      }),
      response: t.Nullable(
        t.Object({
          uuid: t.String(),
        }),
      ),
    },
  )
  .delete(
    'author/:uuid',
    async ({ params: { uuid }, set }) => {
      const client = getClient()
      if (await client.query('SELECT * FROM authors WHERE uuid = $1', [uuid]).then((it) => it.rows.length === 0)) {
        set.status = 'Not Found'
        return null
      }

      await client.query('BEGIN')
      const authorQuery = await client.query<DbAuthor>('SELECT * FROM authors WHERE uuid = $1', [uuid])
      const author = authorQuery.rows[0]

      const deletedBooks = await client.query('DELETE FROM books WHERE author_id = $1', [author.id])
      const deletedAuthor = await client.query('DELETE FROM authors WHERE id = $1', [author.id])
      await client.query('COMMIT')

      console.info(`Deleted ${deletedBooks.rowCount} books and ${deletedAuthor.rowCount} author`)

      return { uuid: author.uuid }
    },
    {
      response: t.Nullable(t.Object({ uuid: t.String() })),
    },
  )
  .get(
    'author/:uuid/books',
    async ({ params: { uuid } }) => {
      const result = await getClient().query<Pick<DbBook, 'title' | 'published_date' | 'isbn'>>(
        `SELECT title, published_date, isbn FROM books
                          LEFT JOIN authors a on a.id = books.author_id
                        WHERE a.uuid = $1`,
        [uuid],
      )

      return result.rows.map((it) => ({
        title: it.title,
        published_date: it.published_date.toISOString().slice(0, 10),
        isbn: it.isbn,
      }))
    },
    {
      response: t.Array(
        t.Object({
          title: t.String(),
          published_date: t.String({ description: 'ISO8601 Date' }),
          isbn: t.String(),
        }),
        { description: 'Get all books for author by UUID' },
      ),
    },
  )
  .get(
    'books',
    async () => {
      const result = await getClient().query<DbBook>('SELECT * FROM books')

      return result.rows.map((it) => ({
        title: it.title,
        published_date: it.published_date.toISOString().slice(0, 10),
        isbn: it.isbn,
      }))
    },
    {
      response: t.Array(
        t.Object({
          title: t.String(),
          published_date: t.String({ description: 'ISO8601 Date' }),
          isbn: t.String(),
        }),
        { description: 'Get all books' },
      ),
    },
  )
  .post(
    'book',
    async ({ body, set }) => {
      const client = getClient()

      if (await client.query('SELECT * FROM books WHERE isbn = $1', [body.isbn]).then((it) => it.rows.length > 0)) {
        set.status = 'Conflict'
        return null
      }

      const author = await client.query<DbAuthor>('SELECT * FROM authors WHERE uuid = $1', [body.author_uuid])
      const newBook = await client.query<Pick<DbBook, 'uuid'>>(
        'INSERT INTO books (isbn, title, published_date, author_id) VALUES ($1, $2, $3, $4) RETURNING uuid',
        [body.isbn, body.title, body.published_date, author.rows[0].id],
      )

      set.status = 'Created'

      const newBookId: string = newBook.rows[0].uuid
      return { book_id: newBookId }
    },
    {
      body: t.Object({
        isbn: t.String(),
        title: t.String(),
        published_date: t.String({ description: 'ISO8601 Date' }),
        author_uuid: t.String({ description: 'UUID of author' }),
      }),
      response: t.Nullable(
        t.Object({
          book_id: t.String(),
        }),
      ),
    },
  )
  .delete('book/:isbn', async ({ params: { isbn }, set }) => {
    const client = getClient()

    if (await client.query('SELECT * FROM books where isbn = $1', [isbn]).then((it) => it.rows.length === 0)) {
      set.status = 'Not Found'
      return null
    }

    await client.query('DELETE FROM books WHERE isbn = $1', [isbn])

    console.info(`Deleted book with ISBN ${isbn}`)

    return { isbn }
  })
  .put(
    'book/:isbn',
    async ({ params: { isbn }, body, set }) => {
      const client = getClient()

      const isbnRegex = /^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[\d-]+$/
      if (!isbnRegex.test(body.isbn)) {
        set.status = 'Bad Request'
        return null
      }

      const result = await client.query<Pick<DbBook, 'isbn' | 'published_date' | 'title'>>(
        'UPDATE books SET isbn = $1, title = $2, published_date = $3 WHERE isbn = $4 RETURNING isbn, title, published_date',
        [body.isbn, body.title, body.published_date, isbn],
      )

      if (result.rows.length === 0) return null

      const updatedBook = result.rows[0]
      return updatedBook
    },
    {
      response: t.Nullable(
        t.Object({
          isbn: t.String(),
          title: t.String(),
          published_date: t.Date({ description: 'ISO8601 Date' }),
        }),
      ),
      body: t.Object({
        isbn: t.String(),
        title: t.String(),
        published_date: t.String({ description: 'ISO8601 Date' }),
      }),
    },
  )
  .post('dev/re-seed', async () => {
    const client = getClient()
    await client.query('BEGIN')
    await client.query('DELETE FROM books')
    await client.query('DELETE FROM authors')
    await client.query('ALTER SEQUENCE authors_id_seq RESTART WITH 1')
    await client.query(await Bun.file(path.join(cwd(), 'db', 'seed.sql')).text())
    await client.query('COMMIT')

    return { success: true }
  })
  .get('dev/ready', async () => {
    return { status: 'ok' }
  })
  .post('dev/slowness/:ms/:jitter', async ({ params }) => {
    slowness = +params.ms
    jitter = +params.jitter
    return { status: `Set slowness to ${slowness} and jitter to ${jitter}` }
  })
  .onError((err) => {
    console.error(err)
  })

app.onStop(async () => {
  console.log('Stopping server, closing database connection')
  await getClient().end()
})

app.listen(6969)

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}, go to http://${app.server?.hostname}:${app.server?.port}/swagger for swagger docs.`,
)
