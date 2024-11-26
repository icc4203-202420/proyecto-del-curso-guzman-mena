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
    @reviews = Review.includes(:user, :beer).order(created_at: :desc).limit(10)
    render json: { reviews: @reviews.map { |review| review_data(review) } }, status: :ok
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
