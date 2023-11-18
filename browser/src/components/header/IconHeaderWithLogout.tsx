//TODO: using close icon for Sign Out
import { 
  Navbar,
  NavbarBrand,
  NavbarContent,
  Button
} from "@nextui-org/react"

export default function IconHeaderWithLogout(props: {className: any}) {
  return (
    <Navbar
      className={`border-green-800 border-b-2 bg-white ${props.className}`}
      isBordered
    >
      <NavbarContent justify="end">
        <div className="w-full flex justify-start md:justify-center items-center relative">
          <h1>ICON</h1>
          <Button 
            color="primary" 
            variant="ghost"
            className="absolute right-0 md:right-2"
          >
            Out
          </Button>
        </div>
      </NavbarContent>
    </Navbar>
  )
}