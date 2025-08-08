import os
import sys
# DON'T CHANGE THIS !!!
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from flask import Flask, render_template
from flask_cors import CORS
from flask_socketio import SocketIO, emit, join_room, leave_room
from src.models.user import db
from src.routes.passenger import passenger_bp
from src.routes.driver import driver_bp
from src.routes.ride import ride_bp
from src.routes.admin import admin_bp
from src.routes.maps import maps_bp

app = Flask(__name__)
app.config['SECRET_KEY'] = 'smart_taxi_secret_key_2025'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///smart_taxi.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize extensions
db.init_app(app)
CORS(app, origins="*")
socketio = SocketIO(app, cors_allowed_origins="*")

# Register blueprints
app.register_blueprint(passenger_bp, url_prefix='/api/passengers')
app.register_blueprint(driver_bp, url_prefix='/api/drivers')
app.register_blueprint(ride_bp, url_prefix='/api/rides')
app.register_blueprint(admin_bp, url_prefix='/api/admin')
app.register_blueprint(maps_bp, url_prefix='/api/maps')

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/<path:path>')
def catch_all(path):
    return render_template('index.html')

# Socket.IO events
@socketio.on('connect')
def handle_connect():
    print('Client connected')
    emit('status', {'msg': 'Connected to server'})

@socketio.on('disconnect')
def handle_disconnect():
    print('Client disconnected')

@socketio.on('join_room')
def handle_join_room(data):
    room = data['room']
    join_room(room)
    emit('status', {'msg': f'Joined room {room}'}, room=room)

@socketio.on('leave_room')
def handle_leave_room(data):
    room = data['room']
    leave_room(room)
    emit('status', {'msg': f'Left room {room}'}, room=room)

@socketio.on('ride_request')
def handle_ride_request(data):
    # Broadcast to drivers room
    emit('new_ride_request', data, room='drivers')

@socketio.on('ride_accepted')
def handle_ride_accepted(data):
    # Notify specific passenger
    emit('ride_accepted', data, room=f"passenger_{data['passenger_id']}")

@socketio.on('ride_started')
def handle_ride_started(data):
    # Notify passenger
    emit('ride_started', data, room=f"passenger_{data['passenger_id']}")

@socketio.on('ride_completed')
def handle_ride_completed(data):
    # Notify both passenger and driver
    emit('ride_completed', data, room=f"passenger_{data['passenger_id']}")
    emit('ride_completed', data, room=f"driver_{data['driver_id']}")

@socketio.on('location_update')
def handle_location_update(data):
    # Broadcast location updates
    emit('location_update', data, broadcast=True)

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    socketio.run(app, host='0.0.0.0', port=5000, debug=True)

