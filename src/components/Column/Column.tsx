import { useEffect, useState } from "react";
import Card from "../Card/Card";
import { IColumn, ITask } from "../../interfaces/interfaces";

import styles from "./Column.module.scss";

const Column = ({
  title,
  tasks,
  onDragStart,
  onDragEnd,
  onRemoveTask,
  onUpdateTask,
}: IColumn) => {
  const [cards, setCards] = useState<ITask[]>([...tasks]);
  const [sortDirection, setSortDirection] = useState("desc");

  useEffect(() => {
    setCards([...tasks]);
  }, [tasks]);

  const sortedCards = cards.sort((a, b) =>
      sortDirection === "asc"
        ? a.creationDate - b.creationDate
        : b.creationDate - a.creationDate
    );

  const handleSort = () => {
    setCards(sortedCards);
    setSortDirection(sortDirection === "asc" ? "desc" : "asc");
  };

  console.log(sortDirection);

  return (
    <div className={styles.column}>
      <div className={styles.header}>
        <h4 className={styles.title}>{title}</h4>

        <button className={styles.orderButton} onClick={handleSort}>
          Organise the cards by date
          {sortDirection === "asc" && <span>&#9660;</span>}
          {sortDirection === "desc" && <span>&#9650;</span>}
        </button>
      </div>

      {sortedCards
        .filter((data) => data.status === title)
        .map((task) => (
          <Card
            task={task}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            onRemoveTask={onRemoveTask}
            onUpdateTask={onUpdateTask}
            key={task.id}
          />
        ))}
    </div>
  );
};

export default Column;
