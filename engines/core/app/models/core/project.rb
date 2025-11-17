module Core
  class Project < ApplicationRecord
    # Validations
    validates :name, presence: true, uniqueness: true
    validates :description, length: { maximum: 1000 }

    # Associations
    has_many :tasks, class_name: "Core::Task", dependent: :destroy

    # Scopes
    scope :recent, ->(limit = 10) { order(created_at: :desc).limit(limit) }
  end
end
