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

      return task.update!(status: new_status)
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
  end
end