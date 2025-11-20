Rails.application.config.session_store :cookie_store,
    key: '_dev_hub_session',
    domain: :all,
    same_site: :none,
    secure: Rails.env.production?