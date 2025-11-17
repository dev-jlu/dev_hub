class CreateCoreActivities < ActiveRecord::Migration[7.1]
  def change
    create_table :core_activities do |t|
      t.references :record, polymorphic: true, null: false
      t.string :action, null: false
      t.jsonb :metadata, default: {}

      t.timestamps
    end

    add_index :core_activities, [:record_type, :record_id]
    add_index :core_activities, :created_at
  end
end
