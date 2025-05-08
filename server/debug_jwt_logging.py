# This file contains code snippets to add debug logging for JWT token validation in app.py

# Add this import in app.py
# import logging
# from flask import request

# Add this before_request handler in app.py to log Authorization header
@app.before_request
def log_authorization_header():
    auth_header = request.headers.get('Authorization', None)
    app.logger.debug(f"Authorization header: {auth_header}")

# Enhance the invalid_token_loader to log error details
@jwt.invalid_token_loader
def invalid_token_callback(error):
    app.logger.error(f"Invalid token error: {error}")
    return jsonify({"message": "Invalid token"}), 422

# Similarly, enhance other JWT error handlers to log errors if needed
