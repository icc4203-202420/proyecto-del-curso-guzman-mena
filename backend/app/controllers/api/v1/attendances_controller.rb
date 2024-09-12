class API::V1::AttendancesController < ApplicationController
  before_action :set_event

  def create
    attendance = Attendance.new(user_id: params[:user_id], event_id: @event.id)

    if attendance.save
      render json: { message: "Asistencia confirmada." }, status: :created
    else
      render json: { error: attendance.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def index
    attendees = @event.attendances.includes(:user).map do |attendance|
      {
        first_name: attendance.user.first_name,
        last_name: attendance.user.last_name
      }
    end
    render json: { attendees: attendees }, status: :ok
  end

  private

  def set_event
    @event = Event.find(params[:event_id])
    render json: { error: "Evento no encontrado" }, status: :not_found unless @event
  end
end