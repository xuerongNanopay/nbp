'use client'
import { 
  useState,
  useEffect
} from "react"
import { useFormik } from "formik"
import {
  Input,
  Button,
  Select, 
  SelectItem
} from "@nextui-org/react"

import { ContactData } from "@/types/contact"
import TransferMethod from "@/constants/transferMethod"
import { ContactDataValidator } from "@/schema/validator"
import { ContactType } from "@prisma/client"
import { GetInstitutions, GetPersonalRelationships, GetRegions } from "@/types/common"

const initialValues: Partial<ContactData> = {
  country: 'PK',
  firstName: '',
  middleName: '',
  lastName: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  province: '',
  postalCode: '',
  phoneNumber: '',
  relationshipId: 0,
  transferMethod: '',
  institutionId: 0,
  branchNo: '',
  accountOrIban: ''
}

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  const createContact = (e: Partial<ContactData>) => { 
    console.log(e)
    // formik.resetForm()
    // setIsCreating(true)
    //TODO: navigating to contact/id
  }

  const formik = useFormik<Partial<ContactData>>({
    initialValues,
    validationSchema: ContactDataValidator,
    onSubmit: createContact
  })

  const [regions, setRegions] = useState<GetRegions>([])
  const [isRegionsLoading, setIsRegionsLoading] = useState(true)
  const [relationships, setRelationships] = useState<GetPersonalRelationships>([])
  const [isRelationshipsLoading, setIsRelationshipsLoading] = useState(true)
  const [institutions, setInstitutions] = useState<GetInstitutions>([])
  const [isInstitutionsLoading, setIsInstitutionsLoading] = useState(true)

  useEffect(() => {
    const abortController = new AbortController()
    const fetchRegions = async () => {
      if (!formik.values.country) {
        return
      }
      setIsRegionsLoading(true)
      try {
        const response = await fetch(`/api/nbp/common/region?countryCode=PK`, {signal: abortController.signal})
        const responsePayload = await response.json()
        const regions = responsePayload.data ?? []
        setRegions(regions)
        setIsRegionsLoading(false)
      } catch (err) {
        console.error(err)
      }
    }
    const fetchRelationShips = async () => {
      setIsRelationshipsLoading(true)

      try {
        const response = await fetch(`/api/nbp/common/personal_relationship`, {signal: abortController.signal})
        const responsePayload = await response.json()
        const relationships = responsePayload.data ?? []
        setRelationships(relationships)
        setIsRelationshipsLoading(false)
      } catch (err) {
        console.error(err)
      }
    }

    const fetchInstitutions = async () => {
      setIsInstitutionsLoading(true)
      try {
        const response = await fetch(`/api/nbp/common/institution?countryCode=PK`, {signal: abortController.signal})
        const responsePayload = await response.json()
        const institutions = responsePayload.data ?? []
        setInstitutions(institutions)
        setIsInstitutionsLoading(false)
      } catch (err) {
        console.error(err)
      }
    }

    fetchRegions()
    fetchRelationShips()
    fetchInstitutions()
    return () => {
      abortController.abort();
    }
  }, [])

  return (
    <div className="w-full max-w-4xl">
      <h4 className="text-2xl font-bold mb-6 text-center">Create a Contact</h4>
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
            // TODO: not a best option. Refactor
            value="Pakistan"
            errorMessage={formik.touched.country && formik.errors.country}
          />
          <Select
            id="province"
            label="Province"
            variant="bordered"
            name="province"
            isLoading={isRegionsLoading}
            selectionMode="single"
            // defaultSelectedKeys={[]}
            selectedKeys={!formik.values.province ? [] : [formik.values.province]}
            placeholder="please select"
            color="primary"
            size="sm"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            // {...formik.getFieldProps('province')}
            errorMessage={formik.touched.province && formik.errors.province}
          >
            {regions.map((region) => (
              <SelectItem key={region.isoCode} value={region.isoCode}>
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
          id="relationshipId"
          label="Relationship to Contact"
          name="relationshipId"
          variant="bordered"
          selectionMode="single"
          // defaultSelectedKeys={[]}
          isLoading={isRelationshipsLoading}
          selectedKeys={!formik.values.relationshipId ? [] : [formik.values.relationshipId]}
          placeholder="please select"
          color="primary"
          size="sm"
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          errorMessage={formik.touched.relationshipId && formik.errors.relationshipId}
        >
          {relationships.map((relationship) => (
            <SelectItem key={relationship.id} value={relationship.id}>
              {relationship.type}
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
            <SelectItem key={transferMethod.id} value={transferMethod.value}>
              {transferMethod.name}
            </SelectItem>
          ))}
        </Select>

        {
          formik.values.transferMethod === ContactType.BANK_ACCOUNT &&
          <>
            <Select
              id="institutionId"
              label="Bank Name"
              variant="bordered"
              selectionMode="single"
              // defaultSelectedKeys={[]}
              isLoading={isInstitutionsLoading}
              selectedKeys={!formik.values.institutionId ? [] : [formik.values.institutionId]}
              placeholder="Select Transfer Method"
              color="primary"
              size="sm"
              {...formik.getFieldProps('institutionId')}
              errorMessage={formik.touched.institutionId && formik.errors.institutionId}
            >
              {institutions.map((institution) => (
                <SelectItem key={institution.id} value={institution.id}>
                  {institution.name}
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
          isLoading={isSubmitting}
          isDisabled={!(formik.isValid && formik.dirty)}
        >
          Submit
        </Button>
      </form>
    </div>
  )
}
