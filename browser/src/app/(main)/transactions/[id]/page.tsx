
import { notFound } from 'next/navigation'

import {
  Button,
  Link,
  Breadcrumbs,
  BreadcrumbItem
} from '@nextui-org/react'

export default async function Transaction({ params: {id} }: { params: { id: string } }) {
  const transactionId = parseInt(id)
  if ( isNaN(transactionId) ) notFound()

  //TODO: fetch transaction detail from DB.

  const testTransactionDetail: NBPTransactionDetail = {
    id: '11',
    sendName: 'Xuerong Wu',
    receiveName: 'VVV TTT',
    created: new Date('2012-1-1'),
    status: 'awaitPayment',
    nbpReference: 'NBP00000000',
    sendAmount: '44.22 CAD',
    receiveAmount: '4,520.34 PKR',
    fee: '$0.00 CAD',
    fxRate: '$1.00 CAD : 205.47 PKR',
    receiveAccountSummary: 'NBP(AACCCDDWW)',
    sendAccountSummary: 'Interact(xxx@gg.com)',
    summary: '$22.00 → 4,520.34 | Xuerong Wu → TTT EEEddddd',
    etransferUrl: 'https://www.google.com'
  }

  const transactionDetail = testTransactionDetail
  return (
    <div className="px-2 sm:px-2 py-2 sm:py-4 max-w-4xl mx-auto">
      {/* TODO: investigation why not show */}
      <Breadcrumbs className="mb-4">
        <BreadcrumbItem href='/transactions'>transactions</BreadcrumbItem>
        <BreadcrumbItem href='#'>{transactionDetail.id}</BreadcrumbItem>
      </Breadcrumbs>
      <h1 className="font-semibold text-ellipsis sm:font-bold sm:text-3xl mb-4">
        {transactionDetail.summary}
      </h1>
      {/* Interact */}
      <div className="flex">
        <div className="flex-none w-1 bg-yellow-600 rounded-s-medium"></div>
        <div className="flex-auto bg-yellow-200 py-2 px-2 md:px-4 rounded-e-medium">
          <h4 className="font-semibold mb-1 sm:mb-2">Attention:</h4>
          <p className="text-sm mb-1 sm:mb-2">This transaction is on hold while we wait to receive your Interac e-Transfer. Please click the button below to complete the transaction. If you have recently completed the interac request, please wait for the transaction to be updated.</p>
          <Button 
            href={transactionDetail.etransferUrl}
            as={Link}
            color="primary"
            target="_blank"
          >
            Complete Transacton
          </Button>
        </div>
      </div>
      {/* Genera Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 p-2 mt-2 sm:mt-4 border border-slate-200 rounded-md">
        <div>
          <h5 className="font-semibold">Created</h5>
          <p className="text-sm text-slate-600">{transactionDetail.created.toISOString()}</p>
        </div>
        <div>
          <h5 className="font-semibold">Reference #</h5>
          <p className="text-sm text-slate-600">{transactionDetail.nbpReference}</p>
        </div>
        <div>
          <h5 className="font-semibold">Status</h5>
          <p className="text-sm text-slate-600">{transactionDetail.status}</p>
        </div>
      </div>
      {/* Sender Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 p-2 mt-2 sm:mt-4 border border-slate-200 rounded-md">
        <div>
          <h5 className="font-semibold">From</h5>
          <p className="text-sm text-slate-600">{transactionDetail.sendName}</p>
        </div>
        <div>
          <h5 className="font-semibold">Source Account</h5>
          <p className="text-sm text-slate-600">{transactionDetail.sendAccountSummary}</p>
        </div>
      </div>
      {/* Receiver Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 p-2 mt-2 sm:mt-4 border border-slate-200 rounded-md">
        <div>
          <h5 className="font-semibold">To</h5>
          <p className="text-sm text-slate-600">{transactionDetail.receiveName}</p>
        </div>
        <div>
          <h5 className="font-semibold">Destination Account</h5>
          <p className="text-sm text-slate-600">{transactionDetail.receiveAccountSummary}</p>
        </div>
      </div>
      {/* Cost Info */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-2 p-2 mt-2 sm:mt-4 border border-slate-200 rounded-md">
        <div>
          <h5 className="font-semibold">Source Amount</h5>
          <p className="text-sm text-slate-600">{transactionDetail.sendAmount}</p>
        </div>
        <div>
          <h5 className="font-semibold">FX Rate</h5>
          <p className="text-sm text-slate-600">{transactionDetail.fxRate}</p>
        </div>
        <div>
          <h5 className="font-semibold">Fee</h5>
          <p className="text-sm text-slate-600">{transactionDetail.fee}</p>
        </div>
        <div>
          <h5 className="font-semibold">Destination Amount</h5>
          <p className="text-sm text-slate-600">{transactionDetail.receiveAmount}</p>
        </div>
      </div>
    </div>
  )
}