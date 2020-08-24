const playBase = 'https://play.dhis2.org'
const debugBase = 'https://debug.dhis2.org'

const specific = (base, ver) => `${base}/${ver}`
const specificPlay = ver => specific(playBase, ver)
const specificDebug = ver => specific(debugBase, ver)

const playInstances = {
    '2.34.1': specificPlay('2.34.1'),
    '2.33.6': specificPlay('2.33.6'),
    '2.32.6': specificPlay('2.32.6'),
    '2.31.9': specificPlay('2.31.9'),
    '2.33.nightly': specificPlay('2.33.nightly'),
    '2.32.nightly': specificPlay('2.32.nightly'),
    '2.31.nightly': specificPlay('2.31.nightly'),
    dev: specificPlay('dev'),
    '2.34dev': specificPlay('2.34dev'),
    '2.33dev': specificPlay('2.33dev'),
    '2.32dev': specificPlay('2.32dev'),
    '2.31dev': specificPlay('2.31dev'),
}

const debugInstances = {
    '2.34dev': specificDebug('2.34dev'),
    '2.33dev': specificDebug('2.33dev'),
    '2.32dev': specificDebug('2.32dev'),
    '2.31dev': specificDebug('2.31dev'),
    dev: specificDebug('dev'),
}

const courseInstances = {
    course: 'https://course.dhis2.org/',
}

const instances = {
    play: playInstances,
    debug: debugInstances,
    course: courseInstances,
}

const generateInstancesError = () =>
    `The following servers are supported: ${Object.keys(instances).join(', ')}`

const generateInstanceError = (server, serverInstances) =>
    `The following instances are supported on ${server}: ${Object.keys(
        serverInstances
    ).join(', ')}`

const getInstanceUrl = (server, instance) => {
    const serverInstances = instances[server]
    if (!serverInstances) {
        throw generateInstancesError()
    }
    const serverInstance = serverInstances[instance]
    if (!serverInstance) {
        throw generateInstanceError(server, serverInstances)
    }
    return serverInstance
}

module.exports = {
    getInstanceUrl,
}
