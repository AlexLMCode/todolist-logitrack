interface TodoComponentProps {
    id:string;
    title:string;
    description:string;
    createdAt: string;
    updatedAt: string;
    completed:boolean;
    onDelete: (id:string)=>void;
    onEdit: (id:string)=>void;
    setCompleted: (id:string)=>void;
}


export const TodoComponent = ({
    id,title,completed, description,createdAt, updatedAt, onDelete, onEdit,setCompleted
}:TodoComponentProps) => {
    console.log(completed)
  return (
    <section className="p-4 d-flex w-100 justify-content-between align-items-center">
        <div className="todoInfo" style={{textDecoration: completed ? "line-through" : "auto"}}>
            <div className="todoTitle d-flex flex-column gap-1">
                <b className="fs-1">{title}</b>
                <p>{description}</p>
            </div>
            <div className="todoUdpdateInfo d-flex gap-1">
                <p><b>Creado:</b> {createdAt}</p>
                <p><b>Editado:</b> {updatedAt}</p>
            </div>
        </div>
        <div className="d-flex gap-1">
            <button className="btn" onClick={()=>onEdit(id)}>
                <i className="fa-solid fa-pen-to-square" style={{color:"blue", cursor:"pointer"}}></i>
            </button>
            <button className="btn" onClick={()=>onDelete(id)}>
            <i className="fa-solid fa-trash-can" style={{color:"red", cursor:"pointer"}}></i>
            </button>
            <button className="btn" onClick={()=>setCompleted(id)}>
            <i className="fa-solid fa-check" style={{color:"green", cursor:"pointer"}}></i>
            </button>
        </div>
    </section>
  )
}
