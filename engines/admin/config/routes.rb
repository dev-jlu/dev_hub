Admin::Engine.routes.draw do
  root to: "dashboard#index"

  get "dashboard" => "dashboard#index"
  get "dashboard/stats" => "dashboard#stats"
end
