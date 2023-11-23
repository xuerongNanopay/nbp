import {
  Modal,
  ModalContent
} from '@nextui-org/react'
import NextUIProvider from '@/providers/NextUIProvider'

import { TransferQuoteSummaryCard } from '../card'

type Props = {
  isOpen: boolean
  quoteSummary?: ITransferQuoteResult | null
}

function ConfirmTransferModal({isOpen, quoteSummary}: Props) {
  return (
    <NextUIProvider>
      <Modal
      isOpen={isOpen} 
      placement="center"
      >
        <ModalContent>
          <TransferQuoteSummaryCard quoteSummary={quoteSummary}/>
        </ModalContent>
      </Modal>
    </NextUIProvider>
  )
}

export default ConfirmTransferModal