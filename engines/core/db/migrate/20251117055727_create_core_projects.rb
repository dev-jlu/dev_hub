class CreateCoreProjects < ActiveRecord::Migration[7.1]
  def change
    create_table :core_projects do |t|
      t.string :name, null: false
      t.text :description

      t.timestamps
    end

    add_index :core_projects, :name
  end
end
