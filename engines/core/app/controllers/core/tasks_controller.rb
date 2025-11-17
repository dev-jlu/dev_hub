module Core
  class TasksController < Core::ApplicationController
    before_action :set_project, only: [:index, :create]
    before_action :set_task, only: [:show, :update, :destroy]

    # GET /projects/:project_id/tasks
    def index
      @tasks = @project.tasks.recent
      render json: @tasks
    end

    # GET /tasks/:id
    def show
      render json: @task, include: [:project, :assignee]
    end

    # POST /projects/:project_id/tasks
    def create
      @task = @project.tasks.build(task_params)

      if @task.save
        render json: @task, status: :created
      else
        render json: { 
          errors: @task.errors.full_messages 
        }, status: :unprocessable_entity
      end
    end

    # PATCH /core/tasks/:id
    def update
      if params[:status].present?
        updater = Core::TaskStatusUpdater.new(@task, params[:status])
        if updater.call
          render json: @task.reload
        else
          render json: {
            errors: updater.errors
          }, status: :unprocessable_entity
        end
      elsif @task.update(task_params)
        render json: @task
      else
        render json: {
          errors: @task.errors.full_messages
        }, status: :unprocessable_entity
      end
    end

    # DELETE /core/tasks/:id
    def destroy
      @task.destroy
      head :no_content
    end

    # Private Methods
    private

    def set_project
      @project = Core::Project.find(params[:project_id])
    end

    def set_task
      @task = Core::Task.find(params[:id])
    end

    def task_params
      params.require(:task).permit(
        :title,
        :description,
        :status,
        :assignee_id,
        :assignee_type
      )
    end
  end
end
