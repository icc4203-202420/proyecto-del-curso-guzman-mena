class API::V1::UsersController < ApplicationController
  respond_to :json
  before_action :set_user, only: [:show, :update]

  def index
    @users = User.includes(:reviews, :address).all
    render json: { users: @users }, status: :ok
  end

  def show
    render json: @user.to_json(include: { 
        reviews: { 
          only: [:id, :text, :rating, :beer_id],
          include: {
            beer: { only: [:name] }
          }
        },
        friendships: {
          include: { 
            friend: { only: [:id, :first_name, :last_name] },
            first_shared_event: { only: [:id, :name, :date] } # Incluye solo si existe
          }
        },
        address: { only: [:line1, :line2, :city, :country] }
      }),
      status: :ok
  end

  def create
    @user = User.new(user_params)
    if @user.save
      render json: @user.id, status: :ok
    else
      render json: @user.errors, status: :unprocessable_entity
    end
  end

  def update
    if @user.update(user_params)
      render :show, status: :ok, location: api_v1_users_path(@user)
    else
      render json: @user.errors, status: :unprocessable_entity
    end
  end

  def search_by_handle
    users = User.where("handle LIKE ?", "%#{params[:handle]}%")
    render json: users, status: :ok
  end

  def search
    handle = params[:handle]
    if handle.present?
      users = User.where("LOWER(handle) LIKE ?", "%#{handle.downcase}%")
      render json: { users: users }, status: :ok
    else
      render json: { error: 'No handle provided' }, status: :bad_request
    end
  end
  

  private

  def set_user
    @user = User.find(params[:id])
    # Carga amistades con el evento compartido si existe, sino asigna nil
    @user.friendships.each do |friendship|
      if friendship.friend
        shared_event = find_first_shared_event(@user, friendship.friend)
        friendship.define_singleton_method(:first_shared_event) { shared_event }
      end
    end
  end

  # Encuentra el primer evento compartido entre dos usuarios
  def find_first_shared_event(user1, user2)
    Event.joins(:attendances)
         .where(attendances: { user_id: user1.id })
         .where(id: Attendance.select(:event_id).where(user_id: user2.id))
         .order(:date)
         .first
  end

  def user_params
    params.fetch(:user, {}).
        permit(:id, :first_name, :last_name, :email, :age,
            { address_attributes: [:id, :line1, :line2, :city, :country, :country_id, 
              country_attributes: [:id, :name]],
              reviews_attributes: [:id, :text, :rating, :beer_id, :_destroy]
            })
  end
end
