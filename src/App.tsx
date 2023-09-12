import React from 'react';
import {Button, Card, CardBody, Modal, ModalFooter, ModalContent, ModalHeader, ModalBody, NextUIProvider, useDisclosure, Input, Checkbox, Link} from "@nextui-org/react";
import HomeLayout from "./layouts/HomeLayout"

import TodoListCard from './components/TodoListCard';
import { Plus, ListTodo } from "lucide-react";

function App() {
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  return (
    <NextUIProvider>
      <HomeLayout>
        <Card isPressable className='flex items-center' onPress={onOpen}>
          <CardBody>
            <Plus />
            <p>Create Todo List</p>
          </CardBody>
        </Card>
        <TodoListCard name="Market" to={1}/>
        
      </HomeLayout>
      <Modal 
        isOpen={isOpen} 
        placement={'center'}
        onOpenChange={onOpenChange} 
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Create Todo List</ModalHeader>
              <ModalBody>
                <Input
                  autoFocus
                  endContent={
                    <ListTodo className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                  }
                  label="List name"
                  placeholder="Enter list name"
                  variant="bordered"
                />
                <div className="flex py-2 px-1 justify-between">
                  <Checkbox
                    classNames={{
                      label: "text-small",
                    }}
                  >
                    Make private
                  </Checkbox>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="flat" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={onClose}>
                  Create
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </NextUIProvider>
  );
}

export default App;
