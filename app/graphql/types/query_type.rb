# frozen_string_literal: true

module Types
  class QueryType < Types::BaseObject
    # Add 'node(id: ID!)' and 'nodes(ids: [ID!])'
    # Fetches an object given its ID.
    include GraphQL::Types::Relay::HasNodeField
    # Fetches a list of objects fiven a list of IDs.
    include GraphQL::Types::Relay::HasNodesField

    # Project queries
    field :projects, [Types::ProjectType], null: false, description: "Get all projects" do
      argument :limit, Integer, required: false, default_value: 10
    end

    def projects(limit:)
      authenticate!
      return Core::Project.recent(limit)
    end

    field :project, Types::ProjectType, null: false, description: "Get a single project by ID" do
      argument :id, ID, required: true
    end

    def project(id:)
      authenticate!
      return Core::Project.find(id)
    end

    # Task queries
    field :tasks, [Types::TaskType], null: false, description: "Get all tasks" do
      argument :status, String, required: false
      argument :project_id, ID, required: false
      argument :limit, Integer, required: false, default_value: 20
    end

    def tasks(status: nil, project_id: nil, limit: 20)
      authenticate!
      tasks = Core::Task.all
      tasks = tasks.where(status: status) if status.present?
      tasks = tasks.where(project_id: project_id) if project_id.present?
      return tasks.recent(limit)
    end

    field :task, Types::TaskType, null: false, description: "Get a single task by ID" do
      argument :id, ID, required: true
    end

    def task(id:)
      authenticate!
      return Core::Task.find(id)
    end

    # User queries
    field :users, [Types::UserType], null: false, description: "Get all users"

    def users
      authenticate!
      return User.all
    end

    field :current_user, Types::UserType, null: false, description: "Get the currently logged-in user"

    def current_user
      return context[:current_user]
    end

    # Activity queries
    field :activities, [Types::ActivityType], null: false, description: "Get recent activities" do
      argument :limit, Integer, required: false, default_value: 50
    end

    def activities(limit: 50)
      authenticate!
      return Core::Activity.recent(limit)
    end

    # Private Methods
    private

    def authenticate!
      # user = context[:current_user]
      # raise GraphQL::ExecutionError, "Unauthorized" unless user
      # return user
      return true;
    end
  end
end
