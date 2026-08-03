import os
from PIL import Image, ImageEnhance, ImageFilter, ImageDraw

def crop_transparent(img):
    """Crops transparent padding around an RGBA image."""
    bbox = img.getbbox()
    if bbox:
        return img.crop(bbox)
    return img

def create_drop_shadow(img, offset=(0, 10), blur=14, alpha_factor=0.30):
    """Creates a realistic soft contact drop shadow for an RGBA product image."""
    alpha = img.split()[-1]
    shadow = Image.new('RGBA', img.size, (0, 0, 0, 0))
    black = Image.new('RGBA', img.size, (5, 15, 30, 255))
    shadow.paste(black, (0, 0), alpha)
    shadow = shadow.filter(ImageFilter.GaussianBlur(blur))
    r, g, b, a = shadow.split()
    a = a.point(lambda p: int(p * alpha_factor))
    return Image.merge('RGBA', (r, g, b, a))

def generate_banner(theme='light'):
    canvas_w, canvas_h = 3000, 800
    
    # 1. Base Canvas (3000 x 800)
    if theme == 'light':
        # Primary background colour: #CAE3FD (202, 227, 253)
        # Supporting colours: #AFD2F7 (175, 210, 247), #C5DEF9 (197, 222, 249), #EAF4FF (234, 244, 255)
        bg = Image.new('RGBA', (canvas_w, canvas_h), (202, 227, 253, 255))
        draw_bg = ImageDraw.Draw(bg)

        # Smooth 4-color gradient blend from left to right
        for x in range(canvas_w):
            t = x / canvas_w
            if t < 0.30:
                # Far left: Crisp clean negative space (#EAF4FF -> #CAE3FD)
                factor = t / 0.30
                r = int(234 + (202 - 234) * factor)
                g = int(244 + (227 - 244) * factor)
                b = int(255 + (253 - 255) * factor)
            elif t < 0.65:
                # Middle transition (#CAE3FD -> #C5DEF9)
                factor = (t - 0.30) / 0.35
                r = int(202 + (197 - 202) * factor)
                g = int(227 + (222 - 227) * factor)
                b = int(253 + (249 - 253) * factor)
            else:
                # Right side (#C5DEF9 -> #AFD2F7 with clean high-key studio white)
                factor = (t - 0.65) / 0.35
                r = int(197 + (175 - 197) * factor)
                g = int(222 + (210 - 222) * factor)
                b = int(249 + (247 - 249) * factor)
            draw_bg.line([(x, 0), (x, canvas_h)], fill=(r, g, b, 255))

        # High-Key Laboratory Ambient Studio Lighting & Depth Highlights (100% Continuous)
        lab_glow = Image.new('RGBA', (canvas_w, canvas_h), (0, 0, 0, 0))
        lab_draw = ImageDraw.Draw(lab_glow)
        
        # Soft studio softbox highlight over right laboratory area (x: 1500 to 2900)
        lab_draw.ellipse([1400, -100, 2900, 700], fill=(255, 255, 255, 45))
        lab_draw.ellipse([1700, 100, 2800, 600], fill=(255, 255, 255, 35))
        
        # Soft medical blue ambient depth spotlight (#005B82)
        for radius in range(600, 0, -8):
            alpha = int(22 * (1.0 - radius / 600.0))
            lab_draw.ellipse(
                [2100 - radius * 1.4, 400 - radius * 0.6, 2100 + radius * 1.4, 400 + radius * 0.6],
                fill=(0, 91, 130, alpha)
            )
            
        # High-key pure white central reflection softbox
        for radius in range(400, 0, -8):
            alpha = int(18 * (1.0 - radius / 400.0))
            lab_draw.ellipse(
                [2250 - radius * 1.1, 380 - radius * 0.5, 2250 + radius * 1.1, 380 + radius * 0.5],
                fill=(255, 255, 255, alpha)
            )
            
        # Heavy Gaussian Blur to guarantee ZERO rectangular patch or visible borders
        lab_glow = lab_glow.filter(ImageFilter.GaussianBlur(55))
        bg = Image.alpha_composite(bg, lab_glow)


        # Draw Thin White Scientific Wave Lines & Molecular Network Graphics
        sci_layer = Image.new('RGBA', (canvas_w, canvas_h), (0, 0, 0, 0))
        sci_draw = ImageDraw.Draw(sci_layer)

        import math
        # 1. Scientific Sine Wave Lines
        wave_params = [
            {'amp': 45, 'freq': 0.0035, 'phase': 0.0, 'y_offset': 260, 'alpha': 110, 'width': 2},
            {'amp': 65, 'freq': 0.0028, 'phase': 1.2, 'y_offset': 380, 'alpha': 90,  'width': 2},
            {'amp': 35, 'freq': 0.0042, 'phase': 2.5, 'y_offset': 520, 'alpha': 130, 'width': 1},
            {'amp': 80, 'freq': 0.0020, 'phase': 0.8, 'y_offset': 440, 'alpha': 70,  'width': 2},
        ]
        for w in wave_params:
            points = []
            for x in range(0, 1800, 4):
                y = int(w['y_offset'] + w['amp'] * math.sin(x * w['freq'] + w['phase']))
                points.append((x, y))
            sci_draw.line(points, fill=(255, 255, 255, w['alpha']), width=w['width'])

        # 2. Molecular Network Graph Nodes & Benzene Rings (Hexagons)
        def draw_hexagon(center_x, center_y, radius, alpha=140):
            pts = []
            for i in range(6):
                angle = math.pi / 3 * i
                px = center_x + radius * math.cos(angle)
                py = center_y + radius * math.sin(angle)
                pts.append((px, py))
            sci_draw.polygon(pts, outline=(255, 255, 255, alpha), width=2)
            # Inner circle for chemical aromatic ring
            sci_draw.ellipse([center_x - radius*0.5, center_y - radius*0.5, center_x + radius*0.5, center_y + radius*0.5], outline=(255, 255, 255, int(alpha*0.6)), width=1)
            return pts

        hex_centers = [(220, 240, 42), (320, 480, 50), (640, 280, 45), (780, 540, 40), (1050, 320, 48)]
        nodes = []
        for hc_x, hc_y, r in hex_centers:
            pts = draw_hexagon(hc_x, hc_y, r)
            nodes.extend(pts)

        # Additional connecting molecular node points
        extra_nodes = [(140, 150), (450, 220), (520, 580), (880, 210), (940, 460), (1180, 260), (1280, 510)]
        for en in extra_nodes:
            nodes.append((float(en[0]), float(en[1])))

        # Draw connecting bonds between close nodes
        for i in range(len(nodes)):
            n1 = nodes[i]
            for j in range(i + 1, len(nodes)):
                n2 = nodes[j]
                dist = math.hypot(n1[0] - n2[0], n1[1] - n2[1])
                if 35 < dist < 160:
                    alpha_bond = int(120 * (1.0 - dist / 160.0))
                    sci_draw.line([n1, n2], fill=(255, 255, 255, alpha_bond), width=1)

        # Draw Glowing Molecular Node Dots
        for n in nodes:
            nx, ny = int(n[0]), int(n[1])
            sci_draw.ellipse([nx - 4, ny - 4, nx + 4, ny + 4], fill=(255, 255, 255, 220))
            sci_draw.ellipse([nx - 8, ny - 8, nx + 8, ny + 8], outline=(175, 210, 247, 160), width=1)

        # 3. Soft Glowing Ambient Particles
        import random
        random.seed(42)
        for _ in range(60):
            px = random.randint(50, 1600)
            py = random.randint(40, 760)
            pr = random.randint(3, 10)
            pa = random.randint(40, 140)
            sci_draw.ellipse([px - pr, py - pr, px + pr, py + pr], fill=(255, 255, 255, pa))

        bg = Image.alpha_composite(bg, sci_layer)

        # Oxentra Blue Ambient Spotlight (#005B82) & Soft Highlight (#F07D00)
        glow = Image.new('RGBA', (canvas_w, canvas_h), (0, 0, 0, 0))
        glow_draw = ImageDraw.Draw(glow)
        center_x, center_y = 2100, 400
        
        for radius in range(560, 0, -6):
            alpha = int(24 * (1.0 - radius / 560.0))
            glow_draw.ellipse(
                [center_x - radius * 1.5, center_y - radius * 0.65, center_x + radius * 1.5, center_y + radius * 0.65],
                fill=(0, 91, 130, alpha)
            )
            
        for radius in range(360, 0, -6):
            alpha = int(12 * (1.0 - radius / 360.0))
            glow_draw.ellipse(
                [center_x - radius * 1.2 + 260, center_y - radius * 0.5 - 35, center_x + radius * 1.2 + 260, center_y + radius * 0.5 - 35],
                fill=(240, 125, 0, alpha)
            )
            
        glow = glow.filter(ImageFilter.GaussianBlur(35))
        bg = Image.alpha_composite(bg, glow)
        
        # Soft Ground Shadow Base under products
        floor = Image.new('RGBA', (canvas_w, canvas_h), (0, 0, 0, 0))
        floor_draw = ImageDraw.Draw(floor)
        floor_draw.ellipse([1370, 570, 2810, 635], fill=(0, 43, 62, 32))
        floor = floor.filter(ImageFilter.GaussianBlur(20))
        bg = Image.alpha_composite(bg, floor)

    # 2. Load & Crop Products
    vp_dir = 'images/view_product'
    product_files = [
        'CALCINTRA.png',
        'GLIDEPLUS.png',
        'HEAVE ENEMA.png',
        'HEAVE-S.png',
        'LXENTRA.png',
        'NERVOX.png',
        'OXENTIB.png',
        'OXRIZINE.png',
        'PXENTRA.png'
    ]
    
    products = {}
    for pf in product_files:
        path = os.path.join(vp_dir, pf)
        raw_img = Image.open(path).convert('RGBA')
        products[pf] = crop_transparent(raw_img)

    # 3. Layout Calibration
    layout = [
        # --- REAR ROW ---
        {'name': 'HEAVE-S.png',     'x_center': 1460, 'y_bottom': 525, 'target_h': 305},
        {'name': 'OXENTIB.png',     'x_center': 1760, 'y_bottom': 505, 'target_h': 240},
        {'name': 'GLIDEPLUS.png',   'x_center': 2090, 'y_bottom': 515, 'target_h': 295},
        {'name': 'OXRIZINE.png',    'x_center': 2400, 'y_bottom': 505, 'target_h': 245},
        {'name': 'CALCINTRA.png',   'x_center': 2690, 'y_bottom': 515, 'target_h': 240},
        
        # --- FRONT ROW ---
        {'name': 'NERVOX.png',      'x_center': 1605, 'y_bottom': 600, 'target_h': 250},
        {'name': 'LXENTRA.png',     'x_center': 1925, 'y_bottom': 595, 'target_h': 160},
        {'name': 'PXENTRA.png',     'x_center': 2250, 'y_bottom': 600, 'target_h': 255},
        {'name': 'HEAVE ENEMA.png', 'x_center': 2560, 'y_bottom': 600, 'target_h': 260},
    ]

    prod_layer = Image.new('RGBA', (canvas_w, canvas_h), (0, 0, 0, 0))
    
    for item in layout:
        p_name = item['name']
        img = products[p_name]
        orig_w, orig_h = img.size
        
        target_h = item['target_h']
        scale = target_h / orig_h
        target_w = int(orig_w * scale)
        
        resized = img.resize((target_w, target_h), Image.Resampling.LANCZOS)
        
        x_left = int(item['x_center'] - target_w / 2)
        y_top = int(item['y_bottom'] - target_h)
        
        # Shadow
        shadow = create_drop_shadow(resized, offset=(0, 10), blur=14, alpha_factor=0.30)
        prod_layer.paste(shadow, (x_left, y_top + 6), shadow)
        
        # Product
        prod_layer.paste(resized, (x_left, y_top), resized)

    # Composite banner
    banner = Image.alpha_composite(bg, prod_layer)
    
    # Save outputs
    banner.save('images/corporate_banner.png', 'PNG')
    banner.convert('RGB').save('images/background (3).png', 'PNG')
    banner.convert('RGB').save('images/background (2).png', 'PNG')
    banner.convert('RGB').save('images/hero-bg-showcase.png', 'PNG')
    print("Saved: images/corporate_banner.png, images/background (3).png, images/background (2).png, images/hero-bg-showcase.png")

if __name__ == "__main__":
    generate_banner('light')
