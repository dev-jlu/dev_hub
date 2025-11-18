module Types
  class UserType < Types::BaseObject
    description "A user in the system"

    # Fields
    field :id, ID, null: false
    field :name, String, null: false
    field :email, String, null: false
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: false

    # Associations
    field :assigned_tasks, [Types::TaskType], null: true

    def assigned_tasks
      object.assigned_tasks
    end
  end
end