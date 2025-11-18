module Mutations
  class DeleteTask < BaseMutation
    description "Delete a task"

    # Input arguemnts
    argument :id, ID, required: true

    # Return type
    field :success, Boolean, null: false
    field :errors, [String], null: false

    def resolve(id:)
      task = Core::Task.find_by(id: id)

      unless task
        return {
          success: false,
          errors: ["Task not found"]
        }
      end

      if task.destroy
        return {
          success: true,
          errors: []
        }
      else
        return {
          success: false,
          errors: task.errors.full_messages
        }
      end
    end
  end
end