class CreateClassRooms < ActiveRecord::Migration[7.1]
  def change
    create_table :class_rooms do |t|
      t.string :name
      t.integer :tubeUnits
      t.integer :fluorescentTubes
      t.integer :brokenTubes
      t.integer :cost
      t.boolean :isSimulated

      t.timestamps
    end
  end
end
