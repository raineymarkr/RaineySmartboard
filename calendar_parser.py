import requests
from bs4 import BeautifulSoup
from PIL import Image
from datetime import datetime, timedelta
import calendar

# URL of the calendar image
calendar_url = 'https://www.marybaustinelementary.com/lunch'

# Download the image
response = requests.get(calendar_url)
if response.status_code == 200:
    soup = BeautifulSoup(response.content, 'html.parser')
    breakfast = soup.find('img', title = 'menu')
    lunch = soup.find('img', title = 'food')
    breakfast_img = requests.get(breakfast['src'])
    lunch_img = requests.get(lunch['src'])
    with open(r'./site/public/breakfast/breakfast-menu.png', 'wb') as file:
        file.write(breakfast_img.content)
    with open(r'./site/public/lunch/lunch-menu.png', 'wb') as file:
        file.write(lunch_img.content)

breakfast_menu = []
lunch_menu=[]

def processImg(menu, output):
    # Open the image
    img = Image.open(f'./{output}/{menu}')

    # Define the start point (top left corner of the first box) and the box size
    start_x, start_y = 29, 200  # example values
    box_width, box_height = 180, 102  # example values

    # Define the number of boxes and the offset for the next row
    num_boxes_x, num_boxes_y = 5, 7  # Monday to Friday, rows for each week
    x_offset, y_offset = 12, 10  # space between boxes, if any
    
    # Initialize the date for the first box
    current_date = datetime.now()
    
    # Find the last day of the month
    last_day = calendar.monthrange(current_date.year, current_date.month)[1]

    # Crop and save function updated for the specific calendar structure
    def crop_and_save(day_index, current_date):
        col = day_index % num_boxes_x  # Column index (Monday=0, Tuesday=1, ..., Friday=4)
        row = day_index // num_boxes_x  # Row index
        left = start_x + col * (box_width + x_offset)
        top = start_y + row * (box_height + y_offset)
        right = left + box_width
        bottom = top + box_height

        # Check if the current date is within the month
        if current_date.day <= last_day:
            
            # Check if the current day is a weekday
            if col < 5:
                cropped_img = img.crop((left, top, right, bottom))
                file_name = f'./{output}/{current_date.strftime("%Y-%m-%d")}.png'
                cropped_img.save(file_name)
                return current_date + timedelta(days=1)
            else:
                return current_date
        return None  # Return None if the date is past the last day of the month

    # Crop and save each day's image
    for day_index in range(num_boxes_x * num_boxes_y):
        # Skip the increment if the current day is a weekend or past the last day of the month
        if current_date is not None and current_date.weekday() < 5:
            crop_and_save(day_index, current_date)
        # Increment the date to the next day if it's within the month
        if current_date is not None and current_date.day <= last_day:
            current_date += timedelta(days=1)
        # Check if the next day is a Monday or if we are moving to the next month
        while current_date is not None and current_date.weekday() > 4 and current_date.day <= last_day:
            current_date += timedelta(days=1)

processImg('breakfast-menu.png', './site/public/breakfast/')
processImg('lunch-menu.png', './site/public/lunch/')