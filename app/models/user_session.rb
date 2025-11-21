class UserSession < Authlogic::Session::Base
  secure true
  same_site :none
  httponly true
end