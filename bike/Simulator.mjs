class Simulator {
    bikes = [];

    
    start() {
        console.log("Simulation started");
        // send confirmation to parent
        process.send({ event: "started" });
    }

    end() {
        console.log("Simulation terminated");
        process.send({ event: "terminated" });
    }

    move(coordinates) {
        console.log(`MOOOVINT: ${coordinates}`);
        console.log("Moving to:", coordinates);
        process.send({ event: "moved", coordinates });
    }
}

// Create one persistent instance
const simm = new Simulator();

// Listen for messages from parent
process.on("message", (msg) => {

    if (msg.cmd === "start-job") {
        simm.start();
    }

    if (msg.cmd === "terminate-job") {
        simm.end();
    }

    if (msg.cmd === "move-bike") {
        simm.move(msg.payload.cords);
    }
});
