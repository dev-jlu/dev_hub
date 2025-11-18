module Mutations
  class DeleteProject < ProtectedMutation
    description "Delete a project"

    # Input arguments
    argument :id, ID, required:true

    # Return type
    field :success, Boolean, null: false
    field :errors, [String], null: false

    def resolve(id:)
      project = Core::Project.find_by(id: id)

      unless project
        return {
          success: false,
          errors: ["Project not found"]
        }
      end

      if project.destroy
        return {
          success: true,
          errors: []
        }
      else
        return {
          success: false,
          errors: project.errors.full_messages
        }
      end
    end
  end
end