class API::V1::EventsController < ApplicationController
  include ImageProcessing
  include Authenticable
  respond_to :json
  before_action :set_bar, only: [:index, :create]
  before_action :verify_jwt_token, only: [:create, :update, :destroy]
  before_action :set_event, only: [:show, :update, :destroy, :upload_images]

  # GET /bar/:bar_id/events
  def index
    @bar = Bar.includes(events: { attendances: :user }).find(params[:bar_id]) # Encuentra el bar con eventos y asistencias

    if @bar.events.any?
      render json: { 
        bar: @bar.as_json(include: { address: { include: :country } }), 
        events: @bar.events.as_json(include: { attendances: { include: :user } }) # Incluir asistencias y usuarios
      }, status: :ok
    else
      render json: { message: "No events found for this bar" }, status: :ok
    end
  rescue ActiveRecord::RecordNotFound
    render json: { error: 'Bar not found' }, status: :not_found
  end

  
  # GET /events/:id
  def show
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
