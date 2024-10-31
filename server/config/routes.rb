Rails.application.routes.draw do
  post '/login', to: 'login#login'
  #resources :login, only: [:index]
end