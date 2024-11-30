class CreateTargets < ActiveRecord::Migration[7.1]
  def change
    create_table :targets do |t|
      t.references :photo, null: false, foreign_key: true
      t.references :user, null: false, foreign_key: true
      t.timestamps
    end

    # Aseguramos que las combinaciones de photo_id y user_id sean únicas
    add_index :targets, [:photo_id, :user_id], unique: true
  end
end
