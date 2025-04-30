import secrets

secret_key = secrets.token_urlsafe(24)  # ~32 characters
print(secret_key)
