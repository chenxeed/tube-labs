class ApplicationController < ActionController::Base
  # Disable CSRF protection for API requests since we don't use session for this testing purpose
  protect_from_forgery with: :null_session
end
