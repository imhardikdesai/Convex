"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

export default function Home() {
  const tasksQuery = useQuery(api.queries.tasks.get);
  const [newTaskText, setNewTaskText] = useState("");
  const [editingTaskId, setEditingTaskId] = useState<Id<"tasks"> | null>(null);
  const [editedTaskText, setEditedTaskText] = useState("");

  const createTask = useMutation(api.mutations.tasks.createTask);
  const deleteTask = useMutation(api.mutations.tasks.deleteTask);
  const updateTask = useMutation(api.mutations.tasks.updateTask);

  const handleAddTask = async () => {
    if (newTaskText.trim() !== "") {
      await createTask({ text: newTaskText });
      setNewTaskText("");
    }
  };
  const handleEditTask = (taskId: Id<"tasks">, text: string) => {
    setEditingTaskId(taskId);
    setEditedTaskText(text);
  };

  const handleUpdateTask = async (taskId: Id<"tasks">) => {
    if (editedTaskText.trim() !== "") {
      await updateTask({ taskId, text: editedTaskText });
      setEditingTaskId(null);
    }
  };

  const handleDeleteTask = async (taskId: Id<"tasks">) => {
    await deleteTask({ taskId });
  };

  return (
    <main className="flex flex-col items-center mt-8">
      <h1 className="text-3xl font-bold mb-4">To-Do App</h1>
      <div className="w-96 flex items-center">
        <input
          type="text"
          className="w-full border-b-2 border-gray-400 focus:outline-none focus:border-blue-500 py-1 px-2"
          placeholder="Add a new task..."
          value={newTaskText}
          onChange={(e) => setNewTaskText(e.target.value)}
        />
        <button
          className="ml-2 bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600 focus:outline-none"
          onClick={handleAddTask}
        >
          Add
        </button>
      </div>
      <ul className="mt-4 w-96">
        {tasksQuery?.map(({ _id, text }) => (
          <li
            key={_id}
            className="flex justify-between items-center py-2 border-b border-gray-300"
          >
            {editingTaskId === _id ? (
              <>
                <input
                  type="text"
                  className="w-full border-b-2 border-gray-400 focus:outline-none focus:border-blue-500 py-1 px-2"
                  value={editedTaskText}
                  onChange={(e) => setEditedTaskText(e.target.value)}
                />
                <button
                  className="ml-2 bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600 focus:outline-none"
                  onClick={() => handleUpdateTask(_id)}
                >
                  Update
                </button>
              </>
            ) : (
              <>
                <span>{text}</span>
                <div className="flex">
                  <button
                    className="bg-yellow-500 text-white px-2 py-1 rounded mr-2 hover:bg-yellow-600 focus:outline-none"
                    onClick={() => handleEditTask(_id, text)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 focus:outline-none"
                    onClick={() => handleDeleteTask(_id)}
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </main>
  );
}
