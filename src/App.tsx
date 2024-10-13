import { useState } from "react";

type Todo = {
  value:string,
  readonly Id:number;
  checked:boolean;
  removed:boolean;
};

type Filter = "all" | "checked" | "unchecked" | "removed";

export const App = () => {
  const [text,setText] = useState("");
  const [Todos,setTodos] = useState<Todo[]>([]);
  const [filter,setFilter] = useState<Filter>("all");

  const handleFilter = (filter:Filter) =>{
    setFilter(filter);
  };

  const filterdTodos = Todos.filter((todo) => {
    switch (filter) {
      case 'all':
        return !todo.removed;
      case 'checked':
        return !todo.removed && todo.checked;
      case 'unchecked':
        return !todo.removed && !todo.checked;
      case 'removed':
        return todo.removed;
      default:
        return todo;
      
    }
  })

  const handleSubmit = () => {
    if(!text) return;

    const newTodo:Todo ={
      value:text,
      Id: new Date().getTime(),
      checked: false,
      removed: false,
    }
    setTodos((Todos) => [newTodo, ...Todos]);
    setText("");
  };

  const handleChange = (e:React.ChangeEvent<HTMLInputElement>) =>{
    setText(e.target.value);
  };

  const handleEdit = (Id:number,value:string) => {
    setTodos((Todos)=> {
      const newTodos = Todos.map((todo)=> {
        if(todo.Id === Id){
          todo.value = value;

          return {...todo,value:value}
        }

        return todo;
      })
      return newTodos
    })
  };

  const handleCheck = (id: number, checked: boolean) => {
    setTodos((todos) => {
      const newTodos = todos.map((todo) => {
        if (todo.Id === id) {
          return { ...todo, checked };
        }
        return todo;
      });

      return newTodos;
    });
  };

  const handleRemove = (id:number,removed:boolean) =>{
    setTodos((todos)=>{
      const newTodos = todos.map((todo)=>{
        if(todo.Id === id){
          return {...todo, removed};
        }
        return todo;
      });

      return newTodos;
    });
  };
  
  const handleEmpty =()=> {
    setTodos((todos) => todos.filter((todo)=> !todo.removed));
  };
  
  return (
    <div>
      <select defaultValue="all" onChange={(e) => handleFilter(e.target.value as Filter)}>
        <option value="all">すべてのタスク</option>
        <option value="checked">完了したタスク</option>
        <option value="unchecked">現在のタスク</option>
        <option value="removed">ごみ箱</option>
      </select>
      {filter === 'removed' ? (
      <button 
        onClick={handleEmpty}
        disabled={Todos.filter((todo) => todo.removed).length === 0}
      >
        ごみ箱を空にする
      </button>
    ) : (
      filter !== 'checked' && (
      <form 
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
          <input 
            type="text" 
            value={text} 
            onChange={(e) => handleChange(e)} 
          />
          <input
            type="submit"
            value="追加"
            onSubmit={(e) => e.preventDefault()}
          />
      </form>
      )
    )}
      {/* <p>{text}</p> */}
      <ul>
        {filterdTodos.map((todo) => {
          return (
            <li key={todo.Id}>
              <input 
                type="checkbox"
                disabled={todo.removed}
                checked={todo.checked}
                onChange={()=> handleCheck(todo.Id,!todo.checked)}
               />
              <input 
              type="text"
              disabled={todo.checked || todo.removed}
              value={todo.value}
              onChange={(e)=> {
                e.preventDefault();
                handleEdit(todo.Id,e.target.value);
              }} 
              />
              <button
                onClick={()=>handleRemove(todo.Id,!todo.removed)}
              >
                {todo.removed ? "復元":"削除"}
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  );
};