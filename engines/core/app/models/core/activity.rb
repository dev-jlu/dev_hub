module Core
  class Activity < ApplicationRecord
    # Validations
    validates :action, presence: true

    # Associations
    belongs_to :record, polymorphic: true

    # Scopes
    scope :recent, ->(limit = 50) { order(created_at: :desc).limit(limit) }
  end
end
