import { 
  Navbar,
  NavbarContent,
  Button,
  Link
} from "@nextui-org/react"
import { CloseIcon } from "@/icons/CloseIcon"

type Props = {
  className?: string
}
// TODO: using back url as 
export default function IconHeaderWithLogout({className}: Props) {
  return (
    <Navbar
      className={`border-green-800 border-b-2 bg-white ${className}`}
      isBordered
    >
      <NavbarContent justify="end">
        <div className="w-full flex justify-start md:justify-center items-center relative">
          <h1>ICON</h1>
          <Button 
            color="primary" 
            variant="ghost"
            href="/nbp/sign_out"
            as={Link}
            radius="full"
            className="absolute right-0 md:right-2 px-0"
          >
            <CloseIcon/>
          </Button>
        </div>
      </NavbarContent>
    </Navbar>
  )
}