//TODO: using close icon for Sign Out
import { 
  Navbar,
  NavbarBrand,
  NavbarContent,
  Button
} from "@nextui-org/react"
import { CloseIcon } from "@/icons/CloseIcon"
import { PressEvent } from "@react-types/shared"

type Props = {
  className?: string,
  closeHandler: (e: PressEvent) => void
}
// TODO: using back url as 
export default function IconHeaderWithLogout({className, closeHandler}: Props) {
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
            radius="full"
            className="absolute right-0 md:right-2 px-0"
            onPressEnd = {closeHandler}
          >
            <CloseIcon/>
          </Button>
        </div>
      </NavbarContent>
    </Navbar>
  )
}