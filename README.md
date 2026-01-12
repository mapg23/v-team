# V-team 08 - Rull

![Rull](client/public/rull.png)



## Coverage

### API
[![API Coverage](https://raw.githubusercontent.com/mapg23/v-team/main/coverage-badges/api-badge/api-coverage.svg)](https://github.com/mapg23/v-team/blob/main/coverage-badges/api-badge/api-coverage.svg)

TODO: Lägg till flera mätvärden

### Bike
[![Bike Coverage](https://raw.githubusercontent.com/mapg23/v-team/main/coverage-badges/bike-badge/bike-coverage.svg)](https://github.com/mapg23/v-team/blob/main/coverage-badges/bike-badge/bike-coverage.svg)

TODO: Lägg till flera mätvärden

## Initialization ( docker compose )
### To Start the system, stand in root and execute the command below:
```
docker compose up -d --build
```
### To shut down the system, run the command below:
```
docker compose down -v
```
## Initialization ( local )
### To Start the system, stand in root and execute the command below:
```
nohup bash -c "cd bike && npm install && npm run start" >/dev/null 2>&1 &
nohup bash -c "cd api && npm install && npm run start" >/dev/null 2>&1 &
nohup bash -c "cd admin-client && npm install && npm run dev" >/dev/null 2>&1 &
```
### To shut down the system, run the command below:
```
pkill -f "npm run start|npm run dev"
```
