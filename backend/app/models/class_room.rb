class ClassRoom < ApplicationRecord
  validates :name, presence: true
  validates :tubeUnits, comparison: { greater_than: 0 }
  validates :fluorescentTubes, comparison: { greater_than: 1 }
end
