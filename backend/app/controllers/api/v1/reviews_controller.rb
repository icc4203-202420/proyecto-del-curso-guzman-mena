class API::V1::ReviewsController < ApplicationController
  respond_to :json
  before_action :set_user, only: [:create]
  before_action :set_beer, only: [:index, :create]
  before_action :set_review, only: [:show, :update, :destroy]

  def index
    @reviews = @beer.reviews
    render json: { reviews: @reviews }, status: :ok
  end

  def show
    if @review
      render json: { review: @review }, status: :ok
    else
      render json: { error: "Review not found" }, status: :not_found
    end
  end

  def create
    @review = @beer.reviews.build(review_params)
    @review.user = @user

    if @review.save
      render json: @review, status: :created, location: api_v1_beer_reviews_url(@beer)
    else
      render json: { errors: @review.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    if @review.update(review_params)
      render json: @review, status: :ok
    else
      render json: @review.errors, status: :unprocessable_entity
    end
  end

  def destroy
    @review.destroy
    head :no_content
  end

  def all_reviews
    user_id = params[:user_id] # Recibe el ID del usuario actual
    user = User.find(user_id)
  
    # Obtener los IDs de los amigos del usuario actual
    friend_ids = user.friends.pluck(:id)
  
    # Filtrar reseñas hechas por los amigos
    @reviews = Review.includes(:user, :beer)
                     .where(user_id: friend_ids)
                     .order(created_at: :desc)
                     .map do |review|
      {
        id: review.id,
        user_name: review.user.first_name,
        beer_name: review.beer.name,
        rating: review.rating,
        text: review.text,
        created_at: review.created_at
      }
    end

    render json: { reviews: @reviews }, status: :ok
  end

  private

  def set_beer
    @beer = Beer.find_by(id: params[:beer_id])
    render json: { error: "Beer not found" }, status: :not_found unless @beer
  end

  def set_review
    @review = Review.find_by(id: params[:id])
    render json: { error: "Review not found" }, status: :not_found unless @review
  end

  def set_user
    @user = User.find_by(id: params[:review][:user_id])
    render json: { error: "User not found" }, status: :not_found unless @user
  end

  def review_params
    params.require(:review).permit(:text, :rating)
  end
end
