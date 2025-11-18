module Core
  class TaskStatusUpdater
    attr_reader :task, :new_status, :errors

    def initialize(task, new_status)
      @task = task
      @new_status = new_status
      @errors = []
    end

    def call
      return false unless valid?

      ActiveRecord::Base.transaction do
        update_task_status
        log_activity
      end

      return true
    rescue StandardError => e
      @errors << e.message
      return false
    end

    # Private Methods
    private

    def valid?
      if task.status == new_status
        @errors << "Task is already #{new_status}"
        return false
      end

      return true
    end

    def update_task_status
      task.update!(status: new_status)
    end

    def log_activity
      Core::Activity.create!(
        record: task,
        action: "status_changed_to_#{new_status}",
        metadata: {
          old_status: task.status_was,
          new_status: new_status,
          changed_at: Time.current
        }
      )
    end
  end
end