import React, { useState, DragEvent } from "react";
import { useMutation, useQuery } from "@apollo/client";
import Column from "../Column/Column";
import Modal from "../Modal/Modal";
import { titles } from "../../data";
import { ALL_TASKS, DELETE_TASK, UPDATE_TASK } from "../../apollo/tasks";

import styles from "./Dashboard.module.scss";

const Dashboard = () => {
  const { loading, error, data } = useQuery(ALL_TASKS);
  const [removeTask, { error: removeError }] = useMutation(DELETE_TASK, {
    update(cache, { data: { removeTask } }) {
      cache.modify({
        fields: {
          allTasks(currentTasks = []) {
            return currentTasks.filter(
              (task: any) => task.__ref !== `Task:${removeTask.id}`
            );
          },
        },
      });
    },
  });
  const [updateTask, { error: updateError }] = useMutation(UPDATE_TASK);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const onDragStart = (e: DragEvent<HTMLDivElement>) => {
    let element = e.currentTarget;
    element.classList.add("dragged");
    e.dataTransfer.setData("text/plain", e.currentTarget?.id);
    e.dataTransfer.effectAllowed = "move";
  };

  const onDragEnd = (e: DragEvent<HTMLDivElement>) => {
    e.currentTarget.classList.remove("dragged");
  };

  const onDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    let element = e.currentTarget;
    element.classList.add("dragged-over");
    e.dataTransfer.dropEffect = "move";
  };

  const onDragLeave = (e: DragEvent<HTMLDivElement>) => {
    let currentTarget = e.currentTarget;
    let newTarget = e.relatedTarget as HTMLElement;
    if (newTarget?.parentNode === currentTarget || newTarget === currentTarget)
      return;
    e.preventDefault();
    let element = e.currentTarget;
    element.classList.remove("dragged-over");
  };

  const onDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const onDrop = (e: DragEvent<HTMLDivElement>, status: string) => {
    e.preventDefault();
    e.currentTarget.classList.remove("dragged-over");
    const data = e.dataTransfer.getData("text/plain");
    const isDone = status === "Done";
    updateTask({ variables: { id: data, status, isDone } });
  };

  if (loading) {
    return <h2 className={styles.loading}>Loading...</h2>;
  }

  if (error || removeError || updateError) {
    return <h2 className={styles.error}>Error...</h2>;
  }

  return (
    <div className={styles.dashboard}>
      <button className={styles.addButton} onClick={() => setIsModalOpen(true)}>
        Add new task
      </button>
      {data ? (
        titles.map((title) => (
          <div
            onDragLeave={(e) => onDragLeave(e)}
            onDragEnter={(e) => onDragEnter(e)}
            onDragEnd={(e) => onDragEnd(e)}
            onDragOver={(e) => onDragOver(e)}
            onDrop={(e) => onDrop(e, title)}
            key={title}
          >
            <section>
              <div>
                <Column
                  title={title}
                  tasks={data.tasks}
                  onDragStart={onDragStart}
                  onDragEnd={onDragEnd}
                  onRemoveTask={removeTask}
                  onUpdateTask={updateTask}
                />
              </div>
            </section>
          </div>
        ))
      ) : (
        <h2 className={styles.loading}>Loading...</h2>
      )}
      {isModalOpen && <Modal setIsModalOpen={setIsModalOpen} />}
    </div>
  );
};

export default Dashboard;
