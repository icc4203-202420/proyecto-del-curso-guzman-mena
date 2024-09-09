class API::V1::ReviewsController < ApplicationController
  respond_to :json
  before_action :set_user, only: [:index]
  before_action :set_beer, only: [:index, :create]
  before_action :set_review, only: [:show, :update, :destroy]

  def index
    # Mostrar todas las reseñas de una cerveza específica
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
    @review = @beer.reviews.build(review_params.merge(user: current_user))
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

  private

  # Método para encontrar la cerveza basada en el parámetro :beer_id
  def set_beer
    @beer = Beer.find_by(id: params[:beer_id] || params[:review][:beer_id])
    render json: { error: "Beer not found" }, status: :not_found unless @beer
  end
  

  # Método para encontrar la reseña basada en el parámetro :id
  def set_review
    @review = Review.find_by(id: params[:id])
    render json: { error: "Review not found" }, status: :not_found unless @review
  end

  # Método para encontrar el usuario basado en el parámetro :user_id
  def set_user
    @user = User.find(params[:user_id]) if params[:user_id]
  end

  # Parámetros permitidos para una reseña
  def review_params
    params.require(:review).permit(:id, :text, :rating, :beer_id)
  end
end
