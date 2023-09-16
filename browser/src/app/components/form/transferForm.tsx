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

export default function TransferForm() {
  const initialValues: ITransferQuote = {
    sourceAcount: 0,
    destinationAccount: 0,
    sourceCurreccy: 'CAD',
    destinationCurrency: 'PRK',
    sourceAmount: 0,
    destinationAmount: 0
  }

  const transferQuoteHandler = (e: ITransferQuote) => {
    console.log(e)
  }

  const formick = useFormik({
    initialValues,
    validationSchema: Yup.object({

    }),
    onSubmit: transferQuoteHandler
  })
  return (
    <div>TransferForm</div>
  )
}
