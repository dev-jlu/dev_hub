class UserSession < Authlogic::Session::Base
  secure true
  same_site "None"
  httponly true
end