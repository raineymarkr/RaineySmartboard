import requests
from PIL import Image

# URL of the calendar image
calendar_url = 'https://content.myconnectsuite.com/api/documents/c1881394438f4ddda263d6a61624f9fe.png'

# Download the image
response = requests.get(calendar_url)
if response.status_code == 200:
    with open('school-menu.jpg', 'wb') as file:
        file.write(response.content)

# Open the image
img = Image.open('school-menu.jpg')

# Define the start point (top left corner of the first box) and the box size
# These values need to be calibrated manually by inspecting the image
start_x, start_y = 29, 200  # example values
box_width, box_height = 184, 102  # example values

# Define the number of boxes and the offset for the next row
num_boxes_x, num_boxes_y = 5, 7  # Monday to Friday, rows for each week
x_offset, y_offset = 8, 10  # space between boxes, if any

# Crop and save function updated for the specific calendar structure
def crop_and_save(day, start_x, start_y, box_width, box_height):
    left = start_x + (day % num_boxes_x) * (box_width + x_offset)
    top = start_y + (day // num_boxes_x) * (box_height + y_offset)
    right = left + box_width
    bottom = top + box_height
    
    # Assuming the calendar does not have meals on weekends
    if (day % num_boxes_x) < 5:
        cropped_img = img.crop((left, top, right, bottom))
        cropped_img.save(f'./day_{day + 1}.png')

# Crop and save each day's image
for day in range(num_boxes_x * num_boxes_y):
    crop_and_save(day, start_x, start_y, box_width, box_height)
