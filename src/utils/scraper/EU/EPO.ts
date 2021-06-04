import Request from '../../Request'
import type Law from '../../../types/Law'
import Constants from '../../Constants'

const DOMAIN = `https://www.epo.org`

const zeroPad = (number: string, length = 4) => (
  number.length < length ? zeroPad(`0${number}`, length) : number
)

const getCaseByCitation = async (citation: string): Promise<Law.Case[]> => {
  const [prepend, number] = [citation.slice(0,1), citation.slice(1)].map(a => a.replace(/_/g, ``).trim())
  const [caseNumber, year] = number.split(`/`)
  const append = `${zeroPad(caseNumber)}/${year}`
  const { data } = await Request.post(
    `${DOMAIN}/search/api/v2/search`, 
    {
      count:100,
      "exclude_available_properties_and_facets":true,
      "max_page_count":1000,
      "order_direction":`DESCENDING`,
      "orderby":`mes:relevance`,
      "properties":[
          {formats:[`HTML`],name:`title`},
          {formats:[ `HTML` ],name:`content`},
          {formats:[`VALUE`],name:`url`},
          {formats:[`HTML`],name:`dg3TLE`},
          {formats:[`VALUE`, `HTML`],name:`dg3APN`},
          {formats:[`HTML`],name:`dg3DecisionBoard`},
          {formats:[`HTML`],name:`dg3DecisionOnlineGSA`},
          {formats:[`HTML`],name:`dg3DecisionDateGSA`},
          {formats:[`VALUE`,`HTML`],name:`dg3KEY`},
          {formats:[`VALUE`,`HTML`],name:`dg3ECLI`},
          {formats:[`VALUE`,`HTML`],name:`dg3DecisionPDF`},
          {formats:[`VALUE`,`HTML`],name:`dg3DecisionDistributionKey`},
          {formats:[`HTML`],name:`dg3CaseIPC`},
          {formats:[`HTML`],name:`dg3DecisionPRL`},
      ],
      user:{
          constraints:[
              {
                "filter_base":[
                    {
                      "description":`BoA`,
                      "id":`BoA`,
                      "label":`collection`,
                      "regex":`^\\QBoA\\E$`,
                      "value":{
                          "str":`BoA`,
                      },
                    },
                ],
                "filtered_name":`collection`,
                "id":`filter_collection`,
                "label":`collection`,
              },
              {
                "filter_base":[
                  {
                    "and":[
                      {
                          "description":prepend,
                          "id": prepend,
                          "label":`dg3CSNCase`,
                          "regex":`\\Q${prepend}\\E`,
                          "value":{
                              "str": prepend,
                          },
                      },
                      {
                          "description": append,
                          "id":append,
                          "label":`dg3CSNCase`,
                          "regex":`\\Q${append}\\E`,
                          "value":{
                              "str": append,
                          },
                      },
                    ],
                  },
                ],
                "filtered_name":`dg3CSNCase`,
                "id":`filter_dg3CSNCase`,
                "label":`dg3CSNCase`,
              },
          ],
          query:{
              id:`query`,
              unparsed:`ALL`,
          },
      },
      
    },
    {
      headers: {
          'Origin': DOMAIN,
          'Referer': `${DOMAIN}/law-practice/case-law-appeals/advanced-search.html`,
          'X-Requested-With': `XMLHttpRequest`,
        },
    },
  )

  const {
    resultset: {
      results,
    },
  } = data

  const result = results[0]
  const title = result.properties.find(({ id }) => id === `title`).data[0].html
  const url = result.properties.find(({ id }) => id === `url`).data[0].value.str
  
  
  return [{
    citation,
    database: Constants.DATABASES.EU_epo,
    jurisdiction: Constants.JURISDICTIONS.EU.id,
    links: [
      {
        doctype: `Summary`,
        filetype: `HTML`,
        url,
      },
    ],
    name: title,
  }]

}

const CURIA = {
  getCaseByCitation,
}

export default CURIA