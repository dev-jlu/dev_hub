module Mutations
  class UpdateProject < BaseMutation
    description "Update a project"

    # Input arguments
    argument :id, ID, required: true
    argument :name, String, required: false
    argument :description, String, required: false

    # Return type
    field :project, Types::ProjectType, null: true
    field :errors, [String], null: false

    def resolve(id:, **attributes)
      project = Core::Project.find_by(id: id)

      unless project
        return {
          project: nil,
          errors: ["Project not found"]
        }
      end

      if project.update(attributes)
        return {
          project: project.reload,
          errors: []
        }
      else
        return {
          project: nil,
          errors: project.errors.full_messages
        }
      end
    end
  end
end