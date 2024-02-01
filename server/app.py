from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from PIL import Image
import base64
import cv2
import numpy as np
from io import BytesIO

app = Flask(__name__)
CORS(app)

@app.route('/process_frame', methods=['POST'])
def process_frame():
    frame = request.json['frame']
    frame = frame.split(',')[1]
    frame = base64.b64decode(frame)
    frame = Image.open(BytesIO(frame))
    frame = cv2.cvtColor(np.array(frame), cv2.COLOR_RGB2BGR)
    gray_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    # Convert the grayscale frame back to bytes
    is_success, im_buf_arr = cv2.imencode(".jpg", gray_frame)
    byte_im = im_buf_arr.tobytes()
    # Send the grayscale frame as a response
    return send_file(BytesIO(byte_im), mimetype='image/jpeg')

if __name__ == '__main__':
    app.run(debug=True)
