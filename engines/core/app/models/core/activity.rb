module Core
  class Activity < ApplicationRecord
    # Validations
    validates :action, presence: true

    # Associations
    belongs_to :record, polymorphic: true
  end
end
