module Mutations
  class Login < BaseMutation
    description "Login a user"

    # Arguments
    argument :email, String, required: true
    argument :password, String, required: true

    # Return types
    field :user, Types::UserType, null: true
    field :message, String, null: true
    field :errors, [String], null: false

    def resolve(email:, password:)
      user_session = UserSession.new(
        email: email,
        password: password,
        errors: []
      )

      if user_session.save
        return {
          user: user_session.user,
          message: "Logged in successfully",
          errors: []
        }
      else
        return {
          user: nil,
          message: nil,
          errors: user_session.errors.full_messages
        }
      end
    end
  end
end