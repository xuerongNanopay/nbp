import { notFound, redirect } from 'next/navigation'

import { getContactDetailByOwnerId } from '@/lib/contact'
import { fetchSession } from '@/lib/session'
import { ContactDetail } from './contactDetail'

export default async function Contact({ params: {id} }: { params: { id: string } }) {
  const contactId = parseInt(id)
  if ( isNaN(contactId) ) notFound()

  const session = await fetchSession()
  const contact = await getContactDetailByOwnerId(contactId, session!)
  if ( contact === null ) redirect('/nbp/contacts')

  return (
    <ContactDetail contact={contact}/>
  )
}