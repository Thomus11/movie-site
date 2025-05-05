import cloudinary
import cloudinary.uploader
import cloudinary.api

# Configure Cloudinary
cloudinary.config(
  cloud_name='dsrivrpjm',
  api_key='338437774886132',
  api_secret='p4_1z6TU8AEIOsXfO8MPnNKef4E'
)

# Upload a local image
response = cloudinary.uploader.upload("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQq-nmAi-josdg_AUhzjux6A0dMcFLxDm2TTw&s")

# Print the uploaded image URL
print("Image URL:", response['secure_url'])
