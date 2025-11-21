Rails.application.config.to_prepare do
  Authlogic::Session::Base.controller = Authlogic::ControllerAdapters::RailsAdapter.new(self)
end
