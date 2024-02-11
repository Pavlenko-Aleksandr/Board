import { gql } from "@apollo/client";

export const ALL_TASKS = gql`
  query AllTasks {
    tasks: allTasks {
      id
      status
      creationDate
      title
      description
      isDone
    }
  }
`;

export const ADD_TASK = gql`
  mutation CreateTask(
    $status: String!
    $creationDate: String!
    $title: String!
    $description: String!
    $isDone: Boolean!
  ) {
    newTask: createTask(
      status: $status
      creationDate: $creationDate
      title: $title
      description: $description
      isDone: $isDone
    ) {
      status
      creationDate
      title
      description
      isDone
    }
  }
`;

export const DELETE_TASK = gql`
  mutation RemoveTask($id: ID!) {
    removeTask(id: $id) {
      id
    }
  }
`;

export const UPDATE_TASK = gql`
  mutation UpdateTask(
    $id: ID!
    $status: String
    $title: String
    $description: String
    $isDone: Boolean
  ) {
    updateTask(
      id: $id
      status: $status
      title: $title
      description: $description
      isDone: $isDone
    ) {
      id
      status
      creationDate
      title
      description
      isDone
    }
  }
`;
