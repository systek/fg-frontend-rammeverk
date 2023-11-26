import { Elysia, t } from "elysia";
import { client, initDb } from "./db.ts";
import swagger from "@elysiajs/swagger";

await initDb();

const app = new Elysia().use(swagger()).get(
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
);

app.onStop(async () => {
  console.log("Stopping server, closing database connection");
  await client.end();
});

app.listen(6969);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
