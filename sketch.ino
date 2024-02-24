void setup()
{
  Serial.begin(9600);
  Serial.setTimeout(10);
  pinMode(5, OUTPUT);
}

void loop()
{
  Serial.print(analogRead(A0));
  Serial.print(",");
  Serial.print(analogRead(A1));
  Serial.print(",");
  Serial.println(analogRead(A2));
  if (Serial.available() > 0) {   // if there's serial data
    int inByte = Serial.read(); // read it
    Serial.write(inByte);  	// send it back out as raw binary data
    analogWrite(5, inByte);	// use it to set the LED brightness
  }
  delay(50);
}