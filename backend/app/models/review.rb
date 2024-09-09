class Review < ApplicationRecord
  belongs_to :user
  belongs_to :beer

  # Validaciones
  validates :text, presence: true, length: { minimum: 15 }
  validates :rating, presence: true, numericality: { greater_than_or_equal_to: 1, less_than_or_equal_to: 5 }

  after_save :update_beer_rating
  after_destroy :update_beer_rating

  private

  def update_beer_rating
    beer.update_avg_rating
  end
end
