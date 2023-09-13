import React, { useState, useEffect, useReducer, useRef } from 'react';
import HomeLayout from "../layouts/HomeLayout"
import { useParams } from 'react-router-dom';
import {Pagination, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Card, CardBody, useDisclosure, Modal, ModalFooter, ModalContent, ModalHeader, ModalBody, Input, Button, Checkbox, Spinner, Select, SelectItem} from "@nextui-org/react";
import { Plus, ListTodo, ChevronLeft, Trash2, SignalHigh, SignalMedium, SignalLow } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { TodoList, Todos, Todo, TodosResponse } from '../utils/types';

const priority = [
    {label: "Urgent", value: "Urgent"},
    {label: "Meduim", value: "Meduim"},
    {label: "Low", value: "Low"},
]

function TodoListPage() {
    const {id} = useParams<TodoList | any>();
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const [page, setPage] = React.useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [newTodo, setNewTodo] = useState('');
    const [newTodoPriority, setNewTodoPriority] = useState('');
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

    const complated = (state: any, id: string) => {
        return (
            <Checkbox defaultSelected={state} onValueChange={(e) => handleCheckboxChange(e, id)} />
        )
    }

    const handleCheckboxChange = (e: any, id: any) => {
        updateTodo(id, e);
    }

    const renderCell = React.useCallback((row: Todo) => {
        return (
            <TableRow key={row.id}>
                <TableCell>{complated(row.isCompleted, row.id)}</TableCell>
                <TableCell>{row.text}</TableCell>
                <TableCell>
                    {row.status === "Urgent" ? 
                        <><SignalHigh className='text-danger'/><h1 className='text-danger'>Urgent</h1></>
                        : row.status === "Meduim" ? 
                        <><SignalMedium className='text-warning'/><h1 className='text-warning'>Medium</h1></>
                        : 
                        <><SignalLow className='text-success'/> <h1 className='text-success'>Low</h1></>
                    }
                </TableCell>
                <TableCell className='text-danger'><Button variant='ghost' color='danger'><Trash2 /></Button></TableCell>
            </TableRow>
        )
    }, []);

    // Add Todo
    const addTodo = () => {
        const data ={
            "id": 0,
            "text": newTodo,
            "isCompleted": false,
            "status": newTodoPriority,
            "listId": id
        }
        setIsAdded(true);
        fetch(`https://localhost:7049/api/todo`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        .then(res => {
            if (!res.ok) {
                throw new Error("Network response was not ok");
            }
            return res.json();
        })
        .then(data => {
            console.log(data);
            notify();
            setIsAdded(false);
            setNewTodoPriority('');
            setNewTodo('');
            onOpenChange();
            setIsLoading(true);
            item.current.data.todos.push(data);
            setIsLoading(false);
        })
        .catch(err => {
            console.log(err)
        })
    }

    // Update Todo
    const updateTodo = (itemid: string, e: any) => {
        // put data to api
        const data ={
            "isCompleted": e,
        }

        fetch(`https://localhost:7049/api/todo/${itemid}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        .then(res => {
            if (!res.ok) {
                throw new Error("Network response was not ok");
            }
            return res.json();
        })
        .then(data => {
            console.log(data);
        })
        .catch(err => {
            console.log(err)
        })
    }

    // get data from api
    const item = useRef<TodosResponse>({
        data: {todos: [], total: 0, skip: 0, limit: 0,},
        isLoading: false,
        isError: false,
        mutate: null,
        list: {id: '0', name: ''}
    });

    useEffect(() => {
        setIsLoading(true);
        setIsError(false);

        if (!id) {
            backToPage();
        }

        // Control the list id exists
        fetch(`https://localhost:7049/api/list/` + id)
        .then(res => {
            if (!res.ok) {
                throw new Error("Network response was not ok");
            }
            return res.json();
        })
        .then(data => {
            console.log(data);
            if (data.id === undefined) {
                console.log("undefined error");
            } else {
                item.current.list = data;
            }
        })
        .catch(err => {
            console.log(err)
        })


        fetch(`https://localhost:7049/api/list/${id}/todos?limit=${rowsPerPage}&skip=${(page - 1) * rowsPerPage}`)
        .then(res => res.json())
        .then(data => {
            console.log(data)
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
                    <TableColumn>Priority</TableColumn>
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
                        <>
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
                            <Select 
                                label="Select an priority" 
                                className="w-full" 
                                onChange={(e) => setNewTodoPriority(e.target.value)}
                            >
                                {priority.map((item) => (
                                <SelectItem key={item.value} value={item.value}>
                                    {item.label}
                                </SelectItem>
                                ))}
                            </Select>
                        </>                
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

