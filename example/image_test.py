from PIL import Image
import PIL
print(PIL)
print(Image)
print(Image.Image)
test = PIL.Image.new('RGB', (100, 100))
test.show()

# Open an image
img = Image.open("corgi.png")

print(img)

print(img.getpixel((0, 0)))

width, height = img.size()
for x in range(0, width):
    for y in range(0, height):
        r, g, b, a = img.getpixel((x, y))
        img.putpixel((x, y), (255, g, b, a))

img.show()