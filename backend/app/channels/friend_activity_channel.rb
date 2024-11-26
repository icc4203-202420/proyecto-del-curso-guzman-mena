class FriendActivityChannel < ApplicationCable::Channel
  def subscribed
    # Aquí puedes definir la lógica de suscripción
    stream_from "friend_activity_channel"
  end

  def unsubscribed
    # Cualquier cleanup necesario al desconectarse
  end
end
