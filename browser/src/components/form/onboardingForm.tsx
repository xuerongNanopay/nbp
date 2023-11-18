'use client'

import { useFormik } from "formik"
import * as Yup from 'yup'
import dayjs from "dayjs"
import {
  Input,
  Button,
  Select, 
  SelectItem
} from "@nextui-org/react"
import { parse, isDate } from "date-fns";

import CARegion from "@/constants/ca-region"
import IdentityType from "@/constants/IdentityType"

const eighteen_years_age = dayjs().subtract(18, 'year').format('YYYY-MM-DD')
const hundred_years_age = dayjs().subtract(100, 'year').format('YYYY-MM-DD')


export default function OnboardingForm() {

  const initialValues: IUserOnboarding = {
    firstName: '',
    middleName: '',
    lastName: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    province: '',
    country: 'Canada',
    postalCode: '',
    phoneNumber: '',
    dob: '',
    pob: '',
    nationality: '',
    occupation: '',
    identityType: '',
    identityNumber: '',
    etransfer: ''
  }

  const onboardingHandler = ( e: IUserOnboarding ) => {
    console.log(e)
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
      postalCode: Yup.string()
                      .trim()
                      .required('Required')
                      .matches(
                        /^[ABCEGHJKLMNPRSTVXY][0-9][ABCEGHJKLMNPRSTVWXYZ] ?[0-9][ABCEGHJKLMNPRSTVWXYZ][0-9]$/, 
                        "Invalid Format(eg: S4S 3E8)"
                      ),
      phoneNumber: Yup.string()
                      .required('Required')
                      .matches(
                        /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}$/, 
                        "Invalid Format(eg: 111-111-1111)"
                      ),
      dob: Yup.date()
                .transform((value, originalValue) => {
                  const parsedDate = isDate(originalValue)
                    ? originalValue
                    : parse(originalValue, "yyyy-MM-dd", new Date());
                  return parsedDate;
                })
                .typeError('Invalid Format(eg: YYYY-MM-DD)')
                .required('Required')
                .max(eighteen_years_age, "You must be at least 18 years old to register")
                .min(hundred_years_age, "You must be at less 100 years old to register"),
      pob: Yup.string().trim().required('Required'),
      nationality: Yup.string().trim().required('Required'),
      occupation: Yup.string().trim().required('Required'),
      identityType: Yup.string().trim().required('Required'),
      identityNumber: Yup.string().trim().required('Required'),
      etransfer: Yup.string().email('Invalid email address').required('Required')
    }),
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
            id="occupation"
            type="text" 
            variant="bordered" 
            label="Occupation"
            color="primary"
            size="sm"
            {...formik.getFieldProps('occupation')}
            errorMessage={formik.touched.occupation && formik.errors.occupation}
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
          id="etransfer"
          type="text" 
          variant="bordered" 
          label="E-transfer Email"
          placeholder="Please make sure you enable AUTO-DEPOSIT"
          color="primary"
          size="sm"
          {...formik.getFieldProps('etransfer')}
          errorMessage={formik.touched.etransfer && formik.errors.etransfer}
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
