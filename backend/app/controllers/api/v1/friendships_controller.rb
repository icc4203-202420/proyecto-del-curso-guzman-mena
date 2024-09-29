class API::V1::FriendshipsController < ApplicationController
  respond_to :json
  before_action :set_user, only: [:index, :create]

  # GET /api/v1/users/:user_id/friendships
  def index
    @friendships = @user.friendships.includes(:friend)
    render json: @friendships.map { |f| f.friend }, status: :ok
  end

  # POST /api/v1/users/:user_id/friendships
  def create
    @friend = User.find_by(id: friendship_params[:friend_id])
    return render json: { error: 'Friend not found' }, status: :not_found unless @friend

    # Crea la amistad sin necesidad de bar_id
    @friendship = @user.friendships.build(friend: @friend, bar_id: friendship_params[:bar_id])

    if @friendship.save
      render json: @friendship, status: :created
    else
      render json: @friendship.errors, status: :unprocessable_entity
    end
  end

  private

  def set_user
    @user = User.find(params[:user_id])
  rescue ActiveRecord::RecordNotFound
    render json: { error: 'User not found' }, status: :not_found
  end

  def friendship_params
    params.require(:friendship).permit(:friend_id)  # bar_id es opcional
  end
end
