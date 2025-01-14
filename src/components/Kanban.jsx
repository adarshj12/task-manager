import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDrag, useDrop } from "react-dnd";
import { Modal, Button, Input, DatePicker, Whisper, Tooltip } from "rsuite";
import { ColorRing } from "react-loader-spinner";
import "rsuite/dist/rsuite.min.css";
import moment from "moment";
import Column from "./Column";


function Kanban() {
  const [columns, setColumns] = useState({});
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [kanbanFlag, setKanbanFlag] = useState(false);
  const [newTask, setNewTask] = useState({ name: "", dueDate: null });

  useEffect(() => {
    const fetchTasks = async () => {
      await axios.get(`${import.meta.env.VITE_API_URL}/task`).then(res => {
        setColumns(res.data.data);
        setLoading(false)
      }).catch(err => {
        debugger
        console.log(err)
      })
    };
    fetchTasks();
  }, [kanbanFlag]);

  const addTask = async () => {
    if (newTask.name && newTask.dueDate) {
      await axios.post(`${import.meta.env.VITE_API_URL}/task`, {
        task: newTask.name,
        dueDate: newTask.dueDate,
        createdBy: "currentUser"
      }).then(res => {
        if (res.status == 201) {
          const task = {
            _id: res.data.data._id,
            task: newTask.name,
            status: "todo",
            dueDate: newTask.dueDate,
            createdBy: "currentUser",
          };
          setColumns((prev) => ({
            ...prev,
            todo: [...(prev.todo || []), task],
          }));
          setNewTask({ name: "", dueDate: null });
        }
        setKanbanFlag(prev => !prev);
        setModalOpen(false);
      }).catch(err => {
        console.log(err)
      })

    }
  };


  const moveCard = async (task, fromColumn, toColumn) => {
    debugger
    await axios.patch(`${import.meta.env.VITE_API_URL}/task`, {
      taskId: task._id,
      newStatus: toColumn
    }).then(res => {

      setColumns((prev) => {
        if (prev[toColumn]?.some((t) => t._id === task._id)) return prev;

        const sourceTasks = [...prev[fromColumn]];
        const destinationTasks = [...(prev[toColumn] || [])];

        const taskIndex = sourceTasks.findIndex((t) => t._id === task._id);
        if (taskIndex > -1) {
          sourceTasks.splice(taskIndex, 1);
          destinationTasks.push(task);
        }

        return {
          ...prev,
          [fromColumn]: sourceTasks,
          [toColumn]: destinationTasks,
        };
      });
      setKanbanFlag(prev => !prev);
    }).catch(err => {
      debugger
      console.log(err)
    })
  };


  return (
    <div>
      {loading ? <div style={{ display: "flex", justifyContent: "center", marginTop: "100px" }}>
        <ColorRing
          visible={true}
          height="40"
          width="40"
          colors={["#4A90E2", "#4A90E2", "#4A90E2", "#4A90E2", "#4A90E2"]}
        />
      </div> : (Object.keys(columns).length > 0 ? <>
        <Button onClick={() => setModalOpen(true)} appearance="primary">
          Add Task
        </Button>
        <div style={{ display: "flex", gap: "20px", padding: "20px" }}>
          {Object.entries(columns).map(([columnId, tasks]) => (
            <Column
              key={columnId}
              id={columnId}
              title={columnId}
              tasks={tasks}
              moveCard={moveCard}
            />
          ))}
        </div>
      </> : <div style={{ display: "flex", justifyContent: 'center', gap: "20px", padding: "20px" }}>
        <p>No data found</p>
      </div>)}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <Modal.Header>
          <Modal.Title>Create a New Task</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Input
            placeholder="Task Name"
            value={newTask.name}
            onChange={(value) => setNewTask((prev) => ({ ...prev, name: value }))}
            style={{ marginBottom: "10px" }}
          />
          <DatePicker
            disabledDate={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
            placeholder="Select Due Date"
            value={newTask.dueDate}
            onChange={(value) => setNewTask((prev) => ({ ...prev, dueDate: value }))}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={addTask} appearance="primary">
            Add
          </Button>
          <Button onClick={() => setModalOpen(false)} appearance="subtle">
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}


export default Kanban;
