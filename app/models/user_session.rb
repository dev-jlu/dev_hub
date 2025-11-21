class UserSession < Authlogic::Session::Base
  secure true
  same_site "Lax"
  httponly true
end