class AddForeignKeyToBarInFriendships < ActiveRecord::Migration[7.0]
  def change
    add_foreign_key :friendships, :bars, column: :bar_id, on_delete: :nullify
  end
end
