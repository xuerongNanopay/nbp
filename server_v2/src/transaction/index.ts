//entry point to start transaction process.

const NBPTransferProcessor: any[] = []

function processTransaction(transaction: any, processors: any) {
  const processor = 1
  //TODO: find the transfer and process.
}

interface TransferProcessor<T> {
  name: string
  process(transfer: T): void
}