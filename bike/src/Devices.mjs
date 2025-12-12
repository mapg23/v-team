"use strict";

/**
 * Device Class, used to simulate a bike.
 *
 * =====================================================================
 * When changing bike class dont mess with order of constructor params.
 * That will mess the tests up!!!!
 * =====================================================================
 */
class Device {
    constructor(
        id,
        cords,
        battery = 100,
        status = 10,
        occupied = false,
        speed = 0,
        city_id = null,
    ) {
        this.id = id;
        this.cords = cords;
        this.battery = battery;
        this.status = status;
        this.occupied = occupied;
        this.speed = speed; // unused for now
        this.city_id = city_id;
    }

    /**
   * Method that changes bike position
   * @param {Array} cords - X and Y cord to change to
   * @returns Void
   */
    move(cords) {
        if (this.status > 50) {
            return { event: "bike is unable to move, reason:", data: this.status };
        }

        this.cords = cords;
    }

    /**
   * Method to change status.
   * @param {Number} status - Number that represents a state
   */
    setStatus(status) {
        this.status = status;
    }

    /**
   * Method that will change status depending on health of bike
   * TODO: ADD MORE CONSTRAINS TO STATUS
   */
    selfDiagnose() {
        if (this.battery <= 20) {
            this.setStatus(50); // low battery
        }
    }
}

export default Device;
