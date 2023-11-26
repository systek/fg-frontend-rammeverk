import { Elysia } from "elysia";
import { client, initDb } from "./db.ts";
import swagger from "@elysiajs/swagger";

const app = new Elysia()
  .use(swagger())
  .get("/", () => "Hello Elysia")
  .get("authors", async () => {
    const result = await client.query("SELECT * FROM authors");

    return result.rows.map((it) => it);
  })
  .listen(6969);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);

await initDb();
