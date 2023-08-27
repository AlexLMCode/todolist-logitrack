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

function App() {
  const [editMode, setEditMode] = useState(false);
  const [showCompleted, setShowCompleted] = useState(false);
  const [todoList, setTodoList] = useState<Todo[]>([]);
  const [todoTitle, setTodoTitle] = useState("");
  const [todoDescription, setTodoDescription] = useState("");
  const [userId, setuserId] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [todosPerPage, setTodosPerPage] = useState(5);

  const showTodos = async () => {
    try {
      const { data } = await axios.get<Todo[]>('/api/show/todos');
      setTodoList(data);
    } catch (error) {
      console.log(error);
    }
  };

  const addTodo = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    try {
      const add = await axios.post('/api/create/todo', { todoTitle, todoDescription });
      if (add.status == 200) {
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
      const todoDelete = await axios.delete(`/api/delete/todo/${id}`);
      if (todoDelete.status == 200) {
        showTodos();

      } else {
        alert('The todo was not deleted')
      }

    } catch (error) {
      console.log(error);
    }
  }

  const onEdit = async () => {
    setEditMode(true);
    try {
      const { data } = await axios.get<Todo>(`/api/todo/${userId}`);
      setTodoTitle(data.title);
      setTodoDescription(data.description);
      setuserId(data.id);
    } catch (error) {
      console.log(error)
    }
  }





  const setCompleted = async (id: string) => {
    try {
      const { data } = await axios.put<Todo>(`/api/todo/${id}`, {completed:true});
      showTodos();
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    showTodos()
  }, [])

  useEffect(() => {
    if (showCompleted == true) {
      setTodoList(todoList.filter((todo) => todo.completed == true))
    } else {
      setTodoList(todoList.filter((todo) => todo.completed == false))
    }
  }, [showCompleted])

  const lastTodoIndex = currentPage * todosPerPage;
  const firtsTodoIndex = lastTodoIndex - todosPerPage;

  const currentTodos = todoList.slice(firtsTodoIndex, lastTodoIndex);
  return (
    <>
      <Header />
      <div className="container">

        <div className="form" style={{ margin: "1rem 0" }}>
          <form onSubmit={editMode ? onEdit : addTodo}>

            <div className="form-wrapper" style={{ display: "flex", justifyContent: "space-between" }}>
              <div style={{ flex: 1, marginRight: ".5rem" }}>
                <input onChange={(e) => setTodoTitle(e.target.value)} type="text" className='form-control' placeholder='Todo Title' name='todoTitle' />
              </div>
              <div style={{ flex: 1 }}>
                <input onChange={(e) => setTodoDescription(e.target.value)} type="text" className='form-control' placeholder='Todo Description' name='todoDescription' />
              </div>
              {
                editMode ? (
                  <button type='submit' style={{ width: "200px", marginLeft: ".5rem" }} className='btn btn-primary'>+ Edit</button>

                ) : (
                  <button type='submit' style={{ width: "200px", marginLeft: ".5rem" }} className='btn btn-success'>+ Add</button>

                )
              }
            </div>
            <div className="form-check form-switch mt-2">
              <input className="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckChecked" onChange={(e) => setShowCompleted(!showCompleted)} />
              <label className="form-check-label" htmlFor="flexSwitchCheckChecked">Show Completed Todos</label>
            </div>
          </form>

          <div>
            {/* {
              currentTodos && currentTodos.map((todo) => (<TodoComponent completed={todo.completed} createdAt={todo.createdAt} description={todo.description} title={todo.title} updatedAt={todo.updatedAt} id={todo.id} onDelete={onDelete} onEdit={onEdit} setCompleted={setCompleted} />))
            } */}
            {
              
            }
            <TodoComponent createdAt='2023' description='Todo descrition' title='Titulo!' updatedAt='2024' onDelete={onDelete} onEdit={setuserId} setCompleted={setCompleted} id='123' completed={true} />
          </div>

          <Pagination totalTodos={todoList.length} todosPerPage={todosPerPage} setCurrentPage={setCurrentPage} currentPage={currentPage}/>

        </div>
      </div>
    </>
  )
}

export default App
