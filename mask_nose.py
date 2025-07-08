import sys
import cv2
import mediapipe as mp
import numpy as np

if len(sys.argv) != 3:
    print("Usage: python mask_nose.py <input_image> <output_mask>")
    sys.exit(1)

input_path = sys.argv[1]
output_path = sys.argv[2]

# Load image
image = cv2.imread(input_path)
if image is None:
    print("Failed to load image")
    sys.exit(1)

h, w, _ = image.shape

# Initialize MediaPipe Face Mesh
mp_face_mesh = mp.solutions.face_mesh
face_mesh = mp_face_mesh.FaceMesh(static_image_mode=True, max_num_faces=1)

# Convert to RGB
rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
results = face_mesh.process(rgb)

mask = np.zeros((h, w), dtype=np.uint8)

if results.multi_face_landmarks:
    face_landmarks = results.multi_face_landmarks[0]
    # Nose tip landmark index for MediaPipe: 1
    nose_tip = face_landmarks.landmark[1]
    cx, cy = int(nose_tip.x * w), int(nose_tip.y * h)
    try:
        left_cheek = face_landmarks.landmark[234]
        right_cheek = face_landmarks.landmark[454]
        lx, ly = int(left_cheek.x * w), int(left_cheek.y * h)
        rx, ry = int(right_cheek.x * w), int(right_cheek.y * h)
        face_width = np.linalg.norm([rx - lx, ry - ly])
        radius = int(face_width * 0.20)  # 20% of face width
        # Draw white filled circle at nose tip
        cv2.circle(mask, (cx, cy), radius, 255, -1)
        # Draw triangle above the circle for nose bridge
        # Base of triangle: top left and right of the circle
        base_left = (cx - radius // 2, cy - radius)
        base_right = (cx + radius // 2, cy - radius)
        # Apex: above the nose tip, offset by 1.5 * radius
        apex = (cx, cy - int(radius * 2.2))
        triangle_cnt = np.array([base_left, base_right, apex])
        cv2.drawContours(mask, [triangle_cnt], 0, 255, -1)
    except Exception as e:
        # Fallback: use polygon as before
        NOSE_LANDMARKS = [1, 2, 98, 327, 168, 197, 195, 5, 4, 275, 440, 344, 278, 309, 291, 287, 432, 422, 423, 424, 431, 430, 426, 425, 266, 330, 329, 294, 278, 439, 454, 323, 361, 288, 397, 365, 379, 378, 400, 377, 152, 148, 176, 149, 150, 136, 172, 58, 132, 93, 234, 127, 162, 21, 54, 103, 67, 109, 10, 338, 297, 332, 284, 251, 389, 356]
        points = []
        for idx in NOSE_LANDMARKS:
            lm = face_landmarks.landmark[idx]
            x, y = int(lm.x * w), int(lm.y * h)
            points.append([x, y])
        points = np.array(points, dtype=np.int32)
        cv2.fillPoly(mask, [points], 255)
else:
    print("No face detected")
    sys.exit(1)

# Save mask (white nose, black elsewhere)
cv2.imwrite(output_path, mask) 