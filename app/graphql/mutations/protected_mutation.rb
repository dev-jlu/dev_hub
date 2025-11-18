module Mutations
  class ProtectedMutation < BaseMutation
    def ready?(**args)
      unless context[:current_user]
        raise GraphQL::ExecutionError, "Unauthorized"
      end
      return true
    end
  end
end