export const storageService = {
    post,   // Create
    // get,    // Read
    // put,    // Update
    remove, // Delete
    query,  // List 
    saveToStorage,
    loadFromStorage,
    makeId
}

function saveToStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value))
}

function loadFromStorage(key) {
    const data = localStorage.getItem(key)
    return (data) ? JSON.parse(data) : undefined
}

function query(entityType, delay = 500) {
    var entities = JSON.parse(localStorage.getItem(entityType)) || []
    return new Promise(resolve => setTimeout(() => resolve(entities), delay))
}

// function get(entityType, entityId) {
//     return query(entityType).then(entities => {
//         const entity = entities.find(entity => entity.id === entityId)
//         if (!entity) throw new Error(`Get failed, cannot find entity with id: ${entityId} in: ${entityType}`)
//         return entity
//     })
// }

function post(entityType, newEntity) {
    newEntity = JSON.parse(JSON.stringify(newEntity))
    if (!newEntity.id) newEntity.id = makeId() //check
    return query(entityType).then(entities => {
        entities.push(newEntity)
        _save(entityType, entities)
        return newEntity
    })
}

// function put(entityType, updatedEntity) {
//     updatedEntity = JSON.parse(JSON.stringify(updatedEntity))
//     return query(entityType).then(entities => {
//         const idx = entities.findIndex(entity => entity.id === updatedEntity.id)
//         if (idx < 0) throw new Error(`Update failed, cannot find entity with id: ${entityId} in: ${entityType}`)
//         entities.splice(idx, 1, updatedEntity)
//         _save(entityType, entities)
//         return updatedEntity
//     })
// }

function remove(entityType, entityId) {
    return query(entityType).then(entities => {
        const idx = entities.findIndex(entity => entity.id === entityId)
        if (idx < 0) throw new Error(`Remove failed, cannot find entity with id: ${entityId} in: ${entityType}`)
        entities.splice(idx, 1)
        _save(entityType, entities)
    })
}

function makeId(length = 5) {
    var txt = ''
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    for (var i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length))
    }
    return txt
}

function _save(entityType, entities) {
    localStorage.setItem(entityType, JSON.stringify(entities))
}