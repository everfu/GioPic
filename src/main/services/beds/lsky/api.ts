import type { LskyOptions, LskyStrategiesResponse } from '@/types'
import logger from '@/main/utils/logger'
import { httpRequest } from '../../HTTPClient'

function getHeaders(token: string) {
  return {
    Authorization: `Bearer ${token}`,
  }
}

export async function getStrategies(options: LskyOptions) {
  const response = await httpRequest<LskyStrategiesResponse>({
    url: `${options.api}/api/v1/strategies`,
    method: 'GET',
    headers: getHeaders(options.token),
  })

  if (!response || !response.data) {
    logger.error('Failed to fetch strategies: No response data received')
    throw new Error('Failed to fetch strategies: No response data received')
  }
  return response.data
}
