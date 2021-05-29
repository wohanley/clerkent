import Request from '../../Request'
import cheerio from 'cheerio'
import type { LegislationFinderResult } from '../../Finder'
import type Law from '../../../types/Law'
import Logger from '../../Logger'
import Constants from '../../Constants'

const DOMAIN = `https://www.legislation.gov.uk`

interface StatuteResult {
  name: string,
  link: string
}

const getStatute = async (statuteName: string): Promise<StatuteResult[]> => {
  const { data } = await Request.get(`${DOMAIN}/primary+secondary`, {
    params: { title: statuteName },
  })
  const $ = cheerio.load(data)
  const results = $(`#content tbody > tr`).map((_, row) => {
    const element = $(`td:first-of-type > a`, row)
    const name = element.text().trim()
    const link = `${DOMAIN}${element.attr(`href`)}`
    return {
      link,
      name,
    }
  }).get()

  if(results.length === 0){
    return []
  }
  return results
}

const getLegislation = async (legislation: LegislationFinderResult): Promise<Law.Legislation[]> => {
  const {
    provisionType,
    provisionNumber,
    statute,
  } = legislation

  let statuteResult = {} as StatuteResult

  try {
    const result = await getStatute(statute)
    if(result.length === 0){
      return []
    }
    const { link, name  } = result[0]
    statuteResult = { link, name }
  } catch (error){
    Logger.error(error)
    return []
  }

  if(!provisionNumber){
    return [{
      ...legislation,
      jurisdiction: Constants.JURISDICTIONS.UK.id,
      link: statuteResult.link,
      statute: statuteResult.name,
    }]
  }

  const provisionLink = [
    ...statuteResult.link.split(`/`).slice(0, -1),
    provisionType.toLowerCase(), provisionNumber,
  ].join(`/`)

  try {
    const { data, request } = await Request.get(provisionLink)

     const $ = cheerio.load(data)
     const legisContent = $(`#viewLegSnippet`).html()

    return [{
      ...legislation,
      content: legisContent,
      jurisdiction: Constants.JURISDICTIONS.UK.id,
      link: request.responseURL,
      statute: statuteResult.name,
    }]
  } catch (error) {
    Logger.error(error)
    return []
  }
}

const LegislationGovUk = {
  getLegislation,
}

export default LegislationGovUk