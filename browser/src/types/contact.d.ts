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
  bankName?: string,
  branchNo?: string,
  accountOrIban?: string
}