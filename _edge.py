from PIL import Image

im = Image.open(r"C:\Users\73B5~1\AppData\Local\Temp\welcome-type.png").convert("RGB")
px = im.load()

def bright(x, y):
    r, g, b = px[x, y]
    return r > 180 and g > 170 and b > 185

bands = []
for y in range(180, 700):
    xs = [x for x in range(40, 480) if bright(x, y)]
    if xs:
        bands.append((y, min(xs)))

groups = []
current = None
for y, x0 in bands:
    if current and y <= current[2] + 2:
        current[2] = y
        current[1] = min(current[1], x0)
    else:
        if current:
            groups.append(current)
        current = [y, x0, y]
if current:
    groups.append(current)

for g in groups:
    print(g)
