class Photo < ApplicationRecord
  # Asociación con User, ya que un user puede publicar varias fotos
  belongs_to :user
  # Asociación con Event, ya que un evento puede tener varias fotos
  belongs_to :event
  # Asociación con Target, ya que una foto puede tener varios etiquetados
  has_many :targets, dependent: :destroy
  # Relación inversa con target
  has_many :users, through: :targets
  
  # Validaciones
  validates :description, presence: true
end
