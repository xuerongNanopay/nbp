import { TransferReqeust } from "@/partner/idm/index.d.js";
import { IDMService } from "./index.js";
import { TransferResult } from "@/partner/idm/index.d.js";

export const MOCKIDMService: IDMService = {
  transferout: async (request: TransferReqeust): Promise<TransferResult> {
    const isManualReview = Math.random() < 0.3;
    return {
      res: isManualReview ? 'MANUAL_REVIEW' : 'ACCEPT'
    }
  }
}