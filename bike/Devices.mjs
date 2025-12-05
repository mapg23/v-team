"use strict";

/**
 * Device Class, used to simulate a bike.
 */
class Device {
    constructor(id, cords, battery = 100, status = 10, occupied = false, speed = 0) {
        this.id = id;
        this.cords = cords;
        this.battery = battery;
        this.status = status;
        this.occupied = occupied;
        this.speed = speed;
    }

    moveToCordinates(cordinates, heartbeat=5) {
        let id = 0;
        let running = true;
        while(running){
            const heart = setInterval(() => {
                if (id > cordinates.length) {
                    running = false;
                }

                this.cords = cordinates[id];
                id++;

            }, heartbeat);

            clearInterval(heart);
        }
        
        return { event: 'Bike has reached its location' };
    }

    move(cords) {
        if (this.status > 50) {
            return { event: 'bike is unable to move, reason:', data: this.status};
        }

        this.cords = cords;
    }

}

export default Device;