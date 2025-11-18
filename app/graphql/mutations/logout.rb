module Mutations
  class Logout < BaseMutation
    description "Logout a user"

    # Return type
    field :message, String, null: true
    field :errors, [String], null: false

    def resolve
      user_session = UserSession.find
      if user_session
        user_session.destroy
        return {
          message: "Logged out successfully",
          errors: []
        }
      end
    end
  end
end