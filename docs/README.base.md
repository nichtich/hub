# wikidata-hub

A small webservice to handle redirections from a Wikidata id to Wikimedia sites and beyond

**Target audience**:
- Wikidata-centered tools developers
- URL wizards

**A few examples to catch your interest**

we can now link to Wikipedia articles about a concept in the user's favorite language:
- from a Wikidata id: `/Q3`
- from an article title from the English Wikipedia: `/Lyon`
- or another Wikipedia: `/zh:阿根廷`
- or any Wikimedia project: `/frwikivoyage:Allemagne`
- or any external id known by Wikidata: `/twitter:doctorow`

but, after choosing your starting point, you can also customize your destination:
- here we go from one Wikipedia to the other: `/en:Economy?lang=de`
- here from Wikidata to Wikiquote: `/Q184226?site=wikiquote`

for your next prototype, illustrate your concepts the lazy way:

<!-- Using local images as Github messes with the raw URLs -->
|  image                                           | src                                                  |
|:-------------------------------------------------|:-----------------------------------------------------|
| ![avatar example](assets/images/esa.jpeg)        | `/Q42262?p=avatar&w=128`                             |
| ![image example](assets/images/laniakea.jpg)     | `/frwiki:Laniakea?p=image&w=256`                     |

## Summary

<!-- START doctoc -->
<!-- END doctoc -->

## User Guide

## Redirections from a Wikidata id

### default

Redirect to the default site, `wikipedia`, with the user language guessed from the request `accept-language` header, falling back to English if the language header can't be found or the Wikipedia page doesn't exist in this language.

|  request                                    | redirection                                          |
|:--------------------------------------------|:-----------------------------------------------------|
| `/Q184226`                                  | https://en.wikipedia.org/wiki/Gilles_Deleuze         |

### lang

Pass a `lang` parameter to override the `accept-language` header. Pass several values to set the fallback chain.

|  request                                    | redirection                                          |
|:--------------------------------------------|:-----------------------------------------------------|
| `/Q184226?lang=fr`                          | https://fr.wikipedia.org/wiki/Gilles_Deleuze         |
| `/Q184226?lang=als,oc,fr,en&site=wikiquote` | https://oc.wikipedia.org/wiki/Gilles_Deleuze         |

### site

Pass a `site` parameter to redirect to another site than `wikipedia`. Pass several values to set the fallback chain. When combined with a `lang` fallback chain, the site fallback has priority.

|  request                                                           | redirection                                          |
|:-------------------------------------------------------------------|:-----------------------------------------------------|
| `/Q184226?site=wikiquote`                                          | https://en.wikiquote.org/wiki/Gilles_Deleuze         |
| `/Q184226?site=wikivoyage`                                         | https://en.wikipedia.org/wiki/Gilles_Deleuze         |
| `/Q184226?site=wikivoyage,wikiquote`                               | https://en.wikiquote.org/wiki/Gilles_Deleuze         |
| `/Q184226?site=wikiquote&lang=fr`                                  | https://fr.wikiquote.org/wiki/Gilles_Deleuze         |
| `/Q184226?site=wikivoyage,wikiquote,wikipedia&lang=als,oc,fr,en`   | https://fr.wikiquote.org/wiki/Gilles_Deleuze         |

### property

Pass a `property` parameter to generate the redirection URL from the entity claims associated to the desired property. The following examples illustrate the different behaviors depending on the property type:

|  **request**                                      | **redirection**                                                                                   |
|---------------------------------------------------|---------------------------------------------------------------------------------------------------|
|                                                   |                                                                                                   |
| **Url**                                           |                                                                                                   |
| `/Q21980377?property=P856`                        | https://sci-hub.tw                                                                                |
| `/Q1103345?property=P953`                         | http://www.cluetrain.com/#manifesto                                                               |
| `/Q756100?property=P1324`                         | https://github.com/nodejs/node                                                                    |
| `/Q132790?property=P4238,P856`                    | http://www.biarritz.fr/webcam_2.html                                                              |
|                                                   |                                                                                                   |
| **ExternalId**                                    |                                                                                                   |
| `/Q34981?property=P1938`                          | https://www.gutenberg.org/ebooks/author/35316                                                     |
| `/Q624023?property=P2002,P2003`                   | https://twitter.com/EFF                                                                           |
|                                                   |                                                                                                   |
| **WikibaseItem**                                  |                                                                                                   |
| `/Q155?property=P38`                              | https://en.wikipedia.org/wiki/Brazilian_real                                                      |
|                                                   |                                                                                                   |
| **CommonsMedia**                                  |                                                                                                   |
| `/Q241?property=P242`                             | https://commons.wikimedia.org/wiki/Special:FilePath/Cuba_(orthographic_projection).svg            |
| `/Q241?property=P242&width=1000`                  | https://commons.wikimedia.org/wiki/Special:FilePath/Cuba_(orthographic_projection).svg?width=1000 |
|                                                   |                                                                                                   |
| **GlobeCoordinate**                               |                                                                                                   |
| `/Q25373?property=P625`                           | https://www.openstreetmap.org/?mlat=35.2542&mlon=-24.2585                                         |
|                                                   |                                                                                                   |

Not supported: `String`, `Time`, `Monolingualtext`, `Quantity`, `WikibaseProperty`, `Math`

#### properties bundles
Instead of a list of properties, you can use special bundle keys, that behave like a list of properties.
The `image` and `avatar` bundles are designed to be a cheap way to give an image to an entity:
```html
<img src="/Q624023?property=image,avatar&width=256" />
```

|  **request**                                     | **redirection**                                                                                   |
|--------------------------------------------------|---------------------------------------------------------------------------------------------------|
| `/Q624023?property=image`                        | https://commons.wikimedia.org/wiki/Special:FilePath/EFF_Logo.svg                                  |
| `/Q624023?property=avatar`                       | https://avatars.io/twitter/EFF/                                                                   |
| `/Q624023?property=social`                       | https://twitter.com/EFF                                                                           |
| `/Q604319?property=social`                       | https://tools.wmflabs.org/wikidata-externalid-url/?p=4033&id=LaQuadrature@mamot.fr                |
| `/Q624023?property=image,avatar&width=120`       | https://commons.wikimedia.org/wiki/Special:FilePath/EFF_Logo.svg?width=120                        |
| `/Q604319?property=avatar,image&width=256`       | https://avatars.io/twitter/laquadrature/large                                                     |

### aliases

Alternatively to a Wikidata id, you can pass a key built from sitelinks as starting point, defaulting to `enwiki`.

|  request                                         | redirection                                                                             |
|:-------------------------------------------------|:----------------------------------------------------------------------------------------|
| `/frwikivoyage:Allemagne`                        | https://en.wikipedia.org/wiki/Germany                                                   |
| `/eswikinews:Categoría:Alemania`                 | https://en.wikipedia.org/wiki/Germany                                                   |
| `/ocwiki:Alemanha?lang=de`                       | https://de.wikipedia.org/wiki/Deutschland                                               |
| `/ocwiki:Alemanha?lang=el,fa&site=wikivoyage`    | https://el.wikivoyage.org/wiki/%CE%93%CE%B5%CF%81%CE%BC%CE%B1%CE%BD%CE%AF%CE%B1         |
| `/enwiki:Edward_Snowden?property=P2002`          | https://twitter.com/Snowden                                                             |
| `/enwiki:DIY?site=wikidata`                      | https://www.wikidata.org/wiki/Q26384                                                    |
| `/DIY?site=wikidata`                             | https://www.wikidata.org/wiki/Q26384                                                    |

### lazy parameters

| long            | short            |
|-----------------|:-----------------|
|                 |                  |
| **parameters**  |                  |
| `site`          | `s`              |
| `lang`          | `l`              |
| `property`      | `p`              |
| `width`         | `w`              |
|                 |                  |
| **projects**    |                  |
| `wikidata `     | `wd`             |
| `wikipedia`     | `wp`             |
| `commons`       | `c`              |
| `wikisource`    | `ws`             |
| `wikiquote`     | `wq`             |
| `wiktionary`    | `wt`             |
| `wikivoyage`    | `wv`             |
| `wikiversity`   | `wy`             |
| `wikinews`      | `wn`             |


|  **request**                                    | **redirection**                                                                                   |
|-------------------------------------------------|---------------------------------------------------------------------------------------------------|
| `/Q184226?s=wq,wp,wd&l=fr,en,de`                | https://fr.wikiquote.org/wiki/Gilles_Deleuze                                                      |
| `/Q241?p=P242&w=1000`                           | https://commons.wikimedia.org/wiki/Special:FilePath/Cuba_(orthographic_projection).svg?width=1000 |

## Developer Guide

This project is hosted on Wikimedia Toolforge: https://toolsadmin.wikimedia.org/tools/id/hub

### Dependencies
* [NodeJS](https://nodejs.org) `>v6.4.0` (recommanded way to install: [NVM](https://github.com/creationix/nvm))

### Install
```sh
git clone github.com/maxlath/wikidata-hub
cd wikidata-hub
npm install
# Starts the server on port 2580 and watch for files changes to restart
npm run watch
```

### Deploy
see [deploy doc](https://github.com/maxlath/wikidata-hub/blob/master/docs/deploy.md)