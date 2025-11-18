module Types
  class TaskType < Types::BaseObject
    description "A task"

    # Fields
    field :id, ID, null: false
    field :title, String, null: false
    field :description, String, null: false
    field :status, String, null: false
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: false

    # Associations
    field :project, Types::ProjectType, null: true
    field :assignee, Types::UserType, null: true

    # Polymorphic Assignee
    def assignee
      object.assignee
    end
  end
end