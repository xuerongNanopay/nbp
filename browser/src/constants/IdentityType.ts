import { IdentificationType } from "@prisma/client"

const IdentityType = [
  {
    "id": IdentificationType.DRIVER_LICENSE,
    "name": "Driver's License"
  },
  {
    "id": IdentificationType.PROVINCAL_ID,
    "name": "Provincial ID Card"
  },
  {
    "id": IdentificationType.PASSWORD,
    "name": "Passport"
  }
]
export default IdentityType