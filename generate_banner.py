import os
from PIL import Image, ImageEnhance, ImageFilter, ImageDraw

def create_banner():
    # Banner specs
    canvas_w, canvas_h = 3000, 800
    
    # Target bounding box for product composition
    # Safe margins: top >= 180, bottom >= 180, left text boundary (1200) + 180 = 1380, right edge = 3000 - 180 = 2820
    target_min_x = 1380
    target_max_x = 2820
    target_min_y = 180
    target_max_y = 620
    
    comp_w = target_max_x - target_min_x # 1440
    comp_h = target_max_y - target_min_y # 440
    
    print(f"Canvas size: {canvas_w}x{canvas_h}")
    print(f"Composition bounding box: [{target_min_x}, {target_min_y}, {target_max_x}, {target_max_y}] ({comp_w}x{comp_h})")

if __name__ == "__main__":
    create_banner()
