class Review < ApplicationRecord
  belongs_to :user
  belongs_to :beer

  # Validaciones
  validates :text, presence: true, length: { minimum: 15 }
  validates :rating, presence: true, numericality: { greater_than_or_equal_to: 1, less_than_or_equal_to: 5 }

  after_save :update_beer_rating
  after_destroy :update_beer_rating
  after_create :publish_activity
  after_create :broadcast_activity

  private

  def publish_activity
    bar = beer.bars.first
    ActionCable.server.broadcast("friend_activity_channel", {
      activity: {
        id: id,
        type: 'review',
        user_name: user.first_name,
        beer_name: beer.name,
        rating: rating,
        text: text,
        created_at: created_at.iso8601,
        bar_name: bar&.name,
        bar_country: bar&.address&.country&.name,
        bar_address: bar&.address&.line1
      }
    })
  end
  def broadcast_activity
    ActionCable.server.broadcast(
      "friend_activity_channel",
      {
        activity: {
          id: id,
          user_name: user.first_name,
          beer_name: beer.name,
          text: text,
          rating: rating,
          created_at: created_at
        }
      }
    )
  end

  def update_beer_rating
    beer.update_avg_rating
  end
end
