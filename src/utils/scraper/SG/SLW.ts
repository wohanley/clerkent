import Request from '../../Request'
import type Law from '../../../types/Law'
import Constants from '../../Constants' 

const DOMAIN = `https://www.singaporelawwatch.sg`

// eslint-disable-next-line no-secrets/no-secrets
const getSearchResults = (citation: string) => `${DOMAIN}/DesktopModules/EasyDNNNewsSearch/SearchAutoComplete.ashx?nsw=a&mid=479&TabId=21&portal_id=0&acat=1&ModToOpenResults=426&TabToOpenResults=48&evl=0&q=${citation}`

const getCase = async (citation: string): Promise<Law.Case | false> => {
  const { data } = await Request.get(getSearchResults(citation))

  const matches: Law.Case[] = data
    .map(([name, link]) => ({
      citation: name.slice(-citation.length),
      database: Constants.DATABASES.SG_slw,
      jurisdiction: Constants.JURISDICTIONS.SG.id,
      name: name.slice(0, -citation.length).trim(),
      pdf: link,
    }))
    .filter((match: Law.Case) => match.citation === citation)
  
  if(matches.length !== 1){
    return false
  }
  
  return matches[0]
}

const SLW = {
  getCase,
  getSearchResults,
}

export default SLW