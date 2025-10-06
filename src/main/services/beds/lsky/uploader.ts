import type { LskyUploadParams, LskyUploadResponse, UploaderResponse } from '@/types'
import fs from 'node:fs'
import FormData from 'form-data'
import logger from '@/main/utils/logger'
import { httpRequest } from '../../HTTPClient'

export async function upload(options: LskyUploadParams): Promise<UploaderResponse> {
  const { api, token, path, ...data } = options

  // 验证必要参数
  if (!api || !token || !path) {
    logger.error('[upload] Missing required parameters: api, token, or path')
    throw new Error('缺少必要参数：API地址、Token或文件路径')
  }

  // 检查文件是否存在
  if (!fs.existsSync(path)) {
    logger.error(`[upload] File not found: ${path}`)
    throw new Error(`文件不存在: ${path}`)
  }

  const formData = new FormData()

  try {
    const fileStream = fs.createReadStream(path)
    formData.append('file', fileStream)
    if (data.strategy_id !== undefined)
      formData.append('strategy_id', data.strategy_id.toString())
    if (data.album_id !== undefined)
      formData.append('album_id', data.album_id.toString())
    if (data.permission !== undefined)
      formData.append('permission', data.permission.toString())
    if (data.expired_at)
      formData.append('expired_at', data.expired_at)

    logger.info(`[upload] Starting upload to ${api}/api/v1/upload`)
    const response = await httpRequest<LskyUploadResponse>({
      url: `${api}/api/v1/upload`,
      method: 'POST',
      headers: {
        ...formData.getHeaders(),
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
      data: formData,
    })

    if (!response || !response.data) {
      logger.error('[upload] Upload failed: No response data received')
      throw new Error('上传失败：未收到响应数据')
    }

    const uploadData = response.data
    logger.info(`[upload] Upload successful: ${uploadData.name}`)
    return {
      key: uploadData.key,
      name: uploadData.name,
      size: uploadData.size,
      mimetype: uploadData.mimetype,
      url: uploadData.links.url,
      origin_name: uploadData.origin_name,
    }
  }
  catch (error) {
    logger.error(`[upload] Upload failed: ${error}`)
    throw error
  }
}
