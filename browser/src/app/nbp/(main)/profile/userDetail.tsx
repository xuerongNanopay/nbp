import { User } from "@/types/user";

import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Avatar,
  Button
} from "@nextui-org/react";


export function UserDetail(user: {user: User}) {
  console.log(user)
  return (
    <>
      <Card></Card>
    </>
  )
}