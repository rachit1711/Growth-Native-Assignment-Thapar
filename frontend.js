import React, { useState } from 'react';
import MQTT from 'mqtt';

function StudentSideTypingBox() {
  const [rollNo, setRollNo] = useState('');
  const [image, setImage] = useState(null);
  const [text, setText] = useState('');

  const client = MQTT.connect('mqtt://my-mqtt-server');

  const handleTextChange = (event) => {
    const words = event.target.value.split(' ');
    words.forEach((word) => {
      client.publish('typing-words', word);
    });
    setText(event.target.value);
  }

  return (
    <form>
      <label htmlFor="rollNo">Roll No:</label>
      <input type="text" id="rollNo" value={rollNo} onChange={(event) => setRollNo(event.target.value)} />
      <br />
      <label htmlFor="image">Image:</label>
      <input type="file" id="image" onChange={(event) => setImage(event.target.files[0])} />
      <br />
      <textarea value={text} onChange={handleTextChange} />
    </form>
  );
}
