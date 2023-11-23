import {
  Modal,
  ModalContent
} from '@nextui-org/react'
import NextUIProvider from '@/providers/NextUIProvider'

import QuoteForm from '../form/quoteForm'

function TransferModal(props: {isModalOpen: boolean}) {
  return (
    <Modal
    isOpen={props.isModalOpen} 
    placement="center"
    >
      <ModalContent>
        {/* Modal will escape NextUIProvider, so need to add it again*/}
        <NextUIProvider>
          <div className="nbp">
            <QuoteForm/>
          </div>
        </NextUIProvider>
      </ModalContent>
    </Modal>
  )
}

export default TransferModal