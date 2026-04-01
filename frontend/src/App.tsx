
import { useState } from "react";
import { TaskForm } from "./components/TaskForm";
import { TaskList } from "./components/TaskList";
import { Main } from "./pages/Main";

function App() {
  const [refresh, setRefresh] = useState(false);

  function reload() {
    setRefresh(!refresh);
  }
  return (
    // <div className="min-h-screen bg-gray-100 flex items-center justify-center">
    //   <div className="w-full max-w-md bg-white p-6 rounded-2xl shadow-lg">
    //     <h1 className="text-3xl font-bold mb-4 text-center">
    //       Minhas tarefas
    //     </h1>
       
    //     <TaskForm onTaskCreated={reload} />
    //     <TaskList refresh={refresh} />
    //   </div>
    // </div>
    <Main />
  );
}

export default App;
