class API::V1::FriendshipsController < ApplicationController
  respond_to :json
  before_action :set_user, only: [:index, :create]

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
  def first_shared_event(user1, user2)
    Event.joins(:attendances)
         .where(attendances: { user_id: user1.id })
         .where(id: Attendance.select(:event_id).where(user_id: user2.id))
         .order(:date)
         .first
  end
end
