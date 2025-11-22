module Mutations
  class CreateUser < BaseMutation
    description "Create a new user"

    # Input arguments
    argument :name, String, required: true
    argument :email, String, required: true
    argument :password, String, required: true
    argument :password_confirmation, String, required: true

    # Return type
    field :user, Types::UserType, null: true
    field :errors, [String], null: false

    def resolve(name:, email:, password:, password_confirmation:)
      user = User.new(
        name: name,
        email: email,
        password: password,
        password_confirmation: password_confirmation
      )

      if user.save
        return {
          user: user,
          errors: []
        }
      else
        return {
          user: nil,
          errors: user.errors.full_messages
        }
      end
    end
  end
end