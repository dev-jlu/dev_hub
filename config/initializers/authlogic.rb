Rails.application.config.to_prepare do
  Authlogic::Session::Base.controller = Authlogic::ControllerAdapters::RailsAdapter.new(self)
  Authlogic::Session::Base.cookie_options = {
    samesite: :none,
    secure: Rails.env.production?
  }
end
