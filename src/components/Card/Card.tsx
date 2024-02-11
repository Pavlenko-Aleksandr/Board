import { useState } from "react";
import { ICard } from "../../interfaces/interfaces";
import Modal from "../Modal/Modal";

import styles from "./Card.module.scss";

const Card = ({
  task,
  onDragStart,
  onDragEnd,
  onRemoveTask,
  onUpdateTask,
}: ICard) => {
  const { id, status, title, description } = task;
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  return (
    <>
      <div
      className={styles.card}
        id={id}
        draggable
        onDragStart={(e) => onDragStart(e)}
        onDragEnd={(e) => onDragEnd(e)}
      >
        <div onClick={() => setIsModalOpen(!isModalOpen)}>
          <div className={styles.status}>
            {status}
          </div>
          <div className={styles.title}>{title}</div>
          <div className={styles.description}>{description}</div>
        </div>
        <button className={styles.button} onClick={() => onRemoveTask({ variables: { id } })}>
          DELETE
        </button>
      </div>
      {isModalOpen && (
        <Modal
          setIsModalOpen={setIsModalOpen}
          cardTitle={task.title}
          cardDescription={task.description}
          cardId={task.id}
          onUpdateTask={onUpdateTask}
        />
      )}
    </>
  );
};

export default Card;
