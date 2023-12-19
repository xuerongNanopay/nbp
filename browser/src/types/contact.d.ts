export interface ContactData  {
  firstName: string,
  middleName?: string,
  lastName: string,
  addressLine1: string,
  addressLine2?: string,
  city: string,
  province: string,
  country: string,
  postalCode?: string,
  phoneNumber?: string,
  relationshipId: number,
  transferMethod: string,
  institutionId?: number,
  branchNo?: string,
  accountOrIban?: string
}

export interface ContactDeleteData {
  id: number
}