# app/channels/friend_activity_channel.rb
class FriendActivityChannel < ApplicationCable::Channel
    def subscribed
      stream_from "global_activity_channel"
    end
  end
  
  # app/models/review.rb
  class Review < ApplicationRecord
    belongs_to :user
    belongs_to :beer
  
    after_create_commit do
      ActionCable.server.broadcast("global_activity_channel", activity: self)
    end
  end
  