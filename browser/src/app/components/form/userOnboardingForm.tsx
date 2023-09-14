'use client'

import { useFormik } from "formik"
import * as Yup from 'yup'
import {
  Input,
  Button,
  Select, 
  SelectItem
} from "@nextui-org/react"

import CARegion from "@/constants/ca-region"

export default function userOnboardingForm() {

  const initialValues: IUserOnboarding = {
    firstName: "",
    middleName: "",
    lastName: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    province: "",
    country: "Canada",
    postalCode: "",
    dob: "",
    etransfer: "",
    phoneNumber: ""
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
                      )
    }),
    onSubmit: onboardingHandler
  })

  return (
    <div className="w-full max-w-4xl">
      <h4 className="text-2xl font-bold mb-6 text-center">Let's Get to Know You!</h4>
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
      </form>
    </div>
  )
}
