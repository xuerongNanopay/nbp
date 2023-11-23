'use client'

import { useState, useEffect, useMemo, ChangeEvent } from "react"
import { useFormik } from "formik"
import * as Yup from 'yup';
import {
  Input,
  Button,
  Select, 
  SelectItem
} from "@nextui-org/react";

type prop  = {
  sourceAccount: IAccount[]
  destinationAccount: IAccount[]
}
// User have to select account first.
// Retrieve Currency from Account.
// TODO: isDefault
// TODO: getRoughRate
const sourceAccounts = [
  {
    id: '1',
    type: 'eTransfer',
    name: 'E-Transfer(xx@xxqqd.com)',
    currency: 'CAD'
  }
]

const destinationAccounts = [
  {
    id: '2',
    type: 'bankAccount',
    name: 'xxx(acount: ***)',
    currency: 'PKR'
  },
  {
    id: '3',
    type: 'cashPickup',
    name: 'yyy(cash)',
    currency: 'PKR'
  }
]

export default function TransferForm() {

  const [showAmountInput, setShowAmountInput] = useState(false)
  const [selectSourceAccout, setSelectSourceAccount ] = useState<IAccount|null>(null)
  const [selectDestinationAccount, setSelectDestinationAccount ] = useState<IAccount|null>(null)
  const [rate, setRate] = useState(0)

  const initialValues: ITransferQuote = {
    sourceAccountId: '',
    destinationAccountId: '',
    sourceAmount: 0,
    destinationAmount: 0
  }

  const transferQuoteHandler = (e: ITransferQuote) => {
    console.log(e)
  }

  const formik = useFormik({
    initialValues,
    validationSchema: Yup.object({
      sourceAccountId: Yup.string().trim().required('Required'),
      destinationAccountId: Yup.string().trim().required('Required'),
      sourceAmount: Yup.number().required('Required').moreThan(10).lessThan(1000),
      destinationAmount: Yup.number().required('Required').moreThan(0)
    }),
    onSubmit: transferQuoteHandler
  })

  useEffect(() => {
    if ( formik.touched.destinationAccountId && formik.touched.sourceAccountId ) {
      if ( !formik.errors.destinationAccountId && !formik.errors.sourceAccountId ) {
        setShowAmountInput(true)
      } else {
        setShowAmountInput(false)
      }
    }
  }, 
  [
    formik.touched.destinationAccountId, 
    formik.touched.sourceAccountId,
    formik.errors.destinationAccountId,
    formik.errors.sourceAccountId
  ])

  useEffect(() => {
    const sourceAccount = sourceAccounts.find((account) => account.id == formik.values.sourceAccountId)
    sourceAccount && setSelectSourceAccount(sourceAccount)
    const destinationAccount = destinationAccounts.find((account) => account.id == formik.values.destinationAccountId)
    destinationAccount && setSelectDestinationAccount(destinationAccount)
  }, [
    formik.values.destinationAccountId, 
    formik.values.sourceAccountId
  ])

  useEffect(() => {
    setRate(0)
    formik.setFieldValue('sourceAmount', 0)
    formik.setFieldValue('destinationAmount', 0)
    const controller = new AbortController();
    const signal = controller.signal;
    async function fetchRate(sourceCurrency: string, destinationCurrency: string) {

      fetch("https://jsonplaceholder.typicode.com/posts", { signal: signal })
      .then((res) => res.json())
      .then((res) => setRate(4.8))
      .catch((err) => {
        if (err.name === "AbortError") {
          console.log("successfully aborted");
        } else {
          console.log(err)
        }
      });
    }
    fetchRate("CAD", "PKR")
    return () => controller.abort()
  }, [formik, formik.values.destinationAccountId, formik.values.sourceAccountId])

  const setSourceAmount = (e: ChangeEvent<HTMLInputElement>) => {
    const sourceAmount = Math.round(Number(e.target.value) * 100) / 100
    const destinationAmount =  Math.round(sourceAmount * rate * 100) / 100
    formik.setFieldValue('sourceAmount', sourceAmount)
    formik.setFieldValue('destinationAmount', destinationAmount)
  }

  return (
    <div className="w-full max-w-xl">
      <h4 className="text-2xl font-bold mb-6 text-center">Transaction Details</h4>
      <p className="text-base mb-6 text-center">Enter the details for your transaction.</p>
      <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4">
        <Select
          id="sourceAccountId"
          name="sourceAccountId"
          label="From"
          variant="bordered"
          selectionMode="single"
          labelPlacement="outside"
          // defaultSelectedKeys={[]}
          selectedKeys={!formik.values.sourceAccountId ? [] : [formik.values.sourceAccountId]}
          placeholder="please select payment method"
          color="primary"
          size="md"
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          errorMessage={formik.touched.sourceAccountId && formik.errors.sourceAccountId}
        >
          {sourceAccounts.map((source) => (
            <SelectItem key={source.id} value={source.id}>
              {source.name}
            </SelectItem>
          ))}
        </Select>
        <Select
          id="destinationAccountId"
          name="destinationAccountId"
          label="Send to"
          variant="bordered"
          selectionMode="single"
          labelPlacement="outside"
          // defaultSelectedKeys={[]}
          selectedKeys={!formik.values.destinationAccountId ? [] : [formik.values.destinationAccountId]}
          placeholder="please select payment method"
          color="primary"
          size="md"
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          errorMessage={formik.touched.destinationAccountId && formik.errors.destinationAccountId}
        >
          {destinationAccounts.map((source) => (
            <SelectItem key={source.id} value={source.id}>
              {source.name}
            </SelectItem>
          ))}
        </Select>
        <Input
          id="sourceAmount"
          type="number"
          labelPlacement="outside"
          disableAnimation={true}
          variant="bordered"
          label="You Send"
          color="primary"
          size="md"
          placeholder="0.00"
          step=".01"
          min="0"
          startContent={
            <div className="pointer-events-none flex items-center">
              <span className="text-default-400 text-small">$</span>
            </div>
          }
          endContent={
            <div className="flex items-center">
              <p className="outline-none border-0 bg-transparent text-default-400 text-small">
                {
                  selectSourceAccout && selectSourceAccout.currency
                }
              </p>
            </div>
          }
          disabled={!showAmountInput}
          onBlur={formik.handleBlur}
          onChange={setSourceAmount}
          value={''+formik.values.sourceAmount}
          errorMessage={formik.touched.sourceAmount && formik.errors.sourceAmount}
        />
        <Input
          id="destinationAmount"
          type="number"
          labelPlacement="outside"
          disableAnimation={true}
          variant="bordered"
          label="Recipient Receives"
          color="primary"
          size="md"
          placeholder="0.00"
          disabled
          min="0"
          startContent={
            <div className="pointer-events-none flex items-center">
              <span className="text-default-400 text-small">$</span>
            </div>
          }
          endContent={
            <div className="flex items-center">
              <p className="outline-none border-0 bg-transparent text-default-400 text-small">
                {
                  selectDestinationAccount && selectDestinationAccount.currency
                }
              </p>
            </div>
          }
          {...formik.getFieldProps('destinationAmount')}
          errorMessage={formik.touched.destinationAmount && formik.errors.destinationAmount}
        />
        <Button 
          type="submit"
          color="primary"
          className="mt-6"
          size="md"
          isDisabled={!(formik.isValid && formik.dirty)}
        >
          Quote
        </Button>
      </form>
    </div>
  )
}
