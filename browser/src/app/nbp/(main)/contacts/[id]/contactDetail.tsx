'use client'
import type { Contact } from "@/types/contact"
import { useRouter } from 'next/navigation'
import { useState } from "react"
import {
  Button,
  Breadcrumbs, 
  BreadcrumbItem,
  Link,
  ChipProps,
  Chip,
  Modal,
  useDisclosure,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter
} from '@nextui-org/react'
import { ContactStatus, ContactType } from '@prisma/client'
import { useToastAlert } from "@/hook/useToastAlert"
import { CONSOLE_ALERT } from "@/utils/alertUtil"

const statusColorMap: Record<string, ChipProps["color"]>  = {
  [ContactStatus.ACTIVE]: "success",
  [ContactStatus.AWAIT_VERIFY]: "secondary",
  [ContactStatus.INVALID]: "danger",
  [ContactStatus.SUSPEND]: "warning"
}

const statusTextMap: Record<string, string>  = {
  [ContactStatus.ACTIVE]: ContactStatus.ACTIVE,
  [ContactStatus.AWAIT_VERIFY]: ContactStatus.AWAIT_VERIFY,
  [ContactStatus.INVALID]: ContactStatus.INVALID,
  [ContactStatus.SUSPEND]: ContactStatus.SUSPEND
}

const ConfirmModal = (
  {
    isOpen,
    onOpenChange,
    deleteContact
  }: {
    isOpen: boolean,
    onOpenChange: () => void,
    deleteContact: () => void,
  }
) => {
  return (
    <>
        <Modal placement="center" hideCloseButton isOpen={isOpen} onOpenChange={onOpenChange} isDismissable={false}>
        <ModalContent>
          {
            (onClose) => (
              <>
                <ModalHeader><p className="text-orange-400 font-bold">Warming</p></ModalHeader>
                <ModalBody>
                  <p className="font-semibold">Do you want to delete the contact?</p>
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="light" onPress={onClose}>
                    Cancel
                  </Button>
                  <Button className="font-bold bg-[#0E793C] text-[#ffffff]" onPress={() => {
                    onClose()
                    deleteContact()
                  }}>
                    YES
                  </Button>
                </ModalFooter>
              </>
            )
          }
        </ModalContent>
      </Modal>
    </>
  )
}

export function ContactDetail({contact}: {contact: Contact}) {
  const alert = useToastAlert() ?? CONSOLE_ALERT
  const router = useRouter()
  const [isDelete, setIsDelete] = useState<boolean>(false)
  const {isOpen, onOpen, onOpenChange} = useDisclosure({onChange(isOpen) {
    if (isOpen === false) setIsDelete(false)
  },})
  const deleteContact = async () => {
    setIsDelete(true)
    try {
      const response = await fetch(`/api/nbp/user/contacts/${contact.id}`, {
        method: 'DELETE',
      })
      const responsePayload = await response.json()
      console.log(responsePayload)
      if (responsePayload.code >> 7 === 1 ) {
        alert.info(responsePayload.message)
        router.replace(`/nbp/contacts`)
      } else {
        alert.error(responsePayload.message)
        setIsDelete(false)
      }
    } catch (err) {
      console.log(err)
      alert.error(JSON.stringify(err))
      setIsDelete(false)
    }
  }

  return (
    <div className="px-2 sm:px-2 py-2 sm:py-4 max-w-4xl mx-auto">
      {/* TODO: invesitgate why not show */}
      <Breadcrumbs className="mb-4" color="primary">
        <BreadcrumbItem href='/nbp/contacts'>Contacts</BreadcrumbItem>
        <BreadcrumbItem href='#'>{contact.id}</BreadcrumbItem>
      </Breadcrumbs>
      {/* <h4 className='mb-2'><Link href="/nbp/contacts">Contacts {' > .'} </Link></h4> */}
      <h1 className="font-semibold text-ellipsis  text-2xl sm:font-bold sm:text-3xl mb-6">
        {contact.firstName + '  ' + contact.lastName}
      </h1>
      <div className="mb-4">
        {/* Use link for deletion */}
        <Button variant="ghost" color="danger" onClick={onOpen} isLoading={isDelete}>DELETE</Button>
      </div>
      <div className="grid grid-cols-1 gap-2 p-2 sm:p-4 border border-slate-400 rounded-md">
        <div>
          <h6 className="font-semibold">First Name</h6>
          <p className="text-sm text-slate-600">{contact.firstName}</p>
        </div>
        {
          !!contact.middleName &&             
            <div>
              <h6 className="font-semibold">Middle Name</h6>
              <p className="text-sm text-slate-600">{contact.middleName}</p>
            </div>
        }
        <div>
          <h6 className="font-semibold">Last Name</h6>
          <p className="text-sm text-slate-600">{contact.lastName}</p>
        </div>
        <div>
          <h6 className="font-semibold">Status</h6>
          <Chip className="capitalize" color={statusColorMap[contact.status]} size="sm" variant="flat">
            {statusTextMap[contact.status]}
          </Chip>
        </div>
        <div>
          <h6 className="font-semibold">Relationship</h6>
          <p className="text-sm text-slate-600">{contact.relationship?.type}</p>
        </div>
        <div>
          <h6 className="font-semibold">Address</h6>
          <p className="text-sm text-slate-600">{formatAddress(contact)}</p>
        </div>
        <div>
          <h6 className="font-semibold">Phone Number</h6>
          <p className="text-sm text-slate-600">{contact.phoneNumber}</p>
        </div>
        {
          contact.type === ContactType.CASH_PICKUP ?
          <div>
            <h6 className="font-semibold">Transfer Method</h6>
            <p className="text-sm text-slate-600">Cash Pickup In National Bank of Paskitan</p>
          </div> :
          <>
            <div>
              <h6 className="font-semibold">Bank Name</h6>
              <p className="text-sm text-slate-600">{contact.institution!.name}</p>
            </div>
            {
              !!contact.bankAccountNum &&             
              <div>
                <h6 className="font-semibold">Account Number</h6>
                <p className="text-sm text-slate-600">{contact.bankAccountNum}</p>
              </div>
            }
            {
              !!contact.iban &&             
              <div>
                <h6 className="font-semibold">Account Number</h6>
                <p className="text-sm text-slate-600">{contact.iban}</p>
              </div>
            }
          </>
        }
      </div>
      <ConfirmModal isOpen={isOpen} onOpenChange={onOpenChange} deleteContact={deleteContact}/>
    </div>
  )
}

function formatAddress(contact: Contact): string {
  return `${contact.address1}${!contact.address2 ? '' : ', ' + contact.address2}${!contact.city ? '' : ', ' + contact.city}${!contact.province.name ? '' : ', ' + contact.province.name}${!contact.country.name ? '' : ', ' + contact.country.name}${!contact.postCode ? '' : ', ' + contact.postCode}`
}