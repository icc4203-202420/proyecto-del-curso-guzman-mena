class Attendance < ApplicationRecord
  belongs_to :user
  belongs_to :event
  validates :user_id, uniqueness: { scope: :event_id, message: "Ya estás registrado para este evento" }

  def check_in
    update(checked_in: true)
  end  
end
