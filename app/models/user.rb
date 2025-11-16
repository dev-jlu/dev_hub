class User < ApplicationRecord
  # Authlogic Configuration
  acts_as_authentic do |c|
    c.crypto_provider = Authlogic::CryptoProviders::SCrypt
  end

  # Required for Authlogic 5.x+ password confirmation
  attr_accessor :password_confirmation

  # Password validations
  validates :password, confirmation: true, if: :require_password?
  validates :password_confirmation, presence: true, if: :require_password?

  # Validations
  validates :name, presence: true
  validates :email, presence: true, uniqueness: { case_sensitive: false }, format: { with: URI::MailTo::EMAIL_REGEXP }

  # Associations
  has_many :assigned_tasks, as: :assignee, class_name: "Core::Task"
end
