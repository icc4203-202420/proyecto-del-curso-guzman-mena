class Event < ApplicationRecord
  belongs_to :bar
  has_many :attendances
  has_many :users, through: :attendances
  has_many_attached :images
  has_many :photos


  has_one_attached :flyer

  def thumbnail
    flyer.variant(resize_to_limit: [200, nil]).processed
  end 
  def images_urls
    images.map { |image| Rails.application.routes.url_helpers.url_for(image) }
  end

end
