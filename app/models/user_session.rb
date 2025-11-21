class UserSession < Authlogic::Session::Base
  cookie_options(
    samesite: :none,
    secure: Rails.env.production?
  )
end