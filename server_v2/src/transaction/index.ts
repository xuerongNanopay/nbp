//entry point to start transaction process.
function processTransaction(transaction) {
  //TODO: find the transfer and process.
}

interface TransferProcessor<T> {
  process(transfer: T): void
}