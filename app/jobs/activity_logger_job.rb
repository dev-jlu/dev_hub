class ActivityLoggerJob < ApplicationJob
  queue_as :default

  # Retry configuration
  retry_on StandardError, wait: 5.seconds, attempts: 3

  def perform(record, action, metadata = {})
    # record = Task/Project/..etc
    Core::Activity.create!(
      record: record,
      action: action,
      metadata: metadata.merge(
        performed_at: Time.current,
        job_id: job_id
      )
    )

    Rails.logger.info("Activity logged #{action} for #{record.class.name}##{record.id}")
  rescue StandardError => e
    Rails.logger.error("Failed to log activity: #{e.message}")
    raise e # Re-raise to trigger retry
  end
end
