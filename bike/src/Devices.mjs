"use strict";

/**
 * Device Class, used to simulate a bike.
 *
 * Supports:
 *  - Legacy positional arguments
 *  - Object-based constructor (preferred)
 */
class Device {
    constructor(
        idOrOptions,
        cords,
        battery = 100,
        status = 10,
        occupied = false,
        speed = 0,
        city_id = null,
        current_zone_type = null,
        current_zone_id = null,
    ) {
    // Object-style constructor (preferred)
        if (typeof idOrOptions === "object" && idOrOptions !== null) {
            const {
                id,
                cords,
                battery = 100,
                status = 10,
                occupied = false,
                speed = 0,
                city_id = null,
                current_zone_type = null,
                current_zone_id = null,
            } = idOrOptions;

            this.id = id;
            this.cords = cords;
            this.battery = battery;
            this.status = status;
            this.occupied = occupied;
            this.speed = speed;
            this.city_id = city_id;
            this.current_zone_type = current_zone_type;
            this.current_zone_id = current_zone_id;

            // Positional constructor (legacy)
        } else {
            this.id = idOrOptions;
            this.cords = cords;
            this.battery = battery;
            this.status = status;
            this.occupied = occupied;
            this.speed = speed;
            this.city_id = city_id;
            this.current_zone_type = current_zone_type;
            this.current_zone_id = current_zone_id;
        }
    }

    /**
   * Getter for id.
   * @returns {Number}
   */
    getId() {
        return this.id;
    }

    // no method to set id, not mutable.

    /**
   * Getter for city id.
   * @returns {Number}
   */
    getCityId() {
        return this.city_id;
    }

    /**
   * Setter for city_id.
   * @param {Number} city_id
   */
    setCityId(city_id) {
        this.city_id = city_id;
    }

    /**
   * Getter for status
   * @returns {Number}
   */
    getStatus() {
        return this.status;
    }

    /**
   * Setter for id.
   * @param {Number} status
   */
    setStatus(status) {
        this.status = status;
    }

    /**
   * Method to move bike.
   * @param {Array}} cords
   * @returns  {Array}
   */
    move(cords) {
        if (this.status > 50) {
            return { event: "bike is unable to move", data: this.status };
        }
        this.cords = cords;
    }


    /**
   * Method to self diagnose bike.
   */
    selfDiagnose() {
        if (this.battery <= 20) {
            this.setStatus(50); // low battery
        }
    }
}

export default Device;
