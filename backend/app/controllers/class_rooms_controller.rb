class ClassRoomsController < ApplicationController
  before_action :set_class_room, only: [:show, :update, :destroy]

  # GET /class_rooms
  def index
    @class_rooms = ClassRoom.order(created_at: :desc)

    render json: @class_rooms
  end

  # GET /class_rooms/1
  def show
    render json: @class_room
  end

  # POST /class_rooms
  def create
    @class_room = ClassRoom.new(class_room_params)

    if @class_room.save
      render json: @class_room, status: :created, location: @class_room
    else
      render json: @class_room.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /class_rooms/1
  def update
    if @class_room.update(class_room_params)
      render json: @class_room
    else
      render json: @class_room.errors, status: :unprocessable_entity
    end
  end

  # DELETE /class_rooms/1
  def destroy
    @class_room.destroy
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_class_room
    @class_room = ClassRoom.find(params[:id])
  end

  # Only allow a list of trusted parameters through.
  def class_room_params
    params.require(:class_room).permit(:name, :tubeUnits, :fluorescentTubes, :brokenTubes, :cost, :isSimulated)
  end
end