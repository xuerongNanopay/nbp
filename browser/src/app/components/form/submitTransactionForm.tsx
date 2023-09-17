'use client'

import { FormEvent, useEffect, useState } from "react";

import {
  Button
} from "@nextui-org/react";

type prop = {
  quoteId: string
}

export default function SubmitTransactionForm({ quoteId }: prop) {
  //TODO: using quoteId to fetch transaction detail.

  const [transactionQuoteResult, setTransactionQuoteResult] = useState<ITransferQuoteResult|null>(null)
  const [isSubmitting, setIsSubmitting ] = useState(false)

  useEffect(() => {
    async function fetchQuoteResult(quoteId: string) {
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
        totalDebitAmount: 44.44,
        expireTimestamp: new Date().getTime()
      }
      setTransactionQuoteResult(transactionQuoteResult)
    }
    fetchQuoteResult(quoteId)
  }, [])
  const handleTransactionTraction = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    console.log(quoteId)
  }
  return (
    <div className="w-full max-w-xl">
      <h4 className="text-2xl font-bold mb-6 text-center">Confirm Transaction</h4>
      <p></p>
      <form 
        onSubmit={handleTransactionTraction}
        className="flex flex-col gap-4"
      >
        {
          transactionQuoteResult &&
          <section className="flex flex-col">
            <div className="flex justify-between">
              <h6>Amount To Be Converted</h6>
              <p>${`${transactionQuoteResult.sourceAmount} ${transactionQuoteResult.sourceCurrency}`}</p>
            </div>
            <div className="flex justify-between">
              <h6>Exchange Rate</h6>
              <p>{`$1.00 ${transactionQuoteResult.sourceCurrency} = $${transactionQuoteResult.exchangeRate.toFixed(2)} ${transactionQuoteResult?.destinationCurrency}`}</p>
            </div>
            <div className="flex justify-between">
              <h6>Recipient Receives</h6>
              <p>${`${transactionQuoteResult.destinationAmount} ${transactionQuoteResult.destinationCurrency}`}</p>
            </div>
            <div className="flex justify-between">
              <h6>Transaction Fee</h6>
              <p>${`${transactionQuoteResult.transactionFee} ${transactionQuoteResult.sourceCurrency}`}</p>
            </div>
            <div className="flex justify-between">
              <h6>Amount To Be Debited</h6>
              <p>${`${transactionQuoteResult.totalDebitAmount} ${transactionQuoteResult.sourceCurrency}`}</p>
            </div>
          </section>
        }
        <Button 
          type="submit"
          color="primary"
          className="mt-6"
          size="md"
          isLoading={!transactionQuoteResult || isSubmitting}
        >
          Submit Trasaction
        </Button>
      </form>
    </div>
  )
}
