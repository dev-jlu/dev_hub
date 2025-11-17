module Admin
  class DashboardController < ApplicationController

    # GET /admin/dashboard
    def index
      @stats = {
        total_projects: Core::Project.count,
        total_tasks: Core::Task.count,
        completed_tasks: Core::Task.completed.count,
        pending_tasks: Core::Task.pending.count,
        in_progress_tasks: Core::Task.in_progress.count,
        total_users: User.count,
        recent_activities: Core::Activity.recent.limit(10)
      }

      render json: @stats
    end

    # GET /admin/dashboard/stats
    def stats
      @detailed_stats = {
        projects: project_stats,
        tasks: task_stats,
        users: user_stats,
        activities: activity_stats
      }

      render json: @detailed_stats
    end

    # Private Methods
    private

    def project_stats
      return {
        total: Core::Project.count,
        recent: Core::Project.recent,
        by_month: projects_by_month
      }
    end

    def projects_by_month
      return Core::Project.group("DATE_TRUNC('month', created_at)").count
    end

    def task_stats
      return {
        total: Core::Task.count,
        by_status: Core::Task.group(:status).count,
        completion_tate: calculate_completion_rate
      }
    end

    def calculate_completion_rate
      total = Core::Task.count
      return 0 if total.zero?

      completed = Core::Task.completed.count
      return ((completed.to_f / total.to_f) * 100).round(2)
    end

    def user_stats
      return {
        total: User.count,
        with_tasks: User.joins(:assigned_tasks).distinct.count
      }
    end

    def activity_stats
      return {
        total: Core::Activity.count,
        recent: Core::Activity.recent(20)
      }
    end
  end
end
