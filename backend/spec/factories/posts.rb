FactoryBot.define do
  factory :post do
    user { nil }
    event { nil }
    description { "MyString" }
    tagged_handles { "" }
  end
end
