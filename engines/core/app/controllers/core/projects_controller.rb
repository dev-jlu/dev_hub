module Core
  class ProjectsController < Core::ApplicationController
    before_action :set_project, only: [:show, :update, :destroy]

    # GET /core/projects
    def index
      @projects = Core::Project.all
      render json: @projects
    end

    # GET /core/projects/:id
    def show
      render json: @project, include: :tasks
    end

    # POST /core/projects
    def create
      @project = Core::Project.new(project_params)

      if @project.save
        render json: @project, status: :created
      else
        render json: {
          errors: @project.errors.full_messages
        }, status: :unprocessable_entity
      end
    end

    # PATCH /core/projects/:id
    def update
      if @project.update(project_params)
        render json: @project
      else
        render json: {
          errors: @project.errors.full_messages
        }, status: :unprocessable_entity
      end
    end

    # DELETE /core/projects/:id
    def destroy
      @project.destroy
      head :no_content
    end

    # Private Methods
    private

    def set_project
      @project = Core::Project.find(params[:id])
    end

    def project_params
      params.require(:project).permit(:name, :description)
    end
  end
end
