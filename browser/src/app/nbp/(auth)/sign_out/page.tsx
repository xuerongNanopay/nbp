'use client'
import { useRef, useEffect } from "react";
import { signOut } from "./actions";
import { CircularProgress } from "@nextui-org/react";

export default function SignOut() {
  const formRef = useRef<HTMLFormElement|null>(null);
  useEffect(() => {
    formRef?.current?.submit();
  }, []);

  return (
    <div className="min-h-full grid place-content-center">
      <form className="hidden" ref={formRef} action={signOut}></form>
      <CircularProgress className="max-sm:mt-32" size="lg" color="primary" label="Loading..."></CircularProgress>
    </div>
  )
}