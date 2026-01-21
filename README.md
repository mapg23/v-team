# V-team 08 - Rull

![Rull](client/public/rull.png)

## Documentation

- API Documentation: https://github.com/mapg23/v-team/wiki/API

## Coverage

### API

[![API Coverage](https://raw.githubusercontent.com/mapg23/v-team/main/coverage-badges/api-badge/api-coverage.svg)](https://github.com/mapg23/v-team/blob/main/coverage-badges/api-badge/api-coverage.svg)

### Bike

[![Bike Coverage](https://raw.githubusercontent.com/mapg23/v-team/main/coverage-badges/bike-badge/bike-coverage.svg)](https://github.com/mapg23/v-team/blob/main/coverage-badges/bike-badge/bike-coverage.svg)

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


### Usage of simulation
In order to fully simulate the system, both user and bike simulations is required

#### User Simulation
( Use phpmyamdin to insert the dml files)
1. Navigate to http://url:8081
2. Once in phpmyadmin select the database and press insert.
3. Use the tree different sql files located in the project root:
```
vteam.sql, vteam.dml, simulate.dml
```
3. Import the files in the order shown above
4. User simulation is done

#### Bike simulation
( requires node version >= 18 )

1. navigate to /simulate
2. execute the command below:
```
    npm install && node Main.js
```
3. Await the simulation so it properly populate the database
4. Optional: if you want to watch while it populate, use the ** docker compose logs -f api ** command to watch.
5. Once the database has been populated the bikes has began the simulation
