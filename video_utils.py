import cv2, numpy as np
from typing import List

MEAN = np.array([123.675, 116.28, 103.53])
STD  = np.array([58.395, 57.12, 57.375])

def extract_frames(path: str):
    cap, frames = cv2.VideoCapture(path), []
    while cap.isOpened():
        ret, f = cap.read()
        if not ret:
            break
        frames.append(f)
    cap.release()
    return frames

def resize_and_pad(img, size=(224, 224)):
    h, w = img.shape[:2]
    s    = min(size[0] / h, size[1] / w)
    nh, nw = int(h * s), int(w * s)
    img  = cv2.resize(img, (nw, nh))
    dw, dh = size[1]-nw, size[0]-nh
    t, b = dh // 2, dh - dh // 2
    l, r = dw // 2, dw - dw // 2
    return cv2.copyMakeBorder(img, t, b, l, r, cv2.BORDER_CONSTANT, value=[114]*3)

def preprocess(frame):
    frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    frame = resize_and_pad(frame)
    frame = (frame - MEAN) / STD
    return np.transpose(frame, (2, 0, 1))

def sample_frames(frames: List, n: int):
    L = len(frames)
    if L < n:
        frames += [frames[-1]] * (n - L)
    elif L > n:
        idx = np.linspace(0, L-1, n, dtype=int)
        frames = [frames[i] for i in idx]
    return frames
