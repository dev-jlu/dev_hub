module Core
  class Engine < ::Rails::Engine
    isolate_namespace Core

    config.api_only = true

    config.generators do |g|
      g.test_framework :rspec
      g.fixture_replacement :factory_bot
      g.factory_bot dir: "spec/factories"
      g.helper false
      g.assets false
      g.template_engine nil
    end
  end
end
