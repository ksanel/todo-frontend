import React from "react";
import {Card, CardFooter, Skeleton, Button, CardBody} from "@nextui-org/react";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

type Props = {
  name: string,
  to: any
}

export default function TodoListCard({name, to}: Props) {
  return (
    <>
    <Card
      isFooterBlurred
      radius="lg"
      className="border-none min-h-[200px] bg-gradient-to-tl from-indigo-100 via-indigo-500 to-indigo-900"
    >
      <CardBody className="flex justify-items-center justify-center">
      </CardBody>
      <CardFooter className="justify-between before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
        <h1 className="font-semibold text-white">{name}</h1>
      <Link to={`/list/${to}`} className="p-4 text-tiny text-white bg-black/20 rounded-xl">
        <span>Go</span>
      </Link>
    </CardFooter>
    </Card>
  </>
  );
}
