Rails.application.routes.draw do
  # Rutas para usuarios con Devise
  devise_for :users, path: '', path_names: {
    sign_in: 'api/v1/login',
    sign_out: 'api/v1/logout',
    registration: 'api/v1/signup'
  },
  controllers: {
    sessions: 'api/v1/sessions',
    registrations: 'api/v1/registrations'
  }

  # Health check de la aplicación
  get "up" => "rails/health#show", as: :rails_health_check

  # API namespace con JSON por defecto
  namespace :api, defaults: { format: :json } do
    namespace :v1 do
      
      # Rutas para bares
      resources :bars, only: [:index, :show, :create, :update, :destroy] do
        # Rutas para eventos asociados a un bar
        resources :events, only: [:index, :create]
      end

      # Rutas para eventos individuales
      resources :events, only: [:show, :update, :destroy] do
        resources :attendances, only: [:create, :index] # Rutas para asistencias

        # Rutas personalizadas para fotos
        member do
          post :upload_photo   # Subir una foto a un evento
          get :photo_index     # Listar fotos de un evento
        end
      end

      # Rutas para cervezas
      resources :beers, only: [:index, :show, :create, :update, :destroy] do
        resources :reviews, only: [:index, :create] # Reseñas de cervezas
      end

      # Rutas para usuarios
      resources :users, only: [:index, :show, :update, :destroy] do
        collection do
          get 'search', to: 'users#search' # Buscar usuarios
        end
      end

      # Rutas para amistades
      resources :friendships, only: [:create, :index, :destroy]

      # Rutas para reseñas globales
      resources :reviews, only: [:index, :show, :create, :update, :destroy] do
        collection do
          get :all_reviews       # Todas las reseñas
          get :recent_reviews    # Reseñas recientes
        end
      end

      # Ruta para generar un token de Stream
      get 'stream/token', to: 'stream#generate_token'
    end
  end
end
