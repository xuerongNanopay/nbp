import type { 
  TransferReqeust, 
  TransferResult 
} from "@/partner/idm/index.d.js"

//TODO: Mock Service for development mode
export const IDMService = await _getRealService()

interface IDMService {
  transferout(request: TransferReqeust): Promise<TransferResult>
}

async function _getRealService(): Promise<IDMService> { 
  const idm =  await import('@/partner/idm/index.js')
  return {
    transferout: idm.transferout
  }
}