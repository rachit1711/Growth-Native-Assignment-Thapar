const mqtt = require('mqtt');
const redis = require('redis');

const MQTT_BROKER_URL = 'mqtt://localhost';
const REDIS_HOST = 'localhost';
const REDIS_PORT = 6379;

// create a client for the MQTT broker
const mqttClient = mqtt.connect(MQTT_BROKER_URL);

// create a client for the Redis store
const redisClient = redis.createClient({
  host: REDIS_HOST,
  port: REDIS_PORT
});

// subscribe to the MQTT topic that the students are publishing to
mqttClient.subscribe('student_data');

// listen for messages on the MQTT topic
mqttClient.on('message', (topic, message) => {
  // parse the message as JSON
  const data = JSON.parse(message);

  // save the data to Redis using the student's id as the key
  redisClient.set(data.id, message);
});

// set up a WebSocket server to listen for connections from the teacher's browser
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
  // listen for messages from the teacher's browser
  ws.on('message', (message) => {
    // parse the message as JSON
    const data = JSON.parse(message);

    // check if the message is a request for data from a particular student
    if (data.type === 'get_student_data' && data.id) {
      // retrieve the student data from Redis and send it back to the teacher's browser
      redisClient.get(data.id, (err, studentData) => {
        ws.send(studentData);
      });
    }
  });
});