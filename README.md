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

## Store into database (not used, since we manualy import export data)

```
docker compose run --rm backup
```

## Curl for cordinates on bikes

```

curl --header "Content-Type: application/json" \
  --request POST \
  --data '{
    "cordinates": {
      "10": [
        { "x": 0, "y": 0 },
        { "x": 100, "y": 120 }
      ],
      "11": [
        { "x": 10, "y": 20 },
        { "x": 15, "y": 23 }
      ]
    }
  }' \
  http://localhost:7071/move/


```
