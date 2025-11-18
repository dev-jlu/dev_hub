module Mutations
  class UpdateTaskStatus < ProtectedMutation
    description "Update a task status"

    # Input arguments
    argument :id, ID, required: true
    argument :status, String, required: true

    # Return type
    field :task, Types::TaskType, null: true
    field :errors, [String], null: false

    def resolve(id:, status:)
      task = Core::Task.find_by(id: id)

      unless task
        return {
          task: nil,
          errors: ["Task not found"]
        }
      end

      updater = Core::TaskStatusUpdater.new(task, status)

      if updater.call
        return {
          task: task.reload,
          errors: []
        }
      else
        return {
          task: nil,
          errors: updater.errors
        }
      end
    end
  end
end