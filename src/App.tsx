import React, { useRef, useEffect } from 'react';
import {Button, Card, CardBody, Modal, ModalFooter, ModalContent, ModalHeader, ModalBody, NextUIProvider, useDisclosure, Input, Checkbox, Link} from "@nextui-org/react";
import HomeLayout from "./layouts/HomeLayout"

import TodoListCard from './components/TodoListCard';
import { Plus, ListTodo, HeartCrack } from "lucide-react";
import { TodoListsResponse } from './utils/types';
import { on } from 'events';
import { ToastContainer, toast } from 'react-toastify';

function App() {
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  const [isLoading, setIsLoading] = React.useState(false);
  const [isError, setIsError] = React.useState(false);
  const [newTodoList, setNewTodoList] = React.useState('');

  const notify = () => toast.success('List created successfully!', {
      position: "bottom-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
  });

  // Add new todo list
  const addTodoList = () => {
    console.log("Add new todo list")
    const data = {
      name: newTodoList
    }

    fetch("https://localhost:7049/api/list", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(res => {
      if (!res.ok) {
          throw new Error("Network response was not ok");
      }
      return res.json();
    })
    .then(data => {
        console.log(data);
        onOpenChange();
        setIsLoading(true);
        item.current.data.lists.push(data);
        setIsLoading(false);
        notify();
    })
    .catch(err => {
        console.error(err);
        setIsError(true);
    });

  }
  
  const item = useRef<TodoListsResponse>({
    data: {lists: [], total: 0},
    isLoading: false,
    isError: false,
    mutate: () => {}
  });

  useEffect(() => {
    setIsLoading(true);
    fetch("https://localhost:7049/api/list")
      .then((res) => res.json())
      .then((data) => {
        item.current.data = data;
      })
      .catch((err) => {
        setIsError(true);
        setIsLoading(true);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [])

  return (
    <NextUIProvider>
      <ToastContainer
            position="bottom-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
        />
      <HomeLayout>
        <Card isPressable className='flex items-center' onPress={onOpen}>
          <CardBody>
            <Plus />
            <p>Create Todo List</p>
          </CardBody>
        </Card>
        {isLoading ? (
          <Card isPressable className='flex items-center col-span-5' onPress={onOpen}>
            <CardBody className='flex items-center'>
              {/* Spinner */}
              <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24"></svg>
              <p>Loading...</p>
            </CardBody>
          </Card>
        ) : isError ? (
          <Card className='flex items-center col-span-5'>
              <CardBody className='flex items-center'>
                <HeartCrack className='text-pink-800' />
                <p>Somethig went wrong!</p>
              </CardBody>
            </Card>
        ) : ( 
          item.current.data.total === 0 ? (
            <Card className='flex items-center col-span-5'>
              <CardBody className='flex items-center'>
                <HeartCrack className='text-pink-800' />
                <p>No Todo List!</p>
              </CardBody>
            </Card>
          ) : (
            <>
              {item.current.data.lists.map((todoList) => (
                <TodoListCard name={todoList.name} to={todoList.id} />
              ))}
            </>  
          )
        )}
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
                  onChange={(e) => setNewTodoList(e.target.value)}
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="flat" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={addTodoList}>
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
