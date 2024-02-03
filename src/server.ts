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
          author_id: t.Numeric(),
          name: t.String(),
          bio: t.String(),
        }),
        { description: "Get all authors" },
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
