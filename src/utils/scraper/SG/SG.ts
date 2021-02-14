import SGSC from './SGSC'
import SLW from './SLW'
import Common from '../common'
import type Law from '../../../types/Law'

const getCase = async (citation: string): Promise<Law.Case | false> => {
  const options = [Common.CommonLII, SGSC, SLW]
  for (const option of options) {
    try {
      const result = await option.getCase(citation)
      if (result !== false) {
        return result
      }
    } catch (error) {
      console.error(error)
    }
  }
  return false
}

const SG = {
  SGSC,
  SLW,
  getCase,
}

export default SG