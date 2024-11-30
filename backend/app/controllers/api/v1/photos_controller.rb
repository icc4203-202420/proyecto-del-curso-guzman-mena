# app/controllers/api/v1/photos_controller.rb
class API::V1::PhotosController < ApplicationController
    def recent_photos
        user_id = params[:user_id]
        user = User.find_by(id: user_id)
      
        unless user
          render json: { error: "User not found" }, status: :not_found
          return
        end
      
        # Obtener los IDs de los amigos
        friend_ids = user.friends.pluck(:id)
      
        # Filtrar las fotos por los amigos del usuario
        @photos = Photo.includes(:user, :event)
                       .where(user_id: friend_ids)
                       .order(created_at: :desc)
                       .limit(10)
      
        activities = @photos.map do |photo|
          {
            id: photo.id,
            type: 'photo',
            user_name: photo.user.first_name,
            description: photo.description,
            photo_url: photo.path,
            event_name: photo.event.name,
            event_id: photo.event.id,
            created_at: photo.created_at.iso8601
          }
        end
      
        render json: { activities: activities }, status: :ok
      end
      
  end
  