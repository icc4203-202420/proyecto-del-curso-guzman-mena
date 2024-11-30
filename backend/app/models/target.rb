class Target < ApplicationRecord
  # Asociación con Photo
  belongs_to :photo
  # Asociación con User, ya que un usuario puede ser etiquetado en una foto
  belongs_to :user

  # Validaciones (si las necesitas)
  validates :photo, presence: true
  validates :user, presence: true
end
