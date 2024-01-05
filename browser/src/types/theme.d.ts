import { ReactNode } from "react";

export interface Menu {
  id: string,
  name: string,
  href: string,
  icon: React.JSX.Element
}