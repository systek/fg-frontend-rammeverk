import { Client } from "pg";
import * as path from "path";
import { cwd } from "node:process";

const host = Bun.env.DOCKER_COMPOSE ? "db" : "localhost";

console.info(`Database host is: ${host}`);

export const client = new Client({
  host: host,
  port: 5432,
  database: "postgres",
  user: "postgres",
  password: "postgres",
});

export async function initDb() {
  console.info("Running migrations if needed");

  await client.connect();

  const authorsExistQuery = await client.query(`
        SELECT EXISTS (SELECT
                       FROM information_schema.tables
                       WHERE table_schema = 'public'
                         AND table_name = 'authors');
    `);

  if (!authorsExistQuery.rows[0].exists) {
    console.info("Schema doesn't exist, running initial schema.sql");

    try {
      await client.query("BEGIN");
      await client.query(
        await Bun.file(path.join(cwd(), "db", "schema.sql")).text(),
      );
      await client.query(
        await Bun.file(path.join(cwd(), "db", "seed.sql")).text(),
      );
      await client.query("COMMIT");

      console.info("Created schema and seeded database");
    } catch (e) {
      console.error(new Error("Unable to run migrations", { cause: e }));
      await client.query("ROLLBACK");
    }
  } else {
    console.info("Schema exists, skipping migrations");
  }
}
