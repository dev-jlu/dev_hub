class UserSession < Authlogic::Session::Base
  self.cookie_secure = Rails.env.production?
  self.cookie_samesite_protection = :none
  if Rails.env.production?
    self.cookie_domain = ".onrender.com"
  end
end