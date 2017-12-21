const wdk = require('wikidata-sdk')
const breq = require('bluereq')
const errors = require('./errors')
const logger = require('./logger')
const findProperties = require('./find_properties')

module.exports = id => {
  if (wdk.isEntityId(id)) return id

  var [ properties, value ] = id.split(':')

  // It can't be a reverse claim, let ./get_redirect_url deal with it
  if (properties.length < 2 || value == null) return id
  // Let ./get_redirect_url handle sitelink alias ids
  if (wdk.isSitelinkKey(properties)) return id
  // including in Wikipedia short version
  if (wdk.isSitelinkKey(properties + 'wiki')) return id

  properties = findProperties(properties)

  logger.info(properties, 'properties found')

  // In both cases, there doesn't seem to be a clear associated property
  // Let's consider that the intent was to look for a sitelink title
  if (properties.length === 0) return id
  if (properties.length > 10) return id

  const url = wdk.getReverseClaims(properties, value, {
    caseInsensitive: true,
    keepProperties: true,
    limit: 1
  })

  return breq.get(url)
  .get('body')
  .then(wdk.simplifySparqlResults)
  .then(ids => {
    if (ids.length > 0) return ids[0]
    else throw errors.new('no id found', 400, { properties, value })
  })
}