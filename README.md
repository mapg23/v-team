# v-team

## Fresh start project

1. Go into /api and do npm install
2. inside /database create folders called /data /logs /init

## Start docker and all its containers

```
docker compose up -d --build

// Start only one service
docker compose up -d <service_name>
```

## Rebuild all containers

```
docker compose up -d --force-recreate
```
