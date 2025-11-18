# frozen_string_literal: true

module Types
  class MutationType < Types::BaseObject
    # Project mutations
    field :create_project, mutation: Mutations::CreateProject
    field :update_project, mutation: Mutations::UpdateProject
    field :delete_project, mutation: Mutations::DeleteProject

    # Task mutations
    field :create_task, mutation: Mutations::CreateTask
    field :update_task, mutation: Mutations::UpdateTask
    field :update_task_status, mutation: Mutations::UpdateTaskStatus
    field :delete_task, mutation: Mutations::DeleteTask

    # User mutations
    field :create_user, mutation: Mutations::CreateUser
    field :login, mutation: Mutations::Login
    field :logout, mutation: Mutations::Logout
  end
end
