import { Elysia, t } from 'elysia'
import { client, initDb } from './db.ts'
import swagger from '@elysiajs/swagger'

await initDb()

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
  .get(
    'authors',
    async () => {
      const result = await client.query('SELECT * FROM authors')

      return result.rows.map((it) => ({
        author_id: it.author_id,
        name: it.name,
        bio: it.bio,
      }))
    },
    {
      response: t.Array(
        t.Object({
          author_id: t.String(),
          name: t.String(),
          bio: t.String(),
        }),
        { description: 'Get all authors' },
      ),
    },
  )
  .get(
    'author/:id',
    async ({ params: { id } }) => {
      const result = await client.query('SELECT * FROM authors WHERE author_id = $1', [id])

      if (result.rows.length === 0) {
        return null
      }

      const author = result.rows[0]
      const publishedBooks = await client.query('SELECT COUNT(*) FROM books WHERE author_id = $1', [author.id])
      return {
        author_id: author.author_id,
        name: author.name,
        bio: author.bio,
        published_books: +publishedBooks.rows[0].count,
      }
    },
    {
      response: t.Nullable(
        t.Object(
          {
            author_id: t.String(),
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
      if (await client.query('SELECT * FROM authors WHERE name = $1', [body.name]).then((it) => it.rows.length > 0)) {
        set.status = 'Conflict'
        return null
      }

      const newAuthor = await client.query('INSERT INTO authors (name, bio) VALUES ($1, $2) RETURNING author_id', [
        body.name,
        body.bio,
      ])

      const newAuthorId: string = newAuthor.rows[0].author_id
      return { author_id: newAuthorId }
    },
    {
      body: t.Object({
        name: t.String(),
        bio: t.String(),
      }),
      response: t.Nullable(
        t.Object({
          author_id: t.String(),
        }),
      ),
    },
  )
  .get(
    'author/:id/books',
    async ({ params: { id } }) => {
      const result = await client.query(
        `SELECT *
                 FROM books
                          LEFT JOIN authors a on a.id = books.author_id
                 WHERE a.author_id = $1`,
        [id],
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
      const result = await client.query('SELECT * FROM books')

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
      if (await client.query('SELECT * FROM books WHERE isbn = $1', [body.isbn]).then((it) => it.rows.length > 0)) {
        set.status = 'Conflict'
        return null
      }

      const author = await client.query('SELECT * FROM authors WHERE author_id = $1', [body.author_id])
      const newBook = await client.query(
        'INSERT INTO books (isbn, title, published_date, author_id) VALUES ($1, $2, $3, $4) RETURNING book_id',
        [body.isbn, body.title, body.published_date, author.rows[0].id],
      )

      const newBookId: string = newBook.rows[0].book_id
      return { book_id: newBookId }
    },
    {
      body: t.Object({
        isbn: t.String(),
        title: t.String(),
        published_date: t.String({ description: 'ISO8601 Date' }),
        author_id: t.String({ description: 'UUID of author' }),
      }),
      response: t.Nullable(
        t.Object({
          book_id: t.String(),
        }),
      ),
    },
  )
  .onError((err) => {
    console.error(err)
  })

app.onStop(async () => {
  console.log('Stopping server, closing database connection')
  await client.end()
})

app.listen(6969)

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}, go to http://${app.server?.hostname}:${app.server?.port}/swagger for swagger docs.`,
)
