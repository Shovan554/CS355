import os
import requests

# Folder to save images
SAVE_DIR = "dog_breeds"
os.makedirs(SAVE_DIR, exist_ok=True)

# Get all breeds
breeds_url = "https://dog.ceo/api/breeds/list/all"
breeds = requests.get(breeds_url).json()["message"]

print("Total breeds:", len(breeds))

IMAGES_PER_BREED = 20

for breed in breeds.keys():
    breed_folder = os.path.join(SAVE_DIR, breed)
    os.makedirs(breed_folder, exist_ok=True)

    try:
        images_url = f"https://dog.ceo/api/breed/{breed}/images"
        images = requests.get(images_url).json()["message"][:IMAGES_PER_BREED]

        for idx, img_link in enumerate(images):
            img_data = requests.get(img_link).content
            file_path = os.path.join(breed_folder, f"{breed}_{idx}.jpg")

            with open(file_path, "wb") as f:
                f.write(img_data)

        print(f"Downloaded {breed}")

    except Exception as e:
        print(f"Error with {breed}: {e}")
