"use strict";

async function start() {
  let heartbeatTimer = 5000;

  let cordinates = {
    cordinates: {
      1: [
        { x: 57.863800, y: 14.128300 },
        { x: 57.863800, y: 14.128400 },
        { x: 57.863800, y: 14.128500 },
        { x: 57.863800, y: 14.128600 },
        { x: 57.863800, y: 14.128700 },
      ],
      2: [
        { x: 57.863900, y: 14.128300 },
        { x: 57.864000, y: 14.128300 },
        { x: 57.864100, y: 14.128300 },
        { x: 57.864200, y: 14.128300 },
        { x: 57.864300, y: 14.127100 },

      ],
      3: [
        { x: 57.864000, y: 14.128600 },
        { x: 57.864200, y: 14.128900 },
        { x: 57.864400, y: 14.123200 },
        { x: 57.864600, y: 14.128500 },
        { x: 57.915000, y: 14.059800 },
      ]
    },
  };

  const start = await fetch('http://localhost:7071/start', {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ bikes: bikes })
  });
  let startJSON = await start.json();

  console.log(`[LOG]: ${startJSON.msg}`);

  const setRoutes = await fetch('http://localhost:7071/setRoute', {
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
  let cordinates = {
    cordinates: {
      1: [
        { x: 57.863800, y: 14.128300 },
        { x: 57.863800, y: 14.128310 },
        { x: 57.863800, y: 14.128320 },
        { x: 57.863800, y: 14.128330 },
        { x: 57.863800, y: 14.128340 },
      ],
      2: [
        { x: 57.862900, y: 14.127100 },
        { x: 57.863500, y: 14.129200 },
        { x: 57.862900, y: 14.127100 },
        { x: 57.863500, y: 14.129200 },
        { x: 57.862900, y: 14.127100 },
      ],
    },
  };


  const setRoutes = await fetch('http://localhost:7071/setRoute', {
    method: 'POST',
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(cordinates)
  });
  let routesJson = await setRoutes.json();

  console.log(`[LOG]: ${routesJson.event}`);
}

await startBikes();
