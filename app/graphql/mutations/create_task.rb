module Mutations
  class CreateTask < BaseMutation
    description "Create a new task"

    # Input arguments
    argument :project_id, ID, required: true
    argument :title, String, required: true
    argument :description, String, required: false
    argument :status, String, required: false
    argument :assignee_id, ID, required: false

    # Return Type
    field :task, Types::TaskType, null: true
    field :errors, [String], null: false

    def resolve(project_id:, title:, description: nil, status: "pending", assignee_id: nil)
      project = Core::Project.find_by(id: project_id)

      unless project
        return {
          project: nil,
          errors: ["Project not found"]
        }
      end

      task = project.tasks.build(
        title: title,
        description: description,
        status: status
      )

      # Assign to user if provided
      if assignee_id.present?
        assignee = User.find_by(id: assignee_id)
        task.assignee = assignee if assignee
      end

      if task.save
        return {
          task: task,
          errors: []
        }
      else
        return {
          task: nil,
          errors: task.errors.full_messages
        }
      end
    end
  end
end