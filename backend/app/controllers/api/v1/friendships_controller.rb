class API::V1::FriendshipsController < ApplicationController
  respond_to :json
  # Desactivamos la verificación de usuario para pruebas
  # before_action :set_user, only: [:index, :create]

  # GET /api/v1/users/:user_id/friendships
  def index
    user = User.find(params[:user_id])
    friends = user.friendships.includes(:friend).map do |friendship|
      {
        friend: friendship.friend,
        first_shared_event: first_shared_event(user, friendship.friend)
      }
    end

    render json: friends, status: :ok
  end

  # POST /api/v1/friendships
  # app/controllers/api/v1/friendships_controller.rb
def create
  @user = User.find_by(id: params[:user_id])

  if @user.nil?
    return render json: { error: 'User not found' }, status: :not_found
  end

  @friend = User.find_by(id: friendship_params[:friend_id])
  return render json: { error: 'Friend not found' }, status: :not_found unless @friend

  # Verifica si ya existe la amistad
  if @user.friendships.exists?(friend: @friend)
    return render json: { message: 'Ya eres amigo de este usuario' }, status: :ok
  end

  # Crea la amistad si no existe
  @friendship = @user.friendships.build(friend: @friend)

  if @friendship.save
    render json: { message: 'Amigo agregado exitosamente', friendship: @friendship }, status: :created
  else
    render json: @friendship.errors, status: :unprocessable_entity
  end
end


  private

  def friendship_params
    params.require(:friendship).permit(:friend_id)
  end

  def first_shared_event(user1, user2)
    Event.joins(:attendances)
         .where(attendances: { user_id: user1.id })
         .where(id: Attendance.select(:event_id).where(user_id: user2.id))
         .order(:date)
         .first
  end
end
  