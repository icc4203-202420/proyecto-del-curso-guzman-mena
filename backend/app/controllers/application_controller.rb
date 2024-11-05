class ApplicationController < ActionController::API
  include Devise::Controllers::Helpers  # Incluye los métodos de Devise

  before_action :configure_permitted_parameters, if: :devise_controller?

  protected

  # Configura los parámetros permitidos para Devise
  def configure_permitted_parameters
    devise_parameter_sanitizer.permit(:sign_up, keys: %i[name avatar])
    devise_parameter_sanitizer.permit(:account_update, keys: %i[name avatar])
  end

  # Asegura que haya un usuario autenticado para acceder a ciertas acciones
  def authenticate_user!
    super
  rescue
    render json: { error: 'You need to sign in or sign up before continuing.' }, status: :unauthorized
  end
end
