'use client'
import { Session } from "@/types/auth";
import { UserDetail } from "@/types/user";

import { VerticalDotsIcon } from "@/icons/VerticalDotsIcon";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Avatar,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  User,
  Divider,
  Button,
  Link,
  Tooltip
} from "@nextui-org/react";
import { IdentificationType } from "@prisma/client";

function PropertyView ({name, value}: {name: string, value: string}) {
  return (
    <div>
      <h6 className="font-semibold">{name}</h6>
      <p className="text-sm text-slate-600">{value}</p>
    </div>
  )
}

const ID_TEXT_MAP = {
  [IdentificationType.DRIVER_LICENSE]: "Driver's License",
  [IdentificationType.PROVINCAL_ID]: "Provincial ID Card",
  [IdentificationType.PASSPORT]: "Passport",
  [IdentificationType.NATIONAL_ID]: "Passport",
}
export function UserDetail(
  {
    user, 
    session
  } : {
    user: UserDetail, 
    session: Session
  }
) {
  return (
    <Card className="text-slate-950">
      <CardHeader className="justify-between">
        <User
          name={`${user.firstName} ${user.lastName}`}
          description={session.login.email}
          avatarProps={{
            className: "transition-transform",
            color: "primary",
            size: "md"
          }}
        />
        <div className="flex items-center">
          <Button as={Link} variant="ghost" color="primary" className="max-sm:hidden me-2">Edit</Button>
          <Dropdown>
            <DropdownTrigger>
              <Button isIconOnly size="sm" variant="light">
                <VerticalDotsIcon className="text-default-300" />
              </Button>
            </DropdownTrigger>
            <DropdownMenu>
              <DropdownItem className="sm:hidden">Edit</DropdownItem>
              <DropdownItem>Change Password</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </CardHeader>
      <Divider/>
      <CardBody className="grid-cols-1 gap-2">
        <div className={`grid ${!!user.middleName ? 'grid-cols-3': 'grid-cols-2'} max-sm:grid-cols-1 gap-2`}>
          <PropertyView name='FirstName:' value={user.firstName}/>
          {
            !!user.middleName && <PropertyView name='MiddleName:' value={user.middleName}/>
          }
          <PropertyView name='LastName:' value={user.lastName}/>
        </div>
        <Divider></Divider>
        <div className={`grid grid-cols-2 max-sm:grid-cols-1 gap-2`}>
          <PropertyView name='Address Line 1:' value={user.address1}/>
          {
            !!user.address2 && <PropertyView name='Address Line 2:' value={user.address2}/>
          }
          <PropertyView name='City:' value={user.city}/>
          <PropertyView name='Province:' value={user.province.name}/>
          <PropertyView name='Country:' value={user.country.name}/>
          <PropertyView name='PostalCode: ' value={user.postalCode}/>
          <PropertyView name='PhoneNumber:' value={`${user.phoneNumber}`}/>
        </div>
        <Divider></Divider>
        <div className={`grid grid-cols-2 max-sm:grid-cols-1 gap-2`}>
          <PropertyView name='Birthday:' value={`${user.dob.toISOString().substring(0, 10)}`}/>
          <PropertyView name='Place of Birth:' value={`${user.pob}`}/>
          <PropertyView name='Nationality:' value={`${user.nationality}`}/>
        </div>
        <Divider></Divider>
        <div className={`grid grid-cols-2 max-sm:grid-cols-1 gap-2`}>
          <PropertyView name='ID Type:' value={`${ID_TEXT_MAP[user.identification!.type]}`}/>
          <PropertyView name='Nationality:' value={`${user.identification?.value}`}/>
        </div>
        <Divider></Divider>
        <div className={`grid grid-cols-2 max-sm:grid-cols-1 gap-2`}>
          <PropertyView name='Occupation:' value={`${user.occupation.type}`}/>
        </div>
        {
          !!user.accounts && user.accounts.length > 0 &&
          <>
            <Divider></Divider>
            <div className={`grid grid-cols-2 max-sm:grid-cols-1 gap-2`}>
              <PropertyView name='Interac Email:' value={`${user.accounts[0].email}`}/>
            </div>
          </>
        }
      </CardBody>
    </Card>
  )
}