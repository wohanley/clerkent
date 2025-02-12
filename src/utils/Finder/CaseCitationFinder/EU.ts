import Constants from '../../Constants'

export const epoRegex = new RegExp(/\b[GJT][ _]?\d{1,4}\/\d{1,2}/)
export const cjeuRegex = new RegExp(/\b[CT]-\d{1,3}\/\d{1,2}/)
// TODO: parse ECLI

export const sortEUCases = (
  citationsArray: Law.Case[],
  attribute: string,
): Law.Case[] => citationsArray

export const findEUCaseCitation = (
  query: string,
): Finder.CaseCitationFinderResult[] => {
  const regex = new RegExp(`(${epoRegex.source})|(${cjeuRegex.source})`, `gi`)
  const cleanedQuery = query
    .replace(new RegExp(`[${String.fromCharCode(8209)}]`, `g`), `-`)
    .replace(/case /gi, `C-`)

  const matches = [...cleanedQuery.matchAll(regex)]

  return matches.map((match) => ({
    citation: match[0],
    court: match[1] ? Constants.COURTS.EU_epo.id : Constants.COURTS.EU_cjeu.id,
    index: match.index,
    jurisdiction: Constants.JURISDICTIONS.EU.id,
  })).map(c => ({ ...c, type: `case-citation` }))
}