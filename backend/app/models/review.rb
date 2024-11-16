class Review < ApplicationRecord
  belongs_to :user
  belongs_to :beer

  # Validaciones
  validates :text, presence: true, length: { minimum: 15 }
  validates :rating, presence: true, numericality: { greater_than_or_equal_to: 1, less_than_or_equal_to: 5 }

  after_save :update_beer_rating
  after_destroy :update_beer_rating
  after_create :publish_activity

  private


  def publish_activity
    client = Stream::Client.new(ENV['STREAM_API_KEY'], ENV['STREAM_API_SECRET'])
    feed = client.feed('timeline', user_id.to_s)

    feed.add_activity(
      actor: "User:#{user_id}",
      verb: "reviewed",
      object: "Beer:#{beer_id}",
      rating: rating,
      foreign_id: "Review:#{id}",
      time: created_at.iso8601
    )
  end


  def update_beer_rating
    beer.update_avg_rating
  end
end
