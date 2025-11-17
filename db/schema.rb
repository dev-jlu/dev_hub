# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.1].define(version: 2025_11_17_063744) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "core_activities", force: :cascade do |t|
    t.string "record_type", null: false
    t.bigint "record_id", null: false
    t.string "action", null: false
    t.jsonb "metadata", default: {}
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["created_at"], name: "index_core_activities_on_created_at"
    t.index ["record_type", "record_id"], name: "index_core_activities_on_record"
    t.index ["record_type", "record_id"], name: "index_core_activities_on_record_type_and_record_id"
  end

  create_table "core_projects", force: :cascade do |t|
    t.string "name", null: false
    t.text "description"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["name"], name: "index_core_projects_on_name"
  end

  create_table "core_tasks", force: :cascade do |t|
    t.string "title", null: false
    t.text "description"
    t.string "status", default: "pending", null: false
    t.bigint "project_id", null: false
    t.string "assignee_type"
    t.bigint "assignee_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["assignee_type", "assignee_id"], name: "index_core_tasks_on_assignee"
    t.index ["assignee_type", "assignee_id"], name: "index_core_tasks_on_assignee_type_and_assignee_id"
    t.index ["project_id"], name: "index_core_tasks_on_project_id"
    t.index ["status"], name: "index_core_tasks_on_status"
  end

  create_table "users", force: :cascade do |t|
    t.string "name", null: false
    t.string "email", null: false
    t.string "crypted_password", null: false
    t.string "password_salt", null: false
    t.string "persistence_token", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["persistence_token"], name: "index_users_on_persistence_token", unique: true
  end

  add_foreign_key "core_tasks", "core_projects", column: "project_id"
end
