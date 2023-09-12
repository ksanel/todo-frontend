import React from "react";
import {Navbar, NavbarBrand, NavbarContent, Input } from "@nextui-org/react";
import { Apple, Search } from "lucide-react";
import { Link } from "react-router-dom";

export default function NavMenu() {
  return (
    <Navbar isBordered className="mb-14">
      <NavbarContent justify="start">
        <NavbarBrand className="mr-4">
            <Apple />
          <Link to={"/"} className="hidden sm:block font-bold text-inherit ml-2">iTodo</Link>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent as="div" className="items-center" justify="end">
        <Input
          classNames={{
            base: "max-w-full sm:max-w-[12rem] h-10",
            mainWrapper: "h-full",
            input: "text-small",
            inputWrapper: "h-full font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20",
          }}
          placeholder="Type to search todo..."
          size="sm"
          startContent={<Search size={18} />}
          type="search"
        />
      </NavbarContent>
    </Navbar>
  );
}
