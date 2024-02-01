from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from PIL import Image
import base64
import cv2
import numpy as np
from io import BytesIO
import dlib
from imutils import face_utils
from flask_mail import Mail, Message


app = Flask(__name__)

app.config['MAIL_SERVER'] = 'smtp.fastmail.com'
app.config['MAIL_PORT'] = 465
app.config['MAIL_USERNAME'] = 'meetsingh_25@fastmail.com'
app.config['MAIL_PASSWORD'] = 'yfy4dcjtrwtbhp8v'
app.config['MAIL_USE_TLS'] = False
app.config['MAIL_USE_SSL'] = True
mail = Mail(app)

CORS(app)

cap = cv2.VideoCapture(0)
detector = dlib.get_frontal_face_detector()
predictor = dlib.shape_predictor("my_model.dat")

status = ""
color = (0, 0, 0)


def compute(ptA, ptB):
    dist = np.linalg.norm(ptA - ptB)
    return dist

def blinked(a, b, c, d, e, f):
    up = compute(b, d) + compute(c, e)
    down = compute(a, f)
    ratio = up / (2.0 * down)
    if ratio > 0.25:
        return 2
    elif ratio > 0.21 and ratio <= 0.25:
        return 1
    else:
        return 0
drowsy = 0
active = 0
@app.route('/process_frame', methods=['POST'])
def process_frame():
    global drowsy,active
    frame = request.json['frame']
    frame = frame.split(',')[1]
    frame = base64.b64decode(frame)
    frame = Image.open(BytesIO(frame))
    frame=np.array(frame)
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    faces = detector(gray)
    status = ""
    color = (0, 0, 0)    
    if len(faces) == 0:
            status="Drowsy"
    for face in faces:  
            x1 = face.left()
            y1 = face.top()
            x2 = face.right()
            y2 = face.bottom()
            cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
            landmarks = predictor(gray, face)
            landmarks = face_utils.shape_to_np(landmarks)
            left_blink = blinked(landmarks[36], landmarks[37], landmarks[38], landmarks[41], landmarks[40], landmarks[39])
            right_blink = blinked(landmarks[42], landmarks[43], landmarks[44], landmarks[47], landmarks[46], landmarks[45])
            D = compute(landmarks[51], landmarks[57])
            if left_blink == 0 or right_blink == 0 or D>40:
                drowsy += 1
                active = 0
                if drowsy > 6:
                    status = "Drowsy"
                    color = (0, 0, 255)
            else:
                drowsy = 0
                active += 1
                if active > 6:
                    status = "Active"
                    color = (0, 255, 0)

    cv2.putText(frame, status, (100, 100), cv2.FONT_HERSHEY_SIMPLEX, 1.2, color, 3)
    frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)  # Convert the image from BGR to RGB
    is_success, im_buf_arr = cv2.imencode(".jpg", frame)
    byte_im = im_buf_arr.tobytes()
    img_base64 = base64.b64encode(byte_im).decode()  # Convert the image to base64

    # Prepare the JSON response
    response = {
        'image': img_base64,
        'status': status
    }

    return jsonify(response)

@app.route("/send_mail",methods=["POST"])
def send_mail():
    try:
        name=request.json["name"]
        email1=request.json["email1"]
        email2=request.json["email2"]
        recipients=[email1, email2]
        print(f"Recipients: {recipients}")

        subject=f"Emergency!! your family member {name} is in trouble"
        message='''
            Dear [Family Member’s Name],
            I am writing to inform you that your family member has been detected as drowsy while driving and is currently unresponsive. We have sent this email to you as an emergency measure to ensure that you are aware of the situation and can take appropriate action.
            The location of the vehicle has been tracked and is currently at [location]. We urge you to immediately come to the location or try contacting [name] on their phone number [phone number] to ensure their safety.
            Please treat this as an urgent matter and take immediate action.
            Sincerely,
            [Your Name]
        '''
        msg = Message(subject=subject, sender='meetsingh_25@fastmail.com', recipients=recipients)
        msg.body = message
        mail.send(msg)
        print("Email sent successfully!")
    except Exception as e:
        print(f"An error occurred: {e}")

    return "Message sent!"

if __name__ == '__main__':
    app.run(debug=True)
