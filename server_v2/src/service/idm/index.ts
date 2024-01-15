import type { 
  TransferReqeust, 
  TransferResult 
} from "@/partner/idm/index.d.js"
import { MOCKIDMService } from "./mock.js"

//TODO: Mock Service for development mode
// export const IDMService = await _getRealService()
export const IDMService = MOCKIDMService

export interface IDMService {
  transferout(request: TransferReqeust): Promise<TransferResult>
}

async function _getRealService(): Promise<IDMService> { 
  const idm =  await import('@/partner/idm/index.js')
  return {
    transferout: idm.transferout
  }
}