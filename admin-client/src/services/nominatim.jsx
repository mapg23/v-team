/**
 * Service to return map objects based on a adress
 * @param {string} address as string
 * @returns json
 */

export default async function getCoordinates(address) {
    const urlEncodedAddress = encodeURIComponent(address);
    const url = "https://nominatim.openstreetmap.org/search.php?format=jsonv2&q=";
    const response = await fetch(`${url}${urlEncodedAddress}`);
    const result = await response.json();

    return result;
}