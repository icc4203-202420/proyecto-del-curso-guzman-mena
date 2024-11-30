class API::V1::ReviewsController < ApplicationController
  respond_to :json
  before_action :set_user, only: [:create]
  before_action :set_beer, only: [:index, :create]
  before_action :set_review, only: [:show, :update, :destroy]

  def index
    @reviews = @beer.reviews.includes(:user)
    render json: { reviews: @reviews.map { |review| review_data(review) } }, status: :ok
  end

  def show
    if @review
      render json: { review: review_data(@review) }, status: :ok
    else
      render json: { error: "Review not found" }, status: :not_found
    end
  end

  def create
    @review = @beer.reviews.build(review_params.merge(user: @user))

    if @review.save
      render json: { review: review_data(@review) }, status: :created
    else
      render json: { errors: @review.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    if @review.update(review_params)
      render json: { review: review_data(@review) }, status: :ok
    else
      render json: { errors: @review.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    @review.destroy
    head :no_content
  end

  def all_reviews
    user_id = params[:user_id]
    user = User.find_by(id: user_id)

    unless user
      render json: { error: "User not found" }, status: :not_found
      return
    end

    friend_ids = user.friends.pluck(:id)

    @reviews = Review.includes(:user, :beer)
                     .where(user_id: friend_ids)
                     .order(created_at: :desc)

    render json: { reviews: @reviews.map { |review| review_data(review) } }, status: :ok
  end

  # Nuevo método para obtener las reseñas más recientes
  def recent_reviews
    user_id = params[:user_id]
    user = User.find_by(id: user_id)
  
    unless user
      render json: { error: "User not found" }, status: :not_found
      return
    end
  
    # Obtener los IDs de los amigos del usuario
    friend_ids = user.friends.pluck(:id)
  
    # Filtrar las reseñas y fotos por los amigos
    reviews = Review.includes(:user, :beer)
                    .where(user_id: friend_ids)
                    .order(created_at: :desc)
                    .limit(10)
  
    photos = Photo.includes(:user, :event)
                  .where(user_id: friend_ids)
                  .order(created_at: :desc)
                  .limit(10)
  
    review_activities = reviews.map do |review|
      bar = review.beer.bars.first # Obtén el primer bar asociado a la cerveza, si existe
      {
        id: review.id,
        type: 'review',
        user_name: review.user.first_name,
        beer_name: review.beer.name,
        beer_id: review.beer.id,
        rating: review.rating,
        text: review.text,
        created_at: review.created_at.iso8601,
        bar_name: bar&.name,
        bar_id: bar&.id,
        bar_country: bar&.address&.country&.name,
        bar_address: bar&.address&.line1,
        avg_rating: review.beer.avg_rating
      }
    end
  
    photo_activities = photos.map do |photo|
      {
        id: photo.id,
        type: 'photo',
        user_name: photo.user.first_name,
        description: photo.description,
        photo_url: "#{request.base_url}#{photo.path}", # URL completa
        event_name: photo.event.name,
        event_id: photo.event.id,
        created_at: photo.created_at.iso8601
      }
    end
  
    # Combinar las actividades de reseñas y fotos, ordenadas por fecha
    activities = (review_activities + photo_activities).sort_by { |activity| activity[:created_at] }.reverse
  
    render json: { activities: activities }, status: :ok
  end
  
  
  
  

  private

  def set_beer
    @beer = Beer.find_by(id: params[:beer_id] || params.dig(:review, :beer_id))
    render json: { error: "Beer not found" }, status: :not_found unless @beer
  end

  def set_review
    @review = Review.find_by(id: params[:id])
    render json: { error: "Review not found" }, status: :not_found unless @review
  end

  def set_user
    @user = User.find_by(id: params.dig(:review, :user_id))
    render json: { error: "User not found" }, status: :not_found unless @user
  end

  def review_params
    params.require(:review).permit(:text, :rating, :beer_id)
  end

  def review_data(review)
    {
      id: review.id,
      user_name: review.user.first_name,
      beer_name: review.beer.name,
      rating: review.rating,
      text: review.text,
      created_at: review.created_at.strftime("%Y-%m-%d %H:%M:%S")
    }
  end
end
