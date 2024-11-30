class API::V1::EventsController < ApplicationController
  require 'fileutils'
  include ImageProcessing
  include Authenticable
  respond_to :json

  before_action :set_bar, only: [:index, :create]
  before_action :verify_jwt_token, only: [:create, :update, :destroy, :create_post]
  before_action :set_event, only: [:show, :update, :destroy, :upload_photo, :create_post, :index_posts]

  # GET /bars/:bar_id/events
  def index
    if @bar.events.any?
      render json: { 
        bar: @bar.as_json(include: { address: { include: :country } }), 
        events: @bar.events 
      }, status: :ok
    else
      render json: { message: "No events found for this bar" }, status: :ok
    end
  end

  # para obtener todos los eventos
  def index_all
    events = Event.includes(:bar).map do |event|
      event_data = event.as_json
      event_data.merge!(
        bar_id: event.bar.id,
        bar_name: event.bar.name
      )
      event_data
    end

    render json: { events: events }, status: :ok
  end

  # GET /events/:id
  def show
    event_data = @event.as_json
    if @event.images.attached?
      event_data.merge!(
        images: @event.images.map { |image| url_for(image) }
      )
    end
    render json: { event: event_data }, status: :ok
  end

  # POST /bars/:bar_id/events
  def create
    @event = @bar.events.new(event_params.except(:image_base64))
    handle_image_attachment if event_params[:image_base64]

    if @event.save
      render json: { event: @event, message: 'Event created successfully.' }, status: :created
    else
      render json: @event.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /events/:id
  def update
    handle_image_attachment if event_params[:image_base64]

    if @event.update(event_params.except(:image_base64))
      render json: { event: @event, message: 'Event updated successfully.' }, status: :ok
    else
      render json: @event.errors, status: :unprocessable_entity
    end
  end

  # DELETE /events/:id
  def destroy
    if @event.destroy
      render json: { message: 'Event successfully deleted.' }, status: :no_content
    else
      render json: @event.errors, status: :unprocessable_entity
    end
  end

  # POST /events/:id/create_post
  def create_post
    user = User.find_by(id: params[:user_id])
    unless user
      render json: { error: "User not found" }, status: :not_found
      return
    end

    post = Post.new(
      user: user,
      event: @event,
      description: params[:description],
      tagged_handles: params[:tagged_handles] || []
    )

    if params[:image].present?
      decoded_image = Base64.decode64(params[:image])
      file_name = "post_#{Time.now.to_i}.jpg"
      post.photo.attach(
        io: StringIO.new(decoded_image),
        filename: file_name,
        content_type: 'image/jpeg'
      )
    end

    if post.save
      render json: { 
        message: "Post created successfully",
        post: post.as_json.merge(photo_url: post.photo.attached? ? url_for(post.photo) : nil)
      }, status: :created
    else
      render json: { error: post.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # GET /events/:id/posts
  def index_posts
    posts = @event.posts.includes(:user).map do |post|
      {
        id: post.id,
        description: post.description,
        photo_url: post.photo.attached? ? url_for(post.photo) : nil,
        tagged_handles: post.tagged_handles,
        event_name: @event.name,
        bar_name: @event.bar.name,
        country_name: @event.bar.address&.country&.name,
        user_name: post.user.name,
        created_at: post.created_at.strftime('%Y-%m-%d %H:%M:%S')
      }
    end

    render json: { posts: posts }, status: :ok
  end

  # POST events/:id/upload_photo
  def upload_photo
    user = User.find_by(id: params[:user_id])
    targets = params[:targets] # Lista de IDs de usuarios etiquetados
    description = params[:description] # Descripción de la foto
    
    # Configurar la zona horaria a Chile
    Time.zone = 'America/Santiago'
    
    unless user
      render json: { error: "User not found" }, status: :not_found
      return
    end
  
    unless @event
      render json: { error: "Event not found" }, status: :not_found
      return
    end
  
    if params[:image].present?
      decoded_image = Base64.decode64(params[:image])
      
      # Nombre de archivo con timestamp en la zona horaria chilena
      file_name = "#{user.id}_#{Time.zone.now.to_i}.jpg"
  
      # Carpeta donde se guardará la imagen (basada en el nombre del evento)
      event_folder = Rails.root.join('public', 'images', @event.name)
  
      # Crear la carpeta del evento si no existe
      Dir.mkdir(event_folder) unless Dir.exist?(event_folder)
  
      # Ruta completa del archivo dentro de la carpeta del evento
      file_path = event_folder.join(file_name)
  
      # Guardar la imagen en la carpeta específica
      File.open(file_path, 'wb') do |file|
        file.write(decoded_image)
      end
  
      # Guardar los detalles de la imagen en el modelo Photo
      photo = Photo.create!(
        user_id: user.id,
        event_id: @event.id,
        description: description,
        path: "/images/#{@event.name}/#{file_name}"
      )
  
      # Guardar los usuarios etiquetados en el modelo Target
      if targets.present?
        targets.each do |target_id|
          Target.create!(
            user_id: target_id,
            photo_id: photo.id
          )
        end
      end
  
      # Devolver la URL pública de la imagen
      photo_url = photo.path
  
      render json: { message: 'Photo uploaded successfully', photo_url: photo_url, photo_id: photo.id }, status: :ok
    else
      render json: { error: 'Image data is missing' }, status: :unprocessable_entity
    end

    # Logica para el feed
    #
    #
    #
    #
    #
    
  end
  
  
  

  private

  # Set the bar by ID
  def set_bar
    @bar = Bar.find_by(id: params[:bar_id])
    render json: { error: "Bar not found" }, status: :not_found unless @bar
  end

  # Set the event by ID
  def set_event
    @event = Event.find_by(id: params[:id])
    render json: { error: 'Event not found' }, status: :not_found unless @event
  end

  # Whitelist parameters for events
  def event_params
    params.require(:event).permit(
      :name, :description, :date, :start_date, :end_date, :bar_id, :image_base64,
      bar_attributes: [:name, :latitude, :longitude, :address_id]
    )
  end

  # Handle image attachment
  def handle_image_attachment
    decoded_image = decode_image(event_params[:image_base64])
    @event.flyer.attach(io: decoded_image[:io], filename: decoded_image[:filename], content_type: decoded_image[:content_type])
  end
end
