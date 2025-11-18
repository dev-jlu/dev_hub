module Mutations
  class UpdateTask < BaseMutation
    description "Update a task"

    # Input arguments
    argument :id, ID, required: false
    argument :title, String, required: false
    argument :description, String, required: false
    argument :assignee_id, ID, required: false

    # Return type
    field :task, Types::TaskType, null: true
    field :errors, [String], null: false

    def resolve(id:, **attributes)
      task = Core::Task.find_by(id: id)

      unless task
        return {
          task: nil,
          errors: ["Task not found"]
        }
      end

      if attributes.key?(:assignee_id)
        assignee = User.find_by(id: attributes[:assignee_id])
        attributes[:assignee_id] = assignee&.id
        attributes[:assignee_type] = "User"
      end

      if task.update(attributes)
        return {
          task: task.reload,
          errors: []
        }
      else
        return {
          task: nil,
          errors: task.errors.full
        }
      end
    end
  end
end