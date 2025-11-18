module Mutations
  class CreateProject < BaseMutation
    description "Create a new project"

    # Input arguments
    argument :name, String, required: true
    argument :description, String, required: false

    # Return type
    field :project, Types::ProjectType, null: true
    field :errors, [String], null: false

    def resolve(name:, description: nil)
      project = Core::Project.new(
        name: name, 
        description: description
      )

      if project.save
        return {
          project: project,
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