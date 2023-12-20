'use client'

import { notFound } from 'next/navigation'

import {
  Button,
  Breadcrumbs, 
  BreadcrumbItem
} from '@nextui-org/react'
import { NBPContactDetail } from '@/type'


export default async function Contact({ params: {id} }: { params: { id: string } }) {
  const contactId = parseInt(id)
  if ( isNaN(contactId) ) notFound()

  const testContact: NBPContactDetail = {
    id: '111',
    firstName: 'MANSISI',
    lastName: 'WWWU',
    created: new Date('2023-11-11'),
    status: 'verified',
    type: 'bankAccount',
    accountSummary: 'aavvdd ff',
    relationshipToOwner: 'Friend',
    address: '11 Colonsay Road, Markham, PK-GB, PK, 11111',
    phoneNumber: '22233 112',
    bankName: 'SSSVVV BANK',
    accountNumberOrIban: 'IBAN VVDFERERFDDF'
  }

  const contact = testContact

  return (
    <div className="px-2 sm:px-2 py-2 sm:py-4 max-w-4xl mx-auto">
      <Breadcrumbs className="mb-4" color="primary">
        <BreadcrumbItem href='/nbp/contacts'>contacts</BreadcrumbItem>
        <BreadcrumbItem href='#'>{contact.id}</BreadcrumbItem>
      </Breadcrumbs>
      <h1 className="font-semibold text-ellipsis  text-2xl sm:font-bold sm:text-3xl mb-6">
        {contact.firstName + '    ' + contact.lastName}
      </h1>
      <div className="mb-4">
        <Button variant="ghost" color="danger">DELETE</Button>
      </div>
      <div className="grid grid-cols-1 gap-2 p-2 sm:p-4 border border-slate-400 rounded-md">
        <div>
          <h6 className="font-semibold">First Name</h6>
          <p className="text-sm text-slate-600">{contact.firstName}</p>
        </div>
        <div>
          <h6 className="font-semibold">Last Name</h6>
          <p className="text-sm text-slate-600">{contact.lastName}</p>
        </div>
        <div>
          <h6 className="font-semibold">Relationship to Contact</h6>
          <p className="text-sm text-slate-600">{contact.relationshipToOwner}</p>
        </div>
        <div>
          <h6 className="font-semibold">Contact Address</h6>
          <p className="text-sm text-slate-600">{contact.address}</p>
        </div>
        <div>
          <h6 className="font-semibold">Phone Number</h6>
          <p className="text-sm text-slate-600">{contact.phoneNumber}</p>
        </div>
        <div>
          <h6 className="font-semibold">Bank Name</h6>
          <p className="text-sm text-slate-600">{contact.bankName}</p>
        </div>
        <div>
          <h6 className="font-semibold">Account Number or IBAN</h6>
          <p className="text-sm text-slate-600">{contact.accountNumberOrIban}</p>
        </div>
      </div>
    </div>
  )
}