module ApplicationCable
  class Channel < ActionCable::Channel::Base
    rescue_from "MyError", with: :deliver_error_message # para aerrores
    # suscriptores creados
    def subscribed
      stream_for current_user
    end

    def unsubscribed
      # Cleanup cuando el usuario se desconecta
      stop_all_streama
    end

    private
      def deliver_error_message(e)
        # broadcast_to(...)
      end
  end
end
