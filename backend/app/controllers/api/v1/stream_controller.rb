# app/controllers/api/v1/stream_controller.rb
class API::V1::StreamController < ApplicationController
    def generate_token
      client = Stream::Client.new(ENV['STREAM_API_KEY'], ENV['STREAM_API_SECRET'])
      user_token = client.create_user_token(params[:user_id])
  
      render json: { token: user_token }, status: :ok
    end
  end
  