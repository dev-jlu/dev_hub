module Core
  class Task < ApplicationRecord
    # Status enum
    enum :status, {
      pending: 'pending',
      in_progress: 'in_progress',
      completed: 'completed',
      cancelled: 'cancelled'
    }, default: :pending

    # Validations
    validates :title, presence: true
    validates :description, length: { maximum: 2000 }

    # Associations
    belongs_to :project, class_name: "Core::Project"
    belongs_to :assignee, polymorphic: true, optional: true

    # Scopes
    scope :recent, ->(limit = 10) { order(created_at: :desc).limit(limit) }
    scope :assigned_to, ->(user) { where(assignee: user) }

    # # Callbacks
    # after_save :log_status_change, if: :saved_change_to_status?

    # # Private Methods
    # private

    # def log_status_change
    #   ActivityLoggerJob.perform_later(self, "status_changed")
    # end
  end
end
