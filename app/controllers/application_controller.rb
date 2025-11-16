class ApplicationController < ActionController::API
  include ActionController::Cookies # Enable cookies for API mode

  # Private Methods
  private

  def current_user_session
    return @current_user_session if defined?(@current_user_session)
      @current_user_session = UserSession.find
  end

  def current_user
    return @current_user if defined?(@current_user)
      @current_user = current_user_session&.user
  end

  def require_user
    unless current_user
      render json: { error: "Unauthorized" }, status: :unauthorized
    end
  end
end
