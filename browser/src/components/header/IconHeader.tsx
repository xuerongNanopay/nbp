import { 
  Navbar,
  NavbarBrand,
  NavbarContent
} from "@nextui-org/react"

export default function IconHeader(props: {className: any}) {
  return (
    <Navbar
      className={`border-green-800 border-b-2 ${props.className}`}
      isBordered
    >
      <NavbarContent justify="end">
        <div className="w-full flex justify-center">
          <h1>ICON</h1>
        </div>
      </NavbarContent>
    </Navbar>
  )
}