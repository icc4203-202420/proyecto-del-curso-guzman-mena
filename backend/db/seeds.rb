require 'factory_bot_rails'

# Eliminar todos los datos existentes para evitar conflictos
puts "Eliminando todos los datos existentes..."

# Deshabilitar las restricciones de claves foráneas temporalmente
ActiveRecord::Base.connection.execute("PRAGMA foreign_keys = OFF")

# Orden correcto de eliminación de tablas con relaciones
Attendance.destroy_all
Review.destroy_all
Friendship.destroy_all
Event.destroy_all
Bar.destroy_all
Beer.destroy_all
Brand.destroy_all
Brewery.destroy_all
User.destroy_all
Address.destroy_all
Country.destroy_all
ReviewCounter.destroy_all

# Rehabilitar las restricciones de claves foráneas
ActiveRecord::Base.connection.execute("PRAGMA foreign_keys = ON")

puts "Datos eliminados exitosamente."

# Initialize the review counter
ReviewCounter.create(count: 0)

if Rails.env.development?

  # Crear países
  countries = FactoryBot.create_list(:country, 5)

  # Crear cervecerías (breweries) con marcas (brands) y cervezas (beers)
  countries.map do |country|
    FactoryBot.create(:brewery_with_brands_with_beers, countries: [country])
  end

  # Crear usuarios con direcciones asociadas
  users = FactoryBot.create_list(:user, 10) do |user, i|
    user.address.update(country: countries.sample)
  end

  # Crear bares con direcciones y cervezas asociadas, ajustando latitud y longitud
  bars = FactoryBot.create_list(:bar, 10) do |bar|
    bar.address.update(country: countries.sample)

    # Ajustar latitud y longitud cerca de Santiago de Chile
    bar.update(
      latitude: -33.45 + rand(-0.05..0.05),  # Latitud cercana a Santiago
      longitude: -70.65 + rand(-0.05..0.05)  # Longitud cercana a Santiago
    )

    bar.beers << Beer.all.sample(rand(1..3))
  end

  # Crear eventos asociados a los bares
  events = bars.map do |bar|
    FactoryBot.create(:event, bar: bar)
  end

  # Crear relaciones de amistad entre usuarios
  users.combination(2).to_a.sample(5).each do |user_pair|
    FactoryBot.create(:friendship, user: user_pair[0], friend: user_pair[1], bar: bars.sample)
  end

  # Crear attendances (asistencia) de usuarios a eventos
  users.each do |user|
    events.sample(rand(1..3)).each do |event|
      FactoryBot.create(:attendance, user: user, event: event, checked_in: [true, false].sample)
    end
  end

  # Crear reseñas para cada cerveza
  Beer.all.each do |beer|
    3.times do |i|
      FactoryBot.create(:review, text: "Esta es la reseña número #{i+1} para la cerveza #{beer.name}. ¡Es excelente!",
                                rating: rand(1.0..5.0).round(1),
                                beer: beer,
                                user: users.sample) # Asigna una reseña aleatoria de los usuarios creados
    end
  end

end

puts "Seed completado con países, cervezas, usuarios, bares, eventos, amistades, asistencias y reseñas."
