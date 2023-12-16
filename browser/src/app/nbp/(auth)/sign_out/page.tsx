'use client'
import { useRef, useEffect } from "react";
import { signOut } from "./actions";

export default function SignOut() {
  const formRef = useRef<HTMLFormElement|null>(null);
  useEffect(() => {
    formRef?.current?.submit();
  }, []);

  return (
    <form ref={formRef} action={signOut}></form>
  )
}