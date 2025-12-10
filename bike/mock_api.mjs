"use strict"
import Device from "./Devices.mjs";

async function start() {
    let done = false;
    let heartbeat_timer = 5000;

    let cordinates = {
      cordinates: {
        0: [
          { x: 1, y: 1 },
          { x: 5, y: 5 },
          { x: 10, y: 10 },
          { x: 100, y: 120 },
        ],
        1: [],
        2: []
      },
    };
    let bikes = [
      { id: 1, location: {x: 0, y: 0}, battery: 100, status: 10, occupied: false },
      { id: 5, location: {x: 0, y: 0}, battery: 100, status: 10, occupied: false },
      { id: 234, location: {x: 0, y: 0}, battery: 100, status: 10, occupied: false },
      { id: 4, location: {x: 0, y: 0}, battery: 100, status: 10, occupied: false },
    ]

    const start = await fetch('http://localhost:7071/start', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ bikes: bikes })
    });
    let startJSON = await start.json();
    console.log(`[LOG]: ${startJSON.msg}`);

    const setRoutes = await fetch('http://localhost:7071/setRoute',{
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cordinates)
    });
    let routesJson = await setRoutes.json();

    console.log(`[LOG]: ${routesJson.event}`);

    let list = await fetch('http://localhost:7071/list');
    let listJSON = await list.json();
    // let listOBJ = JSON.parse(listJSON);
    console.log('======= Device LIST ========')
    console.log(listJSON);
    console.log('======= Device LIST ========')
    
    setInterval(async () => {
        let list = await fetch('http://localhost:7071/list');
        console.log('======= Device LIST ========')
        console.log(await list.json());
        console.log('======= Device LIST ========')
    }, heartbeat_timer)
}

async function startBikes(params) {
  
}

await start();