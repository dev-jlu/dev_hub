class CreateCoreTasks < ActiveRecord::Migration[7.1]
  def change
    create_table :core_tasks do |t|
      t.string :title, null: false
      t.text :description
      t.string :status, default: 'pending', null: false
      t.references :project, null: false, foreign_key: { to_table: :core_projects }
      # Polymorphic association (assignee can be User or other types)
      t.references :assignee, polymorphic: true, null: true

      t.timestamps
    end

    add_index :core_tasks, :status
    add_index :core_tasks, [:assignee_type, :assignee_id]
  end
end
