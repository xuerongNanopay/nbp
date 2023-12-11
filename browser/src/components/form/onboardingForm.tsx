'use client'

import { useFormik } from "formik"

import {
  Input,
  Button,
  Select, 
  SelectItem
} from "@nextui-org/react"
import type { OnboardingData } from '@/type'

import CARegion from "@/constants/ca-region"
import IdentityType from "@/constants/IdentityType"
import { OnboardingDataValidator } from "@/schema/validator"


export default function OnboardingForm() {

  const initialValues: OnboardingData = {
    firstName: '',
    middleName: '',
    lastName: '',
    address1: '',
    address2: '',
    city: '',
    province: '',
    country: 'Canada',
    postalCode: '',
    phoneNumber: '',
    dob: '',
    pob: '',
    nationality: '',
    occupationId: -1,
    identityType: '',
    identityNumber: '',
    interacEmail: ''
  }

  const onboardingHandler = ( e: OnboardingData ) => {
    console.log(e)
    // console.log(OnboardingDataValidator.cast(e))
  }

  const formik = useFormik({
    initialValues,
    validationSchema: OnboardingDataValidator,
    onSubmit: onboardingHandler
  })

  return (
    <div className="w-full max-w-4xl">
      <h4 className="text-2xl font-bold mb-6 text-center">Let&apos;s Get to Know You!</h4>
      <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4 pb-6 md:pd-0">
        <div className="flex flex-col sm:flex-row gap-4">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            id="address1"
            type="text" 
            variant="bordered" 
            label="Address Line 1"
            color="primary"
            size="sm"
            {...formik.getFieldProps('address1')}
            errorMessage={formik.touched.address1 && formik.errors.address1}
          />
          <Input
            id="address2"
            type="text" 
            variant="bordered" 
            label="Address Line 2"
            color="primary"
            size="sm"
            {...formik.getFieldProps('address2')}
            errorMessage={formik.touched.address2 && formik.errors.address2}
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
            {CARegion.map((region) => (
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            id="dob"
            type="text" 
            variant="bordered" 
            label="Date of Birth"
            placeholder="YYYY-MM-DD"
            color="primary"
            size="sm"
            {...formik.getFieldProps('dob')}
            errorMessage={formik.touched.dob && formik.errors.dob}
          />
          <Input
            id="pob"
            type="text" 
            variant="bordered" 
            label="Place of Birth"
            color="primary"
            size="sm"
            {...formik.getFieldProps('pob')}
            errorMessage={formik.touched.pob && formik.errors.pob}
          />
          <Input
            id="nationality"
            type="text" 
            variant="bordered" 
            label="Nationality"
            color="primary"
            size="sm"
            {...formik.getFieldProps('nationality')}
            errorMessage={formik.touched.nationality && formik.errors.nationality}
          />
          <Input
            id="occupationId"
            type="text" 
            variant="bordered" 
            label="Occupation"
            color="primary"
            size="sm"
            {...formik.getFieldProps('occupationId')}
            errorMessage={formik.touched.occupationId && formik.errors.occupationId}
          />
          <Select
            id="identityType"
            name="identityType"
            label="Identity Type"
            variant="bordered"
            selectionMode="single"
            // defaultSelectedKeys={[]}
            selectedKeys={!formik.values.identityType ? [] : [formik.values.identityType]}
            placeholder="please select Identity Type"
            color="primary"
            size="sm"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            errorMessage={formik.touched.identityType && formik.errors.identityType}
          >
            {IdentityType.map((idType) => (
              <SelectItem key={idType.id} value={idType.id}>
                {idType.name}
              </SelectItem>
            ))}
          </Select>
          <Input
            id="identityNumber"
            type="text" 
            variant="bordered" 
            label="Identification Number"
            color="primary"
            size="sm"
            {...formik.getFieldProps('identityNumber')}
            errorMessage={formik.touched.identityNumber && formik.errors.identityNumber}
          />
        </div>
        <Input
          id="interacEmail"
          type="text" 
          variant="bordered" 
          label="E-transfer Email"
          placeholder="Please make sure you enable AUTO-DEPOSIT"
          color="primary"
          size="sm"
          {...formik.getFieldProps('interacEmail')}
          errorMessage={formik.touched.interacEmail && formik.errors.interacEmail}
        />
        <Button 
          type="submit"
          color="primary"
          className="mt-2"
          size="md"
          isDisabled={!(formik.isValid && formik.dirty)}
        >
          Submit
        </Button>
      </form>
    </div>
  )
}
