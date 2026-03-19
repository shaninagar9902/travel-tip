export const mapService = {
    initMap,
    addMarker,
    panTo,
    getLastClickedLoc,
    searchLocation
}

// Var that is used throughout this Module (not global)
var gMap
var gInfoWindow
var gLastClickedLocation = null

function initMap(lat = -34.4697, lng = -58.5317) {
    // console.log('InitMap')
    return _connectGoogleApi()
        .then(() => {
            // console.log('google available')
            gMap = new google.maps.Map(document.querySelector('#map'), {
                center: { lat, lng },
                zoom: 15,
                mapId: 'DEMO_MAP_ID'
            })
            gInfoWindow = new google.maps.InfoWindow({
                position: { lat, lng }
            })
            gMap.addListener('click', (mapsMouseEvent) => {
                //From google to JS (latLng.toJSON())
                const latLng = mapsMouseEvent.latLng.toJSON()
                gLastClickedLocation = latLng
                gInfoWindow.close()
                gInfoWindow.setPosition(mapsMouseEvent.latLng)
                gInfoWindow.setContent(
                    `<p>Selected Location</p><br/>
                    Lat: ${latLng.lat.toFixed(6)}<br/>
                    Lng: ${latLng.lng.toFixed(6)}`)
                gInfoWindow.open(gMap)
                // addMarker(latLng)
            })
        })
}

function getLastClickedLoc() {
    return gLastClickedLocation
}

function addMarker(loc) {
    var marker = new google.maps.marker.AdvancedMarkerElement({ //Changed on 2024
        position: loc,
        map: gMap,
        title: 'Hello World!'
    })
    return marker
}

function panTo(lat, lng) {
    var laLatLng = new google.maps.LatLng(lat, lng)
    gMap.panTo(laLatLng)
}

function _connectGoogleApi() {
    if (window.google) return Promise.resolve()
    const API_KEY = 'AIzaSyC9eFGt1HqGJDWeLM2rPB7OAJAqglJBoDQ' //DONE Enter your API Key
    var elGoogleApi = document.createElement('script')
    elGoogleApi.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&libraries=marker`
    elGoogleApi.async = true
    document.body.append(elGoogleApi)

    return new Promise((resolve, reject) => {
        elGoogleApi.onload = resolve
        elGoogleApi.onerror = () => reject('Google script failed to load')
    })
}

function searchLocation(address) {
    const API_KEY = 'AIzaSyC9eFGt1HqGJDWeLM2rPB7OAJAqglJBoDQ'
    return fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${API_KEY}`)
        .then(res => res.json())
        .then(data => {
            if (data.status === 'OK') {
                return data.results[0].geometry.location
            } else {
                console.error('Location not found')
                return null
            }
        })
}

//      https://maps.googleapis.com/maps/api/geocode/json?address=YAVNE&key=AIzaSyC9eFGt1HqGJDWeLM2rPB7OAJAqglJBoDQ