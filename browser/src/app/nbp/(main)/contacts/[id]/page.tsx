import { notFound, redirect } from 'next/navigation'

import {
  Button,
  Breadcrumbs, 
  BreadcrumbItem,
  Link
} from '@nextui-org/react'
import { getContactDetailByOwnerId } from '@/lib/contact'
import { fetchSession } from '@/lib/session'
import { UniqueContact } from '@/types/contact'
import { ContactStatus, ContactType } from '@prisma/client'

export default async function Contact({ params: {id} }: { params: { id: string } }) {
  const contactId = parseInt(id)
  if ( isNaN(contactId) ) notFound()

  const session = await fetchSession()
  const contact = await getContactDetailByOwnerId(contactId, session!)
  if ( contact === null ) redirect('/nbp/contacts')

  return (
    <div className="px-2 sm:px-2 py-2 sm:py-4 max-w-4xl mx-auto">
      {/* TODO: invesitgate why not show */}
      {/* <Breadcrumbs className="mt-4" color="danger">
        <BreadcrumbItem href='/nbp/contacts' as={Link} className="text-red-800">Contacts</BreadcrumbItem>
        <BreadcrumbItem href='#'>{contact.id}</BreadcrumbItem>
      </Breadcrumbs> */}
      <h4 className='mb-2'><Link href="/nbp/contacts">Contacts {' > .'} </Link></h4>
      <h1 className="font-semibold text-ellipsis  text-2xl sm:font-bold sm:text-3xl mb-6">
        {contact.firstName + '  ' + contact.lastName}
      </h1>
      <div className="mb-4">
        {/* Use link for deletion */}
        <Button variant="ghost" color="danger" as={Link} href={`/nbp/contacts/${id}/delete`}>DELETE</Button>
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
    </div>
  )
}

function formatAddress(contact: UniqueContact): string {
  return `${contact.address1}${!contact.address2 ? '' : ', ' + contact.address2}${!contact.city ? '' : ', ' + contact.city}${!contact.province.name ? '' : ', ' + contact.province.name}${!contact.country.name ? '' : ', ' + contact.country.name}${!contact.postCode ? '' : ', ' + contact.postCode}`
}