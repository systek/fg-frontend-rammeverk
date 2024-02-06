# fg-frontend-rammeverk

## Jeg workshopper og vil ha database og API

Nice!

```bash
docker compose up
```

## Jeg vil gjøre endringer i API-et

Enda nicere!

Du må ha [bun.sh](https://bun.sh/) installert.

1. Start postgressen:
    ```bash
    docker compose up db
    ```
2. Kjør bun-serveren (i watch-modus):
    ```bash
    bun install && bun run --watch src/server.ts
    ```
3. Gjør endringer i `src/server.ts` :-)
