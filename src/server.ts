import { Elysia, t } from "elysia";
import { client, initDb } from "./db.ts";
import swagger from "@elysiajs/swagger";

await initDb();

const app = new Elysia()
  .use(
    swagger({
      documentation: {
        info: {
          title: "Fake Bookshop",
          description: "For fg-frontendrammeverk 2024",
          version: "1.0.0",
        },
      },
    }),
  )
  .get(
    "authors",
    async () => {
      const result = await client.query("SELECT * FROM authors");

      return result.rows.map((it) => ({
        author_id: it.author_id,
        name: it.name,
        bio: it.bio,
      }));
    },
    {
      response: t.Array(
        t.Object({
          author_id: t.String(),
          name: t.String(),
          bio: t.String(),
        }),
        { description: "Get all authors" },
      ),
    },
  )
  .get(
    "author/:id",
    async ({ params: { id } }) => {
      const result = await client.query(
        "SELECT * FROM authors WHERE author_id = $1",
        [id],
      );

      if (result.rows.length === 0) {
        return null;
      }

      const author = result.rows[0];
      return {
        author_id: author.author_id,
        name: author.name,
        bio: author.bio,
      };
    },
    {
      response: t.Nullable(
        t.Object(
          {
            author_id: t.String(),
            name: t.String(),
            bio: t.String(),
          },
          { description: "Get author by UUID" },
        ),
      ),
    },
  )
  .get(
    "author/:id/books",
    async ({ params: { id } }) => {
      const result = await client.query(
        `SELECT *
                 FROM books
                          LEFT JOIN authors a on a.id = books.author_id
                 WHERE a.author_id = $1`,
        [id],
      );

      return result.rows.map((it) => ({
        title: it.title,
        published_date: it.published_date.toISOString().slice(0, 10),
        isbn: it.isbn,
      }));
    },
    {
      response: t.Array(
        t.Object({
          title: t.String(),
          published_date: t.String({ description: "ISO8601 Date" }),
          isbn: t.String(),
        }),
        { description: "Get all books for author by UUID" },
      ),
    },
  )
  .get(
    "books",
    async () => {
      const result = await client.query("SELECT * FROM books");

      return result.rows.map((it) => ({
        title: it.title,
        published_date: it.published_date.toISOString().slice(0, 10),
        isbn: it.isbn,
      }));
    },
    {
      response: t.Array(
        t.Object({
          title: t.String(),
          published_date: t.String({ description: "ISO8601 Date" }),
          isbn: t.String(),
        }),
        { description: "Get all books" },
      ),
    },
  )
  .put(
    "book",
    async ({ body, set }) => {
      // if isbn already exists
      if (
        await client
          .query("SELECT * FROM books WHERE isbn = $1", [body.isbn])
          .then((it) => it.rows.length > 0)
      ) {
        set.status = "Conflict";
        return;
      }
      const author = await client.query(
        "SELECT * FROM authors WHERE author_id = $1",
        [body.author_id],
      );
      await client.query(
        "INSERT INTO books (isbn, title, published_date, author_id) VALUES ($1, $2, $3, $4)",
        [body.isbn, body.title, body.published_date, author.rows[0].id],
      );
    },
    {
      body: t.Object({
        isbn: t.String(),
        title: t.String(),
        published_date: t.String({ description: "ISO8601 Date" }),
        author_id: t.String({ description: "UUID of author" }),
      }),
    },
  )
  .onError((err) => {
    console.error(err);
  });

app.onStop(async () => {
  console.log("Stopping server, closing database connection");
  await client.end();
});

app.listen(6969);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}, go to http://${app.server?.hostname}:${app.server?.port}/swagger for swagger docs.`,
);
