import { locService } from './services/loc.service.js'
import { mapService } from './services/map.service.js'

window.onload = onInit
window.onAddMarker = onAddMarker
window.onPanTo = onPanTo
window.onGetLocs = onGetLocs
window.onGetUserPos = onGetUserPos
window.onDeleteLoc = onDeleteLoc
window.onMyLoc = onMyLoc
window.onCopyLink = onCopyLink

function onInit() {
    mapService.initMap()
        .then(() => {
            console.log('Map is ready')
            onGetLocs()
            checkPrm()
        })
        .catch(() => console.log('Error: cannot init map'))
}

// This function provides a Promise API to the callback-based-api of getCurrentPosition
function getPosition() {
    console.log('Getting Pos')
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
    })
}

function onAddMarker() {
    console.log('Adding a marker')
    const loc = mapService.getLastClickedLoc()
    if (!loc) return alert('Click on the map first!')
    mapService.addMarker(loc)

}

function onGetLocs() {
    locService.getLocs()
        .then(locs => {
            const elTableBody = document.querySelector('.loc-list')
            const tableHTML = locs.map(loc => `<tr>
                <td>${loc.name}</td>
                <td>${loc.lat}</td>
            <td>${loc.lng}</td>
            <td>
            <button class="go-btn" onclick="onPanTo(${loc.lat},${loc.lng})">Go</button>
            <button class="go-delete" onclick="onDeleteLoc('${loc.id}')">Remove</button>
            </td>
            </tr>`).join('')
            console.log('Locations:', locs)
            elTableBody.innerHTML = tableHTML
        })
        .catch(err => console.error(`Couldn't get locations`, err))
}

function onGetUserPos() {
    getPosition()
        .then(pos => {
            console.log('User position is:', pos.coords)
            document.querySelector('.user-pos').innerText =
                `Latitude: ${pos.coords.latitude} - Longitude: ${pos.coords.longitude}`
        })
        .catch(err => {
            console.log('Error!', err)
        })
}

function onPanTo(lat, lng) {
    console.log('Panning the map')
    if (lat && lng) {
        mapService.panTo(lat, lng)
        return
    }
    const location = document.querySelector('.search').value
    if (!location) return

    mapService.searchLocation(location)
        .then(loc => {
            if (!loc) return
            mapService.panTo(loc.lat, loc.lng)
            mapService.addMarker(loc)
            return locService.savedLoc(location, loc.lat, loc.lng)
        })
        .then(() => onGetLocs())
        .catch(err => console.error('Error!', err))
}

function onDeleteLoc(locId) {
    if (!confirm('Are you sure?')) return
    locService.removeLoc(locId)
        .then(() => {
            onGetLocs()
        })
        .catch(err => console.error('Error!', err))
}

function onMyLoc() {
    getPosition()
        .then(pos => {
            mapService.panTo(pos.coords.latitude, pos.coords.longitude)
        })
        .catch(err => console.error('Error!', err))
}

function onCopyLink() {
    const loc = mapService.getLastClickedLoc()
    if (!loc) return alert('Click on the map first!')

    const url = `${location.origin}${location.pathname}?lat=${loc.lat}&lng=${loc.lng}`
    console.log(url)
    navigator.clipboard.writeText(url) //MDN
        .then(() => alert('Link copied!'))
        // .catch(err => console.error('Error!', err))
        .catch(() => prompt('Copy this!', url))
}

// https://github.io/me/travelTip/index.html?lat=3.14&lng=1.63 

function checkPrm() {
    const url = new URLSearchParams(window.location.search)
    const lat = url.get('lat')
    const lng = url.get('lng')
    // console.log(url, lat, lng);
    if (!lat || !lng) return
    const parseLat = parseFloat(lat)
    const parseLng = parseFloat(lng)
    mapService.panTo(parseLat, parseLng)
    mapService.addMarker({ lat: parseLat, lng: parseLng })
}