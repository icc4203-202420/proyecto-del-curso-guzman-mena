module ApplicationCable
  class Connection < ActionCable::Connection::Base
    identified_by :current_user
    rescue_from StandardError, with: :report_error # para reportar errores

    def connect
      self.current_user = find_verified_user
    end

    private
      def find_verified_user
        if verified_user = User.find_by(id: cookies.encrypted[:userId])
          verified_user
        else
          reject_unauthorized_connection
        end
      end
      
      def report_error(e)
        SomeExternalBugtrackingService.notify(e)
      end
  end
end

# 3.1.1 configuracion de conexión


# module ApplicationCable
#   class Connection < ActionCable::Connection::Base
#   end
# end