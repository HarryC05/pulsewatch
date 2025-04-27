# PulseWatch

PulseWatch is a self-hosted SaaS platform for uptime monitoring.

## Structure
- **/client** — React frontend
- **/server** — Express backend (API + worker)

## Local Development Setup

1. Create `.env` files for both the client and server, following the examples in each directory.

2. Start the Postgres database:

```bash
docker-compose up -d
```

3. Start the server instance:

```bash
cd server
npm install
npm run dev
```

4. Start the heartbeat worker:

```bash
node server/monitorWorker.js
```

5. Start the frontend instance:
```bash
cd client
npm install
npm run dev
```

6. Access the frontend:
> Open your browser and go to http://localhost:5173

## Database Access

The Postgres database runs inside Docker and is exposed on port `5432`.

You can connect to it using any Postgres client (e.g., Postico, TablePlus, DBeaver) with the following settings:

- **Host**: `localhost`
- **Port**: `5432`
- **Database**: `pulsewatch`
- **Username**: `pulsewatch`
- **Password**: `pulsewatchpass`

Example connection string:

```bash
postgresql://pulsewatch:pulsewatchpass@localhost:5432/pulsewatch
```

## License
This project is licensed under the [MIT License](LICENSE)
