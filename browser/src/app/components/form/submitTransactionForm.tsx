'use client'

type prop = {
  quoteId: ''
}

export default async function SubmitTransactionForm({ quoteId }: prop) {
  //TODO: using quoteId to fetch transaction detail.
  const transactionQuoteResult: ITransferQuoteResult = {
    id: '1',
    sourceAccount: {
      id: '',
      type: '',
      name: '',
      currency: ''
    },
    destinationAccout: {
      id: '',
      type: '',
      name: '',
      currency: ''
    },
    sourceAmount: 11.11,
    destinationAmount: 22.22,
    sourceCurrency: 'CAD',
    destinationCurrency: 'PKR',
    exchangeRate: 2.22,
    transactionFee: 3.4,
    totalDebitAmount: 44.44
  }
  return (
    <div>SubmitTransactionForm</div>
  )
}
