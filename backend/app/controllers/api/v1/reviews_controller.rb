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