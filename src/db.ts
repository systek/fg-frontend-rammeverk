import { Client } from 'pg'
import * as path from 'path'
import { cwd } from 'node:process'

const host = Bun.env.DOCKER_COMPOSE ? 'db' : 'localhost'

let _client: Client | null = null

export function getClient(): Client {
  if (_client == null) {
    throw new Error('Database not initialized')
  }

  return _client
}

export async function initDb() {
  console.info('Connecting to database')
  const client = await connectWithRetry()

  console.info('Running migrations if needed')
  const authorsExistQuery = await client.query(`
        SELECT EXISTS (SELECT
                       FROM information_schema.tables
                       WHERE table_schema = 'public'
                         AND table_name = 'authors');
    `)

  if (!authorsExistQuery.rows[0].exists) {
    console.info("Schema doesn't exist, running initial schema.sql")

    try {
      await client.query('BEGIN')
      await client.query(await Bun.file(path.join(cwd(), 'db', 'schema.sql')).text())
      await client.query(await Bun.file(path.join(cwd(), 'db', 'seed.sql')).text())
      await client.query('COMMIT')

      console.info('Created schema and seeded database')
    } catch (e) {
      console.error(new Error('Unable to run migrations', { cause: e }))
      await client.query('ROLLBACK')
    }
  } else {
    console.info('Schema exists, skipping migrations')
  }
}

function createClient() {
  console.info(`DB host is ${host}`)

  return new Client({
    host: host,
    port: 5432,
    database: 'postgres',
    user: 'postgres',
    password: 'postgres',
  })
}

async function connectWithRetry() {
  let retry = 0
  while (true) {
    try {
      const freshClient = createClient()
      await freshClient.connect()

      console.info('Connected to successfully to database')

      _client = freshClient

      return _client
    } catch (e) {
      retry++

      if (retry > 3) throw e
      console.error(`Unable to connect to database, retrying in 10 second (${retry}/3)`)
      await new Promise((resolve) => setTimeout(resolve, 5000))
    }
  }
}
