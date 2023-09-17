'use client'

import { useState } from "react"
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
export default function TransferForm() {
  const sourceAccounts = [
    {
      id: '1',
      type: 'eTransfer',
      name: 'E-Transfer(xx@xx.com)',
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
    }),
    onSubmit: transferQuoteHandler
  })
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
        <Button 
          type="submit"
          color="primary"
          className="mt-6"
          size="md"
          isDisabled={!(formik.isValid && formik.dirty)}
        >
          Send
        </Button>
      </form>
    </div>
  )
}
