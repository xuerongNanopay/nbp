import {
  Link, 
  Navbar,
  NavbarBrand,
  NavbarContent
} from "@nextui-org/react"

export default function NotFound() {
  return (
    <>
      <Navbar
        className="border-green-800 border-b-2"
        isBordered
      >
        <NavbarContent justify="end">
          <div className="w-full flex justify-center">
            <h1>ICON</h1>
          </div>
        </NavbarContent>
      </Navbar>
      <div>
        <h4>404 Not Found</h4>
      </div>
    </>
  )
}