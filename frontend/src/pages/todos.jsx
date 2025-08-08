import { useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import getAxiosClient from "../axios-instance";

export default function Todos() {
  const modalRef = useRef();
  const queryClient = useQueryClient();

  const { data, isError, isLoading } = useQuery({
    queryKey: ["todos"],
    queryFn: async () => {
      const axiosInstance = await getAxiosClient();
      const { data } = await axiosInstance.get("http://localhost:8080/todos");
      return data;
    },
  });

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const { mutate: createNewTodo } = useMutation({
    mutationKey: ["newTodo"],
    mutationFn: async (newTodo) => {
      const axiosInstance = await getAxiosClient();
      const { data } = await axiosInstance.post("http://localhost:8080/todos", newTodo);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["todos"]);
    },
  });


   const { mutate: markAsCompleted } = useMutation({
    mutationKey: ["markAsCompleted"],
    mutationFn: async (todoId) => {
      const axiosInstance = await getAxiosClient();

      const { data } = await axiosInstance.put(`http://localhost:8080/todos/${todoId}/completed`);

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries("todos");
    }
  });


  function toggleNewTodoModal() {
    if (modalRef.current) {
      modalRef.current.open
        ? modalRef.current.close()
        : modalRef.current.showModal();
    }
  }

  const handleNewTodo = (values) => {
    createNewTodo(values);
    toggleNewTodoModal();
  };

  function onSubmit(data) {
    console.log("Todo submitted:", data);
    handleNewTodo(data);
    reset();
  }

  return (
    <>
      <dialog ref={modalRef} className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">New Todo</h3>
          <form onSubmit={handleSubmit(onSubmit)}>
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">Name of Todo</span>
              </div>
              <input
                {...register("name")}
                type="text"
                placeholder="Type here"
                className="input input-bordered w-full"
              />
            </label>
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">Description</span>
              </div>
              <input
                {...register("description")}
                type="text"
                placeholder="Type here"
                className="input input-bordered w-full"
              />
            </label>
            <div className="modal-action">
              <button type="submit" className="btn btn-primary">
                Create Todo
              </button>
              <button type="button" onClick={toggleNewTodoModal} className="btn btn-ghost">
                Close
              </button>
            </div>
          </form>
        </div>
      </dialog>

      
      {isLoading && <p>Loading...</p>}
      {isError && <p>Error loading todos</p>}
      {data && <TodoItemList data={data} markAsCompleted={() => {}} />}
    </>
  );
}

function TodoItemList({ data, markAsCompleted }) {
  return (
    <div className="w-lg h-sm flex column items-center justify-center gap-4">
      {data.success && data.todos && data.todos.length >= 1 && (
        <ul className="flex column items-center justify-center gap-4">
          {data.todos.map((todo) => (
            <li key={todo.id} className="inline-flex items-center gap-4">
              <div className="w-md">
                <h3 className="text-lg">{todo.name}</h3>
                <p className="text-sm">{todo.description}</p>
              </div>
              <div className="w-md">
                <label className="swap">
                  <input
                    type="checkbox"
                    onClick={() => markAsCompleted(todo.id)}
                  />
                  <div className="swap-on">Yes</div>
                  <div className="swap-off">No</div>
                </label>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
