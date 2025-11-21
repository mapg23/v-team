"use strict"

async function start() {
    let done = false;
    let heartbeat_timer = 1000;

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

    const start = await fetch('http://localhost:7071/start');
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
        let res = await fetch('http://localhost:7071/heartbeat');
        console.log(await res.json());

        let list = await fetch('http://localhost:7071/list');
        console.log('======= Device LIST ========')
        console.log(await list.json());
        console.log('======= Device LIST ========')
    }, heartbeat_timer)
}

await start();