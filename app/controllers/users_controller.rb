class UsersController < ApplicationController
  # POST /users
  def create
    @user = User.new(user_params)
    if @user.save
      render json: {
        user: @user,
        message: "User created successfully"
      }, status: :created
    else
      render json: { errors: @user.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # Private Methods
  private

  def user_params
    params.require(:user).permit(:name, :email, :password, :password_confirmation)
  end
end
