import {
  Skeleton
} from '@nextui-org/react'

type Props = {
  quoteSummary?: ITransferQuoteResult | null
}

function TransferQuoteSummaryCard({quoteSummary}: Props) {
  return (
    <div className="w-full max-w-xl">
      <section className="flex flex-col gap-1">
        <Skeleton isLoaded={!!quoteSummary} className="rounded-lg">
          <div className="flex justify-between">
            <h6>Amount To Be Converted</h6>
            <p>${`${quoteSummary?.sourceAmount} ${quoteSummary?.sourceCurrency}`}</p>
          </div>
        </Skeleton>
        <Skeleton isLoaded={!!quoteSummary} className="rounded-lg">
          <div className="flex justify-between">
            <h6>Exchange Rate</h6>
            <p>{`$1.00 ${quoteSummary?.sourceCurrency} = $${quoteSummary?.exchangeRate.toFixed(2)} ${quoteSummary?.destinationCurrency}`}</p>
          </div>
        </Skeleton>
        <Skeleton isLoaded={!!quoteSummary} className="rounded-lg">
          <div className="flex justify-between">
            <h6>Recipient Receives</h6>
            <p>${`${quoteSummary?.destinationAmount} ${quoteSummary?.destinationCurrency}`}</p>
          </div>
        </Skeleton>
        <Skeleton isLoaded={!!quoteSummary} className="rounded-lg">
          <div className="flex justify-between">
            <h6>Transaction Fee</h6>
            <p>${`${quoteSummary?.transactionFee} ${quoteSummary?.sourceCurrency}`}</p>
          </div>
        </Skeleton>
        <Skeleton isLoaded={!!quoteSummary} className="rounded-lg">
          <div className="flex justify-between">
            <h6 className="text-primary">Amount To Be Debited</h6>
            <p className="text-primary">${`${quoteSummary?.totalDebitAmount} ${quoteSummary?.sourceCurrency}`}</p>
          </div>
        </Skeleton>
      </section>
    </div>
  )
}

export default TransferQuoteSummaryCard