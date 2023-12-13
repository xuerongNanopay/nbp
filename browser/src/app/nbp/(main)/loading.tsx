import {
  CircularProgress
} from "@nextui-org/react";

export default function Loading() {
  return (
    <div className="min-h-screen grid place-content-center">
      <CircularProgress
        size="lg"
        label="Loading..."
      />
    </div>
  )
}