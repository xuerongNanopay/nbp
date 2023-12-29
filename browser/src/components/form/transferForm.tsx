'use client'

import { useState, useEffect, useMemo, ChangeEvent, FormEvent } from "react"
import { useFormik } from "formik"
import * as Yup from 'yup'
import {
  Input,
  Button,
  Select, 
  SelectItem,
  SelectedItems
} from "@nextui-org/react"

import { ConfirmTransferModal } from '@/components/modal'
import { ITransferQuote, ITransferQuoteResult } from "@/type"
import { TransactionQuoteDate } from "@/types/transaction"
import { TransactionQuoteValidator } from "@/schema/validator"
import { GetAccount, GetAccounts } from "@/types/account"
import { GetContact, GetContacts } from "@/types/contact"
import { HttpGET } from "@/types/http"
import { AccountType, ContactType } from "@prisma/client"
import { blurEmail } from "@/utils/textUtil"


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
  const [destinationAmount, setDestinationAmount] = useState<number>(0.0)
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
    sourceAmount: 0,
    
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
      const response = await fetch('/api/nbp/user/accounts', { signal: controller.signal })
      const resposnePayload = await response.json() as HttpGET<GetAccounts>
      setSourceAccounts(resposnePayload.payload.many)
    }
    const fetchContacts = async () => {
      const response = await fetch('/api/nbp/user/contacts', { signal: controller.signal })
      const responsePayload = await response.json() as HttpGET<GetContacts>
      setDestinationContacts(responsePayload.payload.many)
    }

    fetchAccounts()
    fetchContacts()
    return () => controller.abort()
  }, [])

  // //Fetch Rate.
  // useEffect(() => {
  //   console.log('aaa', formik.values.destinationContactId)
  //   setRate(0)
  //   formik.setFieldValue('sourceAmount', 0)
  //   formik.setFieldValue('destinationAmount', 0)
  //   const controller = new AbortController();
  //   const signal = controller.signal;
  //   async function fetchRate(sourceCurrency: string, destinationCurrency: string) {

  //     fetch("https://jsonplaceholder.typicode.com/posts", { signal: signal })
  //     .then((res) => res.json())
  //     .then((res) => setRate(4.8))
  //     .catch((err) => {
  //       if (err.name === "AbortError") {
  //         console.log("successfully aborted");
  //       } else {
  //         console.log(err)
  //       }
  //     });
  //   }
  //   fetchRate("CAD", "PKR")
  //   return () => controller.abort()
  // }, [formik.values.destinationContactId, formik.values.sourceAccountId])

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
          items={sourceAccounts}
          label="From"
          variant="bordered"
          selectionMode="single"
          labelPlacement="outside"
          // defaultSelectedKeys={[]}
          selectedKeys={!formik.values.sourceAccountId ? [] : [formik.values.sourceAccountId]}
          placeholder="please select payment method"
          color="primary"
          size="lg"
          renderValue={(items: SelectedItems<GetAccount>) => {
            return items.map(item => <AccountSelectItem key={item.data?.id} account={item.data!} />)
          }}
          onBlur={formik.handleBlur}
          // onChange={formik.handleChange}
          onChange={e => {
            formik.setFieldValue('sourceAccountId', e.target.value)
            console.log(e.target.value, formik.errors.sourceAccountId)
          }}
          errorMessage={formik.touched.sourceAccountId && formik.errors.sourceAccountId}
        >
          {
            (account) => 
              <SelectItem textValue={`${account.email}`} key={account.id} value={account.id}>
                <AccountSelectItem account={account} />
              </SelectItem>
          }
        </Select>
        <Select
          id="destinationContactId"
          name="destinationContactId"
          items={destinationContacts}
          label="Send to"
          variant="bordered"
          selectionMode="single"
          labelPlacement="outside"
          // defaultSelectedKeys={[]}
          selectedKeys={!formik.values.destinationContactId ? [] : [formik.values.destinationContactId]}
          placeholder="please select payment method"
          color="primary"
          size="lg"
          renderValue={(items: SelectedItems<GetContact>) => {
            return items.map(item => <ContactSelectShow key={item.data?.id} contact={item.data!} />)
          }}
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          errorMessage={formik.touched.destinationContactId && formik.errors.destinationContactId}
        >
          {
            (contact) => 
              <SelectItem textValue={`${contact.id}`} key={contact.id} value={contact.id}>
                <ContactSelectItem contact={contact} />
              </SelectItem>
          }
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
          value={`${formik.values.sourceAmount}`}
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
          isDisabled={true}
          min="0"
          value={`${destinationAmount}`}
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
          // {...formik.getFieldProps('destinationAmount')}
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

function ContactSelectItem({contact}: {contact: GetContact}) {
  const Account = () => {
    if ( contact.type === ContactType.CASH_PICKUP ) {
      return <p className="italic text-slate-700">NBP(Cash Pickup)</p>
    } else {
      return <p className="italic text-slate-700">{contact.institution?.abbr}({contact.bankAccountNum ?? contact.iban})</p>
    }
  }
  return (
    <div>
      <p>{`${contact.firstName} ${contact.lastName}`}</p>
      <Account/>
    </div>
  )
}

function ContactSelectShow({contact}: {contact: GetContact}) {
  const Account = () => {
    if ( contact.type === ContactType.CASH_PICKUP ) {
      return <p className="text-tiny italic text-slate-700">NBP(Cash Pickup)</p>
    } else {
      return <p className="text-tiny italic text-slate-700">{contact.institution?.abbr}({contact.bankAccountNum ?? contact.iban})</p>
    }
  }
  return (
    <div>
      <p className="text-tiny">{`${contact.firstName} ${contact.lastName}`}</p>
      <Account/>
    </div>
  )
}

function AccountSelectItem({account}: {account: GetAccount}) {
  return <p>{account.type}(<span className="italic text-slate-700">{blurEmail(account.email, 8)}</span>)</p>
}