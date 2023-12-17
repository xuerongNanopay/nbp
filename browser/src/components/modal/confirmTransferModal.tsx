import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  useDisclosure,
  Button
} from '@nextui-org/react'
import NextUIProvider from '@/providers/NextUIProvider'

import { TransferQuoteSummaryCard } from '../card'
import { ITransferQuoteResult } from '@/type'

type Props = {
  isOpen: boolean
  closeModal: () => void
  quoteSummary?: ITransferQuoteResult | null
}

function ConfirmTransferModal({isOpen, closeModal, quoteSummary}: Props) {
  const submitTransfer = () => {
    alert('TODO: SubmitTransfer')
    //TODO: navigator to /transaction/id
    closeModal()
  }
  return (
    <NextUIProvider>
      <Modal
        isOpen={isOpen}
        onOpenChange={closeModal}
        placement="center"
        className="nbp"
        isDismissable={false}
      >
        <ModalContent>
          {
            (onClose) => {
              return (
                <>
                  <ModalHeader className="flex flex-col gap-1">Transfer Review</ModalHeader>
                  <ModalBody>
                    <TransferQuoteSummaryCard quoteSummary={quoteSummary}/>
                  </ModalBody>
                  <ModalFooter>
                    <Button color="primary" onPress={submitTransfer}>Confirm</Button>
                    <Button color="danger" variant="bordered" onPress={onClose}>Cancel</Button>
                  </ModalFooter>
                </>
              )
            }
          }
        </ModalContent>
      </Modal>
    </NextUIProvider>
  )
}

export default ConfirmTransferModal