import "./index.css";
import { ClassRoomForm } from "./components/ClassRoomForm";
import { QueryClient, QueryClientContext } from "@tanstack/react-query";
import { ClassRoomList } from "./components/ClassRoomList";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientContext.Provider value={queryClient}>
      <div className="mx-auto dark:bg-gray-950 min-h-screen">
        <header className="p-4 border-b-2 dark:bg-primary border-gray-400 shadow">
          <h1 className="mt-2 text-4xl font-colaba text-primary dark:text-white">
            [ INSIDE ] University
          </h1>
        </header>
        <div className="container mx-auto">
          <div className="mt-4 py-3 bg-slate-50 dark:bg-slate-500 dark:text-slate-50">
            <h2 className="text-center text-2xl font-bold">
              Register New Class
            </h2>
            <div className="mt-4 flex justify-center">
              <ClassRoomForm />
            </div>
          </div>
          <div className="mt-4 p-4 bg-slate-100 dark:bg-slate-600 dark:text-slate-50">
            <h2 className="text-center text-2xl font-bold">Classrooms</h2>
            <ClassRoomList />
          </div>
        </div>
      </div>
    </QueryClientContext.Provider>
  );
}

export default App;
