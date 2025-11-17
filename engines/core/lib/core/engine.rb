module Core
  class Engine < ::Rails::Engine
    isolate_namespace Core

    config.generators do |g|
      g.test_framework :rspec
      g.fixture_replacement :factory_bot
      g.factory_bot dir: "spec/factories"
    end

    # Share models with main app
    config.autoload_paths += Dir["#{config.root}/app/**/"]
    config.eager_load_paths += Dir["#{config.root}/app/**/"]
  end
end
