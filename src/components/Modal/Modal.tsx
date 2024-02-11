import React, { useState } from "react";
import { X } from "react-feather";
import { useMutation } from "@apollo/client";
import { IModal } from "../../interfaces/interfaces";
import { ADD_TASK, ALL_TASKS } from "../../apollo/tasks";

import styles from "./Modal.module.scss";

const Modal = ({
  setIsModalOpen,
  cardTitle,
  cardDescription,
  cardId,
  onUpdateTask,
}: IModal) => {
  const [title, setTitle] = useState<string>(cardTitle || "");
  const [description, setDesc] = useState<string>(cardDescription || "");

  const [createTask, { error }] = useMutation(ADD_TASK, {
    update(cache, { data: { newTask } }) {
      const { tasks }: any = cache.readQuery({ query: ALL_TASKS });

      cache.writeQuery({
        query: ALL_TASKS,
        data: {
          tasks: [newTask, ...tasks],
        },
      });
    },
  });

  const handleAddTodo = () => {
    if (title.length && description.length) {
      createTask({
        variables: {
          status: "To Do",
          creationDate: new Date().getTime().toString(),
          title: title,
          description: description,
          isDone: false,
        },
      });
      setTitle("");
      setDesc("");
    }
  };

  const onSubmit = () => {
    cardTitle && cardDescription && onUpdateTask
      ? onUpdateTask({
          variables: { id: cardId, title, description },
        })
      : handleAddTodo();

    setIsModalOpen(false);
  };

  if (error) {
    return <h2 className={styles.error}>Error...</h2>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.modal}>
        <div className={styles.closeIcon}>
          <X onClick={() => setIsModalOpen(false)} />
        </div>
        <form className={styles.form} onSubmit={onSubmit}>
          <input
            className={styles.input}
            type="text"
            placeholder={cardTitle ? cardTitle : "Title"}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <input
            className={styles.input}
            type="text"
            placeholder={cardDescription ? cardDescription : "Description"}
            value={description}
            onChange={(e) => setDesc(e.target.value)}
            required
          />
          <button className={styles.submitButton} type="submit">
            {onUpdateTask ? "Update" : "Create"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Modal;
