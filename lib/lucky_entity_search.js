const breq = require('bluereq')
const wdk = require('wikidata-sdk')
const logger = require('./logger')
const errors = require('./errors')

module.exports = (text, lang) => {
  return breq.get(wdk.searchEntities({
    search: text,
    language: lang,
    limit: 1
  }))
  .get('body')
  .then(logger.Log('lucky search'))
  .then(res => {
    const entity = res.search[0]
    if (entity != null) return entity.id
    else throw errors.notFound({ text, lang })
  })
}
