class API::V1::EventsController < ApplicationController
  include ImageProcessing
  include Authenticable
  respond_to :json
  before_action :set_bar, only: [:index, :create]
  before_action :verify_jwt_token, only: [:create, :update, :destroy]
  before_action :set_event, only: [:show, :update, :destroy, :upload_images, :upload_photo]

  # GET /bar/:bar_id/events
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

  def upload_images
    if params[:images].present?
      params[:images].each do |image|
        @event.images.attach(image)
      end
      render json: { message: 'Images uploaded successfully.' }, status: :ok
    else
      render json: { error: 'No images provided.' }, status: :unprocessable_entity
    end
  end

  # Nueva acción para subir una foto al evento y guardarla en la carpeta public
  def upload_photo
    event = Event.find(params[:id])

    # Verifica si se ha recibido el parámetro `image` en formato Base64
    if params[:image].present?
      # Eliminar el prefijo `data:image/jpeg;base64,` o similar
      base64_image = params[:image].sub(/^data:image\/\w+;base64,/, '')

      # Decodificar la imagen en formato Base64
      image_data = Base64.decode64(base64_image)

      # Definir un nombre de archivo único
      filename = "event_#{event.id}_#{SecureRandom.uuid}.jpg"

      # Guardar la imagen en el sistema de archivos (carpeta `public/uploads`)
      filepath = Rails.root.join("public/uploads/#{filename}")
      File.open(filepath, 'wb') do |file|
        file.write(image_data)
      end

      # Opcional: Guardar la ruta de la imagen en el modelo `Event`
      event.update(photo_path: "/uploads/#{filename}")

      render json: { success: true, path: event.photo_path }, status: :ok
    else
      render json: { error: "No se envió ninguna imagen" }, status: :unprocessable_entity
    end
  rescue ActiveRecord::RecordNotFound
    render json: { error: "Evento no encontrado" }, status: :not_found
  rescue StandardError => e
    render json: { error: "Error al procesar la imagen: #{e.message}" }, status: :internal_server_error
  end
  

  private

  # Verificar que el evento pertenece al bar adecuado
  def set_bar
    @bar = Bar.find_by(id: params[:bar_id])
    render json: { error: "Bar not found" }, status: :not_found unless @bar
  end

  def set_event
    @event = Event.find(params[:id])
    render json: { error: 'Event not found' }, status: :not_found unless @event
  end

  def event_params
    params.require(:event).permit(
      :name, :description, :date, :start_date, :end_date, :bar_id, :image_base64,
      bar_attributes: [:name, :latitude, :longitude, :address_id]
    )
  end

  def handle_image_attachment
    decoded_image = decode_image(event_params[:image_base64])
    @event.flyer.attach(io: decoded_image[:io], filename: decoded_image[:filename], content_type: decoded_image[:content_type])
  end
end
