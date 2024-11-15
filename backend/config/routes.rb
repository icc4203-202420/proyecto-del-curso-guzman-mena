Rails.application.routes.draw do
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
        resources :attendances, only: [:create, :index]
        member do
          post :upload_images
          post :upload_photo
        end
      end
  
      resources :beers do
        resources :reviews, only: [:index, :create]
      end
  
      resources :users do
        collection do
          get 'search', to: 'users#search'
        end
      end
  
      # Rutas para friendships
      resources :friendships, only: [:create, :index, :destroy]
      
      resources :reviews, only: [:index, :show, :create, :update, :destroy] do
        collection do
          get :all_reviews  # Ruta personalizada para obtener todas las reseñas
        end
      end
    end
  end
end
