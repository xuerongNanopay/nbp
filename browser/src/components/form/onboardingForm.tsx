'use client'

import { 
  useEffect,
  useState
} from "react"
import { useFormik } from "formik"

import {
  Input,
  Button,
  Select, 
  SelectItem,
  Autocomplete, 
  AutocompleteItem
} from "@nextui-org/react"
import type { 
  OnboardingData 
} from "@/types/auth"

import IdentityType from "@/constants/IdentityType"
import { OnboardingDataValidator } from "@/schema/validator"
import { GetCountries, GetOccupations, GetRegions } from "@/types/common"

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
  occupationId: 0,
  identityType: '',
  identityNumber: '',
  interacEmail: ''
}

export default function OnboardingForm() {
  const [isSubmit, setIsSubmit] = useState(false)
  const onboardingHandler = async ( e: OnboardingData ) => {
    //TODO: make to true after test done.
    setIsSubmit(false)
    try {
      const response = await fetch('/api/nbp/profile',{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(e)
      })
      const responsePayload = await response.json()
      
      if ( responsePayload.code === 401 ) {
        //redirect to sign out
        //TODO: fetch interceptro for 401 error.
      }


    } catch (err) {
      console.log('aaa')
      console.log(err)
    }
  }

  const formik = useFormik({
    initialValues,
    validationSchema: OnboardingDataValidator,
    onSubmit: onboardingHandler
  })

  const [regions, setRegions] = useState<GetRegions>([])
  const [isRegionsLoading, setIsRegionsLoading] = useState(true)
  const [countries, setCountries] = useState<GetCountries>([])
  const [isCountriesLoading, setIsCountriesLoading] = useState(true)
  const [occupations, setOccupations] = useState<GetOccupations>([])
  const [isOccupationsLoading, setIsOccupationsLoading] = useState(true)

  useEffect(() => {
    const abortController = new AbortController()
    const fetchRegions = async () => {
      setIsRegionsLoading(true)
      try {
        const response = await fetch(`/api/nbp/common/region?countryCode=CA`, {signal: abortController.signal})
        const responsePayload = await response.json()
        const regions = responsePayload.data ?? []
        setRegions(regions)
        setIsRegionsLoading(false)
      } catch (err) {
        console.log(err)
      }
    }
    fetchRegions()
    return () => {
      abortController.abort();
    }
  }, [])

  useEffect(() => {
    const abortController = new AbortController()
    const fetchCountries = async () => {
      setIsCountriesLoading(true)
      try {
        const response = await fetch('/api/nbp/common/country', {signal: abortController.signal})
        const responsePayload = await response.json()
        const countries = responsePayload.data ?? []

        setCountries(countries)
        setIsCountriesLoading(false)
      } catch (err) {
        console.log(err)
      }
    }
    const fetchOccupations = async () => {
      setIsOccupationsLoading(true)
      try {
        const response = await fetch('/api/nbp/common/occupation', {signal: abortController.signal})
        const responsePayload = await response.json()
        const occupations = responsePayload.data ?? []

        setOccupations(occupations)
        setIsOccupationsLoading(false)
      } catch (err) {
        console.log(err)
      }
    }
    fetchCountries()
    fetchOccupations()
    return () => {
      abortController.abort();
    }
  }, [])

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
            autoComplete="off"
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
            autoComplete="off"
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
            autoComplete="off"
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
            autoComplete="off"
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
            autoComplete="off"
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
            autoComplete="off"
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
            autoComplete="off"
            size="sm"
            disabled
            {...formik.getFieldProps('country')}
            errorMessage={formik.touched.country && formik.errors.country}
          />
          <Autocomplete
            id="province"
            name="province"
            label="Province"
            variant="bordered"
            allowsCustomValue={false}
            placeholder="please select"
            color="primary"
            size="sm"
            isLoading={isRegionsLoading}
            isDisabled={isRegionsLoading}
            onBlur={formik.handleBlur}
            selectedKey={formik.values.province}
            onSelectionChange={(e) => {
              formik.setFieldValue('province', e)
            }}
            errorMessage={formik.errors.province}
          >
            {regions.map((region) => (
              <AutocompleteItem key={region.isoCode} value={region.isoCode}>
                {region.name}
              </AutocompleteItem>
            ))}
          </Autocomplete>
          <Input
            id="postalCode"
            type="text" 
            variant="bordered" 
            label="Postal Code"
            color="primary"
            autoComplete="off"
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
          placeholder="DDD-DDD-DDDD"
          autoComplete="off"
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
            autoComplete="off"
            {...formik.getFieldProps('dob')}
            errorMessage={formik.touched.dob && formik.errors.dob}
          />
          {/* <Input
            id="pob"
            type="text" 
            variant="bordered" 
            label="Place of Birth"
            color="primary"
            size="sm"
            {...formik.getFieldProps('pob')}
            errorMessage={formik.touched.pob && formik.errors.pob}
          /> */}
          <Autocomplete
            id="pob"
            name="pob"
            label="Place of Birth"
            variant="bordered"
            allowsCustomValue={false}
            placeholder="please select"
            color="primary"
            size="sm"
            isLoading={isCountriesLoading}
            isDisabled={isCountriesLoading}
            onBlur={formik.handleBlur}
            selectedKey={formik.values.pob}
            onSelectionChange={(e) => {
              formik.setFieldValue('pob', e)
            }}
            errorMessage={formik.touched.pob && formik.errors.pob}
          >
            {countries.map((country) => (
              <AutocompleteItem key={country.iso2Code} value={country.iso2Code}>
                {country.name}
              </AutocompleteItem>
            ))}
          </Autocomplete>
          {/* <Input
            id="nationality"
            type="text" 
            variant="bordered" 
            label="Nationality"
            color="primary"
            size="sm"
            {...formik.getFieldProps('nationality')}
            errorMessage={formik.touched.nationality && formik.errors.nationality}
          /> */}
          <Autocomplete
            id="nationality"
            name="nationality"
            label="Nationality"
            variant="bordered"
            allowsCustomValue={false}
            placeholder="please select"
            color="primary"
            size="sm"
            isLoading={isRegionsLoading}
            isDisabled={isRegionsLoading}
            onBlur={formik.handleBlur}
            selectedKey={formik.values.nationality}
            onSelectionChange={(e) => {
              formik.setFieldValue('nationality', e)
            }}
            errorMessage={formik.touched.nationality && formik.errors.nationality}
          >
            {countries.map((country) => (
              <AutocompleteItem key={country.iso2Code} value={country.iso2Code}>
                {country.name}
              </AutocompleteItem>
            ))}
          </Autocomplete>
          {/* <Input
            id="occupationId"
            type="text" 
            variant="bordered" 
            label="Occupation"
            color="primary"
            size="sm"
            {...formik.getFieldProps('occupationId')}
            errorMessage={formik.touched.occupationId && formik.errors.occupationId}
          /> */}
          <Autocomplete
            id="occupationId"
            name="occupationId"
            label="Occupation"
            variant="bordered"
            allowsCustomValue={false}
            placeholder="please select"
            color="primary"
            size="sm"
            isLoading={isOccupationsLoading}
            isDisabled={isOccupationsLoading}
            onBlur={formik.handleBlur}
            selectedKey={formik.values.occupationId}
            onSelectionChange={(e) => {
              console.log(e)
              formik.setFieldValue('occupationId', e)
            }}
            errorMessage={formik.touched.occupationId && formik.errors.occupationId}
          >
            {occupations.map((occupation) => (
              <AutocompleteItem key={occupation.id} value={occupation.id}>
                {occupation.type}
              </AutocompleteItem>
            ))}
          </Autocomplete>
          <Select
            id="identityType"
            name="identityType"
            label="Identity Type"
            variant="bordered"
            selectionMode="single"
            // defaultSelectedKeys={[]}
            selectedKeys={!formik.values.identityType ? [] : [formik.values.identityType]}
            placeholder="please select"
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
          autoComplete="off"
          {...formik.getFieldProps('interacEmail')}
          errorMessage={formik.touched.interacEmail && formik.errors.interacEmail}
        />
        <Button 
          type="submit"
          color="primary"
          className="mt-2"
          size="md"
          isLoading={isSubmit}
          isDisabled={!(formik.isValid && formik.dirty)}
        >
          Submit
        </Button>
      </form>
    </div>
  )
}
