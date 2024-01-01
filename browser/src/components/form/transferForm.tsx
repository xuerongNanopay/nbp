'use client'

import { useState, useEffect, useMemo, ChangeEvent, FormEvent } from "react"
import { useFormik } from "formik"
import {
  Input,
  Button,
  Select, 
  SelectItem,
  SelectedItems,
  useDisclosure,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter
} from "@nextui-org/react"

import { TransactionQuoteDate } from "@/types/transaction"
import { TransactionQuoteDateValidator } from "@/schema/validator"
import { GetAccount, GetAccounts } from "@/types/account"
import { GetContact, GetContacts } from "@/types/contact"
import { HttpGET } from "@/types/http"
import { ContactType } from "@prisma/client"
import { blurEmail } from "@/utils/textUtil"
import { useAlert } from "@/hook/useAlert"
import { CONSOLE_ALERT } from "@/utils/alertUtil"
import { AlertFunc } from "@/types/log"

export default function TransferFrom() {
  const alert = useAlert() ?? CONSOLE_ALERT

  const [disableAmountInput, setDisableAmountInput] = useState(true)
  const [sourceCurrency, setSourceCurrency ] = useState<string|null>(null)
  const [destinationCurrency, setDestinationCurrency ] = useState<string|null>(null)
  const [destinationAmount, setDestinationAmount] = useState<number>(0.0)
  const [currencyRate, setCurrencyRate] = useState<number>(0.0)
  const [sourceAccounts, setSourceAccounts] = useState<GetAccount[]>([])
  const [destinationContacts, setDestinationContacts] = useState<GetContact[]>([])
  const [isSubmit, setIsSubmit] = useState(false)
  const {isOpen, onOpen, onOpenChange} = useDisclosure({onClose: () => {
    setIsSubmit(false)
  },})

  const initialValues: Partial<TransactionQuoteDate> = {
    sourceAccountId: 0,
    destinationContactId: 0,
    sourceAmount: 0,
    
  }

  const quoteTransaction = (e: Partial<TransactionQuoteDate>) => {
    console.log(e)
    setIsSubmit(true)
    //TODO: making button loading
    // setIsModalOpen(true)
  }

  const formik = useFormik<Partial<TransactionQuoteDate>>({
    initialValues,
    validationSchema: TransactionQuoteDateValidator,
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
      try {
        const response = await fetch('/api/nbp/user/accounts', { signal: controller.signal })
        const resposnePayload = await response.json() as HttpGET<GetAccounts>
        setSourceAccounts(resposnePayload.payload.many)
      } catch ( err ) {
        console.error(err)
      }
    }
    const fetchContacts = async () => {
      try {
        const response = await fetch('/api/nbp/user/contacts', { signal: controller.signal })
        const responsePayload = await response.json() as HttpGET<GetContacts>
        setDestinationContacts(responsePayload.payload.many)
      } catch ( err ) {
        console.error(err)
      }
    }

    fetchAccounts()
    fetchContacts()
    return () => controller.abort()
  }, [])

  //Fetch Rate.
  useEffect(() => {
    setCurrencyRate(0.0)
    formik.setFieldValue('sourceAmount', 0)
    formik.setFieldValue('destinationAmount', 0)
    setSourceCurrency(null)
    setDestinationCurrency(null)
    setDisableAmountInput(true)

    const sa = sourceAccounts.find(s => s.id.toString() === formik.values.sourceAccountId?.toString())
    const dc = destinationContacts.find(s => s.id.toString() === formik.values.destinationContactId?.toString())
    if ( !sa || !dc ) return 

    setSourceCurrency(sa.currency)
    setDestinationCurrency(dc.currency)

    const controller = new AbortController()
    const signal = controller.signal

    async function fetchCurrencyRate(sourceCurrency: string, destinationCurrency: string) {
      try {
        const response = await fetch(`/api/nbp/common/currency_rate?sourceCurrency=${sourceCurrency}&destinationCurrency=${destinationCurrency}`, { signal: signal })
        const responsePayload = await response.json()
        if (responsePayload.code >> 7 === 1) {
          const currencyRate = responsePayload.payload.single
          setCurrencyRate(currencyRate.value)
          setDisableAmountInput(false)
        } else {
          alert.error(responsePayload.message)
        }
      } catch (err) {
        alert.error("Please try later")
        console.error(err)
      }
    }
    fetchCurrencyRate(sa.currency, dc.currency)
    return () => controller.abort()
  }, [formik.values.destinationContactId, formik.values.sourceAccountId])

  const setSourceAmount = (e: ChangeEvent<HTMLInputElement>) => {
    const sourceAmount = Math.round(Number(e.target.value) * 100) / 100
    const destinationAmount =  Math.round(sourceAmount * currencyRate * 100) / 100
    setDestinationAmount(destinationAmount)
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
          placeholder="Please select..."
          color="primary"
          size="lg"
          renderValue={(items: SelectedItems<GetAccount>) => {
            return items.map(item => <AccountSelectItem key={item.data?.id} account={item.data!} />)
          }}
          onBlur={formik.handleBlur}
          // onChange={formik.handleChange}
          onChange={e => {
            formik.setFieldValue('sourceAccountId', e.target.value)
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
          placeholder="Please select..."
          color="primary"
          size="lg"
          renderValue={(items: SelectedItems<GetContact>) => {
            return items.map(item => <ContactSelectShow key={item.data?.id} contact={item.data!} />)
          }}
          onBlur={formik.handleBlur}
          onChange={e => {
            formik.setFieldValue('destinationContactId', e.target.value)
          }}
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
          size="lg"
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
          size="lg"
          placeholder="0.00"
          isDisabled={disableAmountInput}
          disabled
          min="0"
          description={`Rate: 1.00 CAD \u2248 ${currencyRate} PRK`}
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
          <p className="font-semibold text-lg">Send</p>
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

function ConfirmTransferModal(
  {
    transaction,
    isOpen,
    onOpenChange,
    alert
  }: {
    transaction: any,
    isOpen: boolean,
    onOpenChange: () => void,
    alert: AlertFunc,
  }
) {
  return (
    <Modal placement="center" hideCloseButton isOpen={isOpen} onOpenChange={onOpenChange} isDismissable={false}>
      <ModalContent>
        {
          (onClose) => (
            <>
            
            </>
          )
        }
      </ModalContent>
    </Modal>
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