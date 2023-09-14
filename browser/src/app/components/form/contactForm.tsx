'use client'

import { useFormik } from "formik"
import * as Yup from 'yup'
import {
  Input,
  Button,
  Select, 
  SelectItem
} from "@nextui-org/react"

import PKRegion from "@/constants/pk-region"
import PersonalRelationship from "@/constants/personal-relationship"
import TransferMethod from "@/constants/transferMethod"
import PKBank from "@/constants/pk-bank"


export default function ContactForm() {
  type NewContact = IContact & ICashPickup & IBankTransfer
  const initialValues: NewContact = {
    firstName: '',
    middleName: '',
    lastName: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    province: '',
    country: 'Pakistan',
    postalCode: '',
    relationship: '',
    phoneNumber: '',
    transferMethod: '',
    bankName: '',
    branchNo: '',
    accountOrIban: ''
  }

  const createContactHandler = (e: NewContact) => { 
    console.log(e)
    // formik.resetForm()
  }

  const formik = useFormik({
    initialValues,
    validationSchema: Yup.object({
      firstName: Yup.string().trim().required('Required'),
      lastName: Yup.string().trim().required('Required'),
      addressLine1: Yup.string().trim().required('Required'),
      city: Yup.string().trim().required('Required'),
      province: Yup.string().trim().required('Required'),
      country: Yup.string().trim().required('Required'),
      relationship: Yup.string().trim().required('Required'),
      transferMethod: Yup.string().trim().required('Required'),
      bankName: Yup.string().trim().when(['transferMethod'], {
        is: (transferMethod: string) => transferMethod === 'bankAccount',
        then:() => Yup.string().trim().required('Required')
      }),
      accountOrIban: Yup.string().trim().when(['transferMethod'], {
        is: 'bankAccount',
        then: () => Yup.string().trim().required('Required')
      })
    }),
    onSubmit: createContactHandler
  })

  return (
    <div className="w-full max-w-4xl">
      <h4 className="text-2xl font-bold mb-6 text-center">Create a Contact</h4>
      <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col md:flex-row gap-4">
          <Input
            id="firstName"
            type="text" 
            variant="bordered" 
            label="FirstName"
            color="primary"
            size="sm"
            {...formik.getFieldProps('firstName')}
            errorMessage={formik.touched.firstName && formik.errors.firstName}
          />
          <Input
            id="middleName"
            type="text" 
            variant="bordered" 
            label="MiddleName"
            color="primary"
            size="sm"
            {...formik.getFieldProps('middleName')}
            errorMessage={formik.touched.middleName && formik.errors.middleName}
          />
          <Input
            id="lastName"
            type="text" 
            variant="bordered" 
            label="LastName"
            color="primary"
            size="sm"
            {...formik.getFieldProps('lastName')}
            errorMessage={formik.touched.lastName && formik.errors.lastName}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            id="addressLine1"
            type="text" 
            variant="bordered" 
            label="Address Line 1"
            color="primary"
            size="sm"
            {...formik.getFieldProps('addressLine1')}
            errorMessage={formik.touched.addressLine1 && formik.errors.addressLine1}
          />
          <Input
            id="addressLine2"
            type="text" 
            variant="bordered" 
            label="Address Line 2"
            color="primary"
            size="sm"
            {...formik.getFieldProps('addressLine2')}
            errorMessage={formik.touched.addressLine2 && formik.errors.addressLine2}
          />
          <Input
            id="city"
            type="text" 
            variant="bordered" 
            label="City"
            color="primary"
            size="sm"
            {...formik.getFieldProps('city')}
            errorMessage={formik.touched.city && formik.errors.city}
          />
          <Input
            id="country"
            type="text" 
            variant="bordered" 
            label="Country"
            color="primary"
            size="sm"
            disabled
            {...formik.getFieldProps('country')}
            errorMessage={formik.touched.country && formik.errors.country}
          />
          <Select
            id="province"
            name="province"
            label="Province"
            variant="bordered"
            selectionMode="single"
            // defaultSelectedKeys={[]}
            selectedKeys={!formik.values.province ? [] : [formik.values.province]}
            placeholder="please select province"
            color="primary"
            size="sm"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            errorMessage={formik.touched.province && formik.errors.province}
          >
            {PKRegion.map((region) => (
              <SelectItem key={region.id} value={region.id}>
                {region.name}
              </SelectItem>
            ))}
          </Select>
          <Input
            id="postalCode"
            type="text" 
            variant="bordered" 
            label="Postal Code"
            color="primary"
            size="sm"
            {...formik.getFieldProps('postalCode')}
            errorMessage={formik.touched.postalCode && formik.errors.postalCode}
          />
        </div>
        <Select
          id="relationship"
          name="relationship"
          label="Relationship to Contact"
          variant="bordered"
          selectionMode="single"
          // defaultSelectedKeys={[]}
          selectedKeys={!formik.values.relationship ? [] : [formik.values.relationship]}
          placeholder="Choose from personal relationship types"
          color="primary"
          size="sm"
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          errorMessage={formik.touched.relationship && formik.errors.relationship}
        >
          {PersonalRelationship.map((relationship) => (
            <SelectItem key={relationship.id} value={relationship.id}>
              {relationship.id}
            </SelectItem>
          ))}
        </Select>
        <Input
          id="phoneNumber"
          type="text" 
          variant="bordered" 
          label="Phone Number"
          color="primary"
          size="sm"
          {...formik.getFieldProps('phoneNumber')}
          errorMessage={formik.touched.phoneNumber && formik.errors.phoneNumber}
        />

        <Select
          id="transferMethod"
          name="transferMethod"
          label="Transfer Method"
          variant="bordered"
          selectionMode="single"
          // defaultSelectedKeys={[]}
          selectedKeys={!formik.values.transferMethod ? [] : [formik.values.transferMethod]}
          placeholder="Select Transfer Method"
          color="primary"
          size="sm"
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          errorMessage={formik.touched.transferMethod && formik.errors.transferMethod}
        >
          {TransferMethod.map((transferMethod) => (
            <SelectItem key={transferMethod.id} value={transferMethod.id}>
              {transferMethod.name}
            </SelectItem>
          ))}
        </Select>

        {
          formik.values.transferMethod === 'bankAccount' &&
          <>
            <Select
              id="bankName"
              name="bankName"
              label="Bank Name"
              variant="bordered"
              selectionMode="single"
              // defaultSelectedKeys={[]}
              selectedKeys={!formik.values.bankName ? [] : [formik.values.bankName]}
              placeholder="Select Transfer Method"
              color="primary"
              size="sm"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              errorMessage={formik.touched.bankName && formik.errors.bankName}
            >
              {PKBank.map((bank) => (
                <SelectItem key={bank.id} value={bank.id}>
                  {bank.name}
                </SelectItem>
              ))}
            </Select>
            <Input
              id="accountOrIban"
              type="text" 
              variant="bordered" 
              label="Account Number or IBAN"
              color="primary"
              size="sm"
              {...formik.getFieldProps('accountOrIban')}
              errorMessage={formik.touched.accountOrIban && formik.errors.accountOrIban}
            />
          </>
        }

        <Button 
          type="submit"
          color="primary"
          className="mt-6"
          size="md"
          isDisabled={!(formik.isValid && formik.dirty)}
        >
          Submit
        </Button>
      </form>
    </div>
  )
}
