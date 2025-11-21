Rails.application.config.session_store :cookie_store,
    key: '_dev_hub_session',
    same_site: :none,
    secure: Rails.env.production?

Rails.application.config.action_dispatch.cookies_same_site_protection = lambda { | _request | :none }