import React, { useState, useEffect, useReducer, useRef } from 'react';
import HomeLayout from "../layouts/HomeLayout"
import { useParams } from 'react-router-dom';
import {Pagination, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Card, CardBody, useDisclosure, Modal, ModalFooter, ModalContent, ModalHeader, ModalBody, Input, Button, Checkbox, Spinner} from "@nextui-org/react";
import { Plus, ListTodo, ChevronLeft, Trash2 } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { TodoList, Todos, Todo, TodosResponse } from '../utils/types';

const complated = (state: any) => {return (<Checkbox defaultSelected={state}/>)}

function TodoListPage() {
    const {id} = useParams<TodoList | any>();
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const [page, setPage] = React.useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [newTodo, setNewTodo] = useState('');
    const [isAdded, setIsAdded] = useState(false);
    const rowsPerPage = 15;
    
    const notify = () => toast.success('Todo added successfully!', {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
    });

    const renderCell = React.useCallback((row: Todo) => {
        return (
            <TableRow key={row.id}>
                <TableCell>{complated(row.completed)}</TableCell>
                <TableCell>{row.todo}</TableCell>
                <TableCell className='text-danger'><Button variant='ghost' color='danger'><Trash2 /></Button></TableCell>
            </TableRow>
        )
    }, []);

    // Add Todo
    const addTodo = () => {
        const data = {todo: newTodo, completed: false, userId: 1};
        setIsAdded(true);
        return fetch("https://dummyjson.com/todos/add", {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        .then(res => res.json())
        .then(data => setPage(1))
        .then(() => isOpen ? onOpenChange() : null)
        .then(() => notify())
        .then(() => setIsAdded(false))
        .catch(err => console.log(err))
    }

    // get data from api
    const item = useRef<TodosResponse>({
        data: {todos: [], total: 0, skip: 0, limit: 0,},
        isLoading: false,
        isError: false,
        mutate: null,
    });

    useEffect(() => {
        setIsLoading(true);
        setIsError(false);
        fetch(`https://dummyjson.com/todos?limit=${rowsPerPage}&skip=${(page - 1) * rowsPerPage}`)
        .then(res => res.json())
        .then(data => {
            item.current.data = data;
            setIsLoading(false);
            setIsError(false);
        })
        .catch(err => {
            setIsLoading(false);
            setIsError(true);
        })
    }, [page]);

    const backToPage = () => {
        window.history.back();
    }

    const pages = Math.ceil(item.current.data.total / rowsPerPage);

    return (
        <>
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
            <Card isPressable className='flex items-center' onPress={backToPage}>
                <CardBody>
                    <ChevronLeft />
                    <p>Todo Lists</p>
                </CardBody>
            </Card>
            <Card className='flex items-center col-span-4'>
                <CardBody>
                    <p className='text-2xl font-semibold'>Market Alışverişi</p>
                </CardBody>
            </Card>
            <Card isPressable className='flex items-center' onPress={onOpen}>
                <CardBody>
                    <Plus />
                    <p>Create Todo</p>
                </CardBody>
            </Card>
            <Table aria-label="Example empty table" className='col-span-6'
                bottomContent={
                    <div className="flex w-full justify-center">
                    <Pagination
                        isCompact
                        showControls
                        showShadow
                        color="primary"
                        page={page}
                        total={pages}
                        onChange={(page) => setPage(page)}
                    />
                    </div>
                }
                classNames={{
                    wrapper: "min-h-[222px]",
                }}
            >
                <TableHeader>
                    <TableColumn>Status</TableColumn>
                    <TableColumn>Todo</TableColumn>
                    <TableColumn>Action</TableColumn>
                </TableHeader>
                <TableBody 
                    emptyContent={"No rows to display."}
                    isLoading={isLoading}
                    loadingContent={<Spinner size="lg" />}
                >
                    {item.current.data.todos.map((row: Todo) => renderCell(row))}
                </TableBody>
            </Table>
            <Modal 
                isOpen={isOpen} 
                placement={'center'}
                onOpenChange={onOpenChange} 
            >
                <ModalContent>
                {(onClose) => (
                    <>
                    <ModalHeader className="flex flex-col gap-1">Add Todo</ModalHeader>
                    <ModalBody>
                        {isAdded ? <Spinner size="lg" /> : 
                            <Input
                            autoFocus
                            endContent={
                                <ListTodo className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                            }
                            label="Todo"
                            placeholder="Enter todo"
                            variant="bordered"
                            onChange={(e) => setNewTodo(e.target.value)}
                            />
                        }
                    </ModalBody>
                    <ModalFooter>
                        <Button color="danger" variant="flat" onPress={onClose}>
                        Close
                        </Button>
                        <Button color="primary" onPress={addTodo}>
                            Create
                        </Button>
                    </ModalFooter>
                    </>
                )}
                </ModalContent>
            </Modal>
        </HomeLayout>
        </>
    );
}

export default TodoListPage;

