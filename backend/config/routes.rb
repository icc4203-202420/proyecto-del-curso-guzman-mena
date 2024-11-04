Rails.application.routes.draw do
  # devise_for :users
  get 'current_user', to: 'current_user#index'
  devise_for :users, path: '', path_names: {
    sign_in: 'api/v1/login',
    sign_out: 'api/v1/logout',
    registration: 'api/v1/signup'
  },
  controllers: {
    sessions: 'api/v1/sessions',
    registrations: 'api/v1/registrations'
  }

  get "up" => "rails/health#show", as: :rails_health_check

  namespace :api, defaults: { format: :json } do
    namespace :v1 do
      resources :bars do
        resources :events, only: [:index, :create]
      end
  
      resources :events do
        resources :attendances, only: [:create, :index]  # Rutas para el check-in y ver asistentes
        member do
          post :upload_images  # Ruta personalizada para subir imágenes
          post :upload_photo   # Ruta alternativa para subir fotos
        end
      end
  
      resources :beers do
        resources :reviews, only: [:index, :create]  # Reseñas anidadas dentro de cervezas
      end
  
      resources :users do
        resources :friendships
        resources :reviews, only: [:index]
      end
  
      resources :reviews, only: [:index, :show, :create, :update, :destroy]
    end
  end
  
end
