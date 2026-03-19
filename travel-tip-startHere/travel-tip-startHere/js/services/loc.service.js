import { storageService } from "./storage.service.js";

const { makeId } = storageService
const STORAGE_KEY = 'storageDB'

export const locService = {
    getLocs,
    savedLoc,
    removeLoc
}

function getLocs() {
    return storageService.query(STORAGE_KEY)
        .then(locs => {
            if (!locs || locs.length === 0) {
                locs = [
                    { name: 'Greatplace', lat: 32.064915, lng: 34.762933, id: makeId() },
                    { name: 'Neveragain', lat: 32.047201, lng: 34.832581, id: makeId() }
                ]
                localStorage.setItem(STORAGE_KEY, JSON.stringify(locs))
            }
            return locs
        })
    //     return new Promise((resolve, reject) => {
    //         setTimeout(() => {
    //             resolve(locs)
    //         }, 2000)
    //     })
}

function savedLoc(placeName, lat, lng) {
    const newLoc = {
        id: makeId(),
        name: placeName,
        lat: lat,
        lng: lng,
        // weather,
        createdAt: Date.now(),
        updatedAt: Date.now()
    }
    return storageService.post(STORAGE_KEY, newLoc)
}

function removeLoc(locId) {
    return storageService.remove(STORAGE_KEY, locId)
}