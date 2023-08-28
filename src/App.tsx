import { useState, useEffect } from 'react'
import './App.css'
import { Header } from './components/Header'
import { TodoComponent } from './components/TodoComponent';
import axios from 'axios';
import { Pagination } from './components/Pagination';

interface Todo {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  completed: boolean;
}

interface TodoResponse {
  entries: Todo[];
  count: number
}

function App() {
  const [editMode, setEditMode] = useState(false);
  const [showCompleted, setShowCompleted] = useState(false);
  const [todoList, setTodoList] = useState<Todo[]>([]);
  const [todoTitle, setTodoTitle] = useState("");
  const [todoDescription, setTodoDescription] = useState("");
  const [currId, setCurrId] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [todosPerPage, setTodosPerPage] = useState(5);
  const [searchTerm, setsearchTerm] = useState("");

  const showTodos = async () => {
    try {
      const { data } = await axios.get<TodoResponse>('http://192.168.100.3:4000/tasks');
      setTodoList(data.entries);
    } catch (error) {
      console.log(error);
    }
  };

  const showTodosFilteredTodos = async (completed: boolean) => {
    try {
      if (completed) {
        const { data } = await axios.get<TodoResponse>('http://192.168.100.3:4000/tasks?completed=true');
        setTodoList(data.entries);
      } 
    } catch (error) {
      console.log(error);
    }
  };

  const showTodosFilteredSearchTodos = async () => {
    try {
      if(searchTerm){
        const { data } = await axios.get<TodoResponse>(`http://192.168.100.3:4000/tasks?search=${searchTerm}`);
        if(data.entries.length == 0){
          alert("No se encontro data")
          showTodos()
        }
        setTodoList(data.entries);
        setsearchTerm('')
      } else {
        showTodos()
      }

    } catch (error) {
      console.log(error);
    }
  };

  const addTodo = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    try {
      const add = await axios.post('http://192.168.100.3:4000/tasks', { title: todoTitle, description: todoDescription });
      if (add.status == 201) {
        setTodoTitle('');
        setTodoDescription('');
        showTodos();

      } else {
        alert('The todo was not saved')
      }

    } catch (error) {
      console.log(error);
    }
  };

  const onDelete = async (id: string) => {
    try {
      const todoDelete = await axios.delete(`http://192.168.100.3:4000/tasks/${id}`);
      if (todoDelete.status == 204) {
        showTodos();

      } else {
        alert('The todo was not deleted')
      }

    } catch (error) {
      console.log(error);
    }
  }

  const onEdit = async (id:string) => {
    setEditMode(true);
    try {
      const { data } = await axios.get<Todo>(`http://192.168.100.3:4000/tasks/${id}`);
      setTodoTitle(data.title);
      setTodoDescription(data.description);
      setCurrId(data.id);
    } catch (error) {
      console.log(error)
    }
  }

  const editTodo = async () => {
    setEditMode(false);
    try {
      console.log("Edit send")
      const response = await axios.put<Todo>(`http://192.168.100.3:4000/tasks/${currId}`,{title: todoTitle, description:todoDescription});
      setTodoTitle("");
      setTodoDescription("");
      setEditMode(false)
    } catch (error) {
      console.log(error)
    }
  }

  const setCompleted = async (id: string, completed:boolean) => {
    try {
      if(completed == true){
        const { data } = await axios.put<Todo>(`http://192.168.100.3:4000/tasks/${id}`, { completed: true });
        showTodos();
      } else {
        const { data } = await axios.put<Todo>(`http://192.168.100.3:4000/tasks/${id}`, { completed: false });
        showTodos();
      }

    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    showTodos()
  }, [])

  useEffect(() => {
    if (showCompleted == true) {
      showTodosFilteredTodos(true)
    } else {
      showTodosFilteredTodos(false)
    }
  }, [showCompleted])

  const lastTodoIndex = currentPage * todosPerPage;
  const firtsTodoIndex = lastTodoIndex - todosPerPage;

  // let currentTodos = todoList.slice(firtsTodoIndex, lastTodoIndex);
  return (
    <>
      <Header />
      <div className="container">

        <div className="form" style={{ margin: "1rem 0" }}>
          <form>
            <div className="form-wrapper" style={{ display: "flex", justifyContent: "space-between" }}>
              <div style={{ flex: 1, marginRight: ".5rem" }}>
                <input onChange={(e) => setTodoTitle(e.target.value)} type="text" className='form-control' placeholder='Todo Title' name='todoTitle' value={todoTitle}  required/>
              </div>
              <div style={{ flex: 1 }}>
                <input onChange={(e) => setTodoDescription(e.target.value)} type="text" className='form-control' placeholder='Todo Description' name='todoDescription' value={todoDescription}  required />
              </div>
              {
                editMode ? (
                  <button type='submit' style={{ width: "200px", marginLeft: ".5rem" }} className='btn btn-primary' onClick={()=> editTodo()}>+ Edit</button>

                ) : (
                  <button type='submit' style={{ width: "200px", marginLeft: ".5rem" }} className='btn btn-success' onClick={(e)=>  addTodo(e)}>+ Add</button>

                )
              }
            </div>
            <div className="mb-3 mt-3 d-flex ">
              <input type="text" className="form-control" placeholder="Buscar" onChange={(e) => setsearchTerm(e.target.value)} value={searchTerm}  />
              <a className='btn btn-primary' style={{marginLeft:".5rem"}} onClick={()=> showTodosFilteredSearchTodos()}>Buscar</a>
            </div>
            <div className="form-check form-switch mt-2">
              <input className="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckChecked" onChange={(e) => {
                setShowCompleted(e.target.checked)
              }} />
              <label className="form-check-label" htmlFor="flexSwitchCheckChecked">Show only completed Todos</label>
            </div>

          </form>

          <div>
            {
              todoList.length>0 ? todoList.slice(firtsTodoIndex, lastTodoIndex).map((todo) => (<TodoComponent completed={todo.completed} createdAt={todo.createdAt} description={todo.description} title={todo.title} updatedAt={todo.updatedAt} id={todo.id} onDelete={onDelete} onEdit={onEdit} setCompleted={setCompleted} key={todo.id} />)) : (<p>No se encontraron datos...</p>)
            }
          </div>

          <Pagination totalTodos={todoList.length} todosPerPage={todosPerPage} setCurrentPage={setCurrentPage} currentPage={currentPage} />

        </div>
      </div>
    </>
  )
}

export default App
