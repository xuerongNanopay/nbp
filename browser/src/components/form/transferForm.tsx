'use client'

import { useState, useEffect, useMemo, ChangeEvent, FormEvent } from "react"
import { useFormik } from "formik"
import * as Yup from 'yup'
import {
  Input,
  Button,
  Select, 
  SelectItem
} from "@nextui-org/react"

import { ConfirmTransferModal } from '@/components/modal'
import { ITransferQuote, ITransferQuoteResult } from "@/type"
import { TransactionQuoteDate } from "@/types/transaction"
import { TransactionQuoteValidator } from "@/schema/validator"
import { GetAccount, GetAccounts } from "@/types/account"
import { GetContact } from "@/types/contact"
import { HttpGET } from "@/types/http"


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
  exchangeRate: 111133.2233,
  transactionFee: 3.4,
  totalDebitAmount: 44.44,
  expireTimestamp: new Date().getTime()
}

type Props  = {
  sourceAccountId?: string | null
  destinationContactId?: string | null
}

export default function TransferFrom({sourceAccountId, destinationContactId}: Props) {
  const [disableAmountInput, setDisableAmountInput] = useState(true)
  const [sourceCurrency, setSourceCurrency ] = useState<string|null>(null)
  const [destinationCurrency, setDestinationCurrency ] = useState<string|null>(null)
  const [sourceAccounts, setSourceAccounts] = useState<GetAccount[]>([])
  const [destinationContacts, setDestinationContacts] = useState<GetContact[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSubmit, setIsSubmit] = useState(false)
  const [rate, setRate] = useState(0)

  const closeModal = () => {
    setIsModalOpen(false)
    setIsSubmit(false)
  }

  const initialValues: Partial<TransactionQuoteDate> = {
    sourceAccountId: 0,
    destinationContactId: 0,
    sourceAmount: 0
  }

  const quoteTransaction = (e: Partial<TransactionQuoteDate>) => {
    console.log(e)
    setIsSubmit(true)
    //TODO: making button loading
    //
    setIsModalOpen(true)
  }

  const formik = useFormik<Partial<TransactionQuoteDate>>({
    initialValues,
    validationSchema: TransactionQuoteValidator,
    onSubmit: quoteTransaction
  })

  useEffect(() => {

  })

  useEffect(() => {
    if ( formik.touched.destinationContactId && formik.touched.sourceAccountId ) {
      if ( !formik.errors.destinationContactId && !formik.errors.sourceAccountId ) {
        setDisableAmountInput(false)
      } else {
        setDisableAmountInput(true)
      }
    }
  }, 
  [
    formik.touched.destinationContactId, 
    formik.touched.sourceAccountId,
    formik.errors.destinationContactId,
    formik.errors.sourceAccountId
  ])

  useEffect(() => {
    const controller = new AbortController()
    const fetchAccounts = async () => {
      const response = await fetch('/api/nbp/user/accounts')
      const resposnePayload = await response.json() as HttpGET<GetAccounts>
      
    }
    const fetchContacts = async () => {

    }

    fetchAccounts()
    fetchContacts()
    return () => controller.abort()
  })

  //Fetch Rate.
  useEffect(() => {
    console.log('aaa', formik.values.destinationContactId)
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
  }, [formik.values.destinationContactId, formik.values.sourceAccountId])

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
      {/* <ConfirmTransferModal isOpen={isModalOpen} closeModal={closeModal} quoteSummary={quoteSummary}/> */}
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
          id="destinationContactId"
          name="destinationContactId"
          label="Send to"
          variant="bordered"
          selectionMode="single"
          labelPlacement="outside"
          // defaultSelectedKeys={[]}
          selectedKeys={!formik.values.destinationContactId ? [] : [formik.values.destinationContactId]}
          placeholder="please select payment method"
          color="primary"
          size="md"
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          errorMessage={formik.touched.destinationContactId && formik.errors.destinationContactId}
        >
          {destinationContacts.map((contact) => (
            <SelectItem key={contact.id} value={contact.id}>
              {}
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
                  sourceCurrency ?? sourceCurrency
                }
              </p>
            </div>
          }
          isDisabled={disableAmountInput}
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
                  destinationCurrency && destinationCurrency
                }
              </p>
            </div>
          }
          {...formik.getFieldProps('destinationAmount')}
          // errorMessage={formik.touched.destinationAmount && formik.errors.destinationAmount}
        />
        <Button 
          type="submit"
          color="primary"
          className="mt-6"
          size="md"
          isLoading={isSubmit}
          isDisabled={!(formik.isValid && formik.dirty)}
        >
          Quote
        </Button>
      </form>
    </div>
  )
}
