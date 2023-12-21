class ApplicationController < ActionController::Base
  # Disable CSRF protection for API requests since we don't use session for this testing purpose
  # For proper API, we can use token-based authentication or pass the CSRF to be stored in the client
  # Reference: https://blog.eq8.eu/article/rails-api-authentication-with-spa-csrf-tokens.html
  protect_from_forgery with: :null_session
end
