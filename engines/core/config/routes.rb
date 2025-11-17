Core::Engine.routes.draw do
  resources :projects do
    resources :tasks, only: [:index, :create]
  end

  resources :tasks, only: [:show, :update, :destroy]
end
