import {
  Skeleton
} from '@nextui-org/react'

type Props = {
  quoteSummary?: ITransferQuoteResult | null
}

function TransferQuoteSummaryCard({quoteSummary}: Props) {
  return (
    <div className="w-full">
      <section className="flex flex-col gap-1">
        <Skeleton isLoaded={!!quoteSummary} className="rounded-lg">
          <div className="sm:flex sm:justify-between">
            <h6>Amount To Be Converted:</h6>
            <p className="max-sm:text-right">${`${quoteSummary?.sourceAmount} ${quoteSummary?.sourceCurrency}`}</p>
          </div>
        </Skeleton>
        <Skeleton isLoaded={!!quoteSummary} className="rounded-lg">
          <div className="sm:flex sm:justify-between">
            <h6>Exchange Rate:</h6>
            <p className="max-sm:text-right">{`$1.00 ${quoteSummary?.sourceCurrency} = $${quoteSummary?.exchangeRate.toFixed(2)} ${quoteSummary?.destinationCurrency}`}</p>
          </div>
        </Skeleton>
        <Skeleton isLoaded={!!quoteSummary} className="rounded-lg">
          <div className="sm:flex sm:justify-between">
            <h6>Recipient Receives:</h6>
            <p className="max-sm:text-right">${`${quoteSummary?.destinationAmount} ${quoteSummary?.destinationCurrency}`}</p>
          </div>
        </Skeleton>
        <Skeleton isLoaded={!!quoteSummary} className="rounded-lg">
          <div className="sm:flex sm:justify-between">
            <h6>Transaction Fee:</h6>
            <p className="max-sm:text-right">${`${quoteSummary?.transactionFee} ${quoteSummary?.sourceCurrency}`}</p>
          </div>
        </Skeleton>
        <Skeleton isLoaded={!!quoteSummary} className="rounded-lg">
          <div className="sm:flex sm:justify-between">
            <h6 className="text-primary">Amount To Be Debited:</h6>
            <p className="text-primary max-sm:text-right">${`${quoteSummary?.totalDebitAmount} ${quoteSummary?.sourceCurrency}`}</p>
          </div>
        </Skeleton>
      </section>
    </div>
  )
}

export default TransferQuoteSummaryCard