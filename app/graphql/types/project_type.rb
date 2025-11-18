module Types
  class ProjectType < Types::BaseObject
    description "A project"

    # Fields
    field :id, ID, null: false
    field :name, String, null: false
    field :description, String, null: true
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: false

    # Associations
    field :tasks, [Types::TaskType], null: true
    field :tasks_count, Integer, null: false

    def tasks_count
      object.tasks.count
    end
  end
end