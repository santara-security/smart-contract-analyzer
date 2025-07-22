"use client";
import { usePathname } from "next/navigation";
import NavBar from "./_components/NavBar";

export default function NavBarWrapper() {
  const pathname = usePathname();
  // Hide NavBar on IDE page
  const ideRegex = /^\/audit\/[^/]+\/[^/]+\/ide$/;
  if (ideRegex.test(pathname)) {
    return null;
  }
  return <NavBar />;
}
