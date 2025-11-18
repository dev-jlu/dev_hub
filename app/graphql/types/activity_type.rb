module Types
  class ActivityType < Types::BaseObject
    description "An activity log entry"

    # Fields
    field :id, ID, null: false
    field :action, String, null: false
    field :record_type, String, null: false
    field :record_id, ID, null: false
    field :metadata, GraphQL::Types::JSON, null: true
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
  end
end