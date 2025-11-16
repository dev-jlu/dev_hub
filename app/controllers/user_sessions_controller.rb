class UserSessionsController < ApplicationController
  # POST /login
  def create
    @user_session = UserSession.new(session_params.to_h)
    if @user_session.save
      render json: {
        user: @user_session.user,
        message: "Login successful"
      }, status: :created
    else
      render json: { errors: @user_session.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # DELETE /logout
  def destroy
    current_user_session&.destroy
    render json: { message: "Logout successful" }
  end
  
  # Private Methods
  private

  def session_params
    params.require(:user_session).permit(:email, :password)
  end

end
