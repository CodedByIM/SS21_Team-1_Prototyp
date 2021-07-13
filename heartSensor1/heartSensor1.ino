/*
 This example sketch gives you exactly what the SparkFun Pulse Oximiter and
 Heart Rate Monitor is designed to do: read heart rate and blood oxygen levels.
 This board requires I-squared-C connections but also connections to the reset
 and mfio pins. When using the device keep LIGHT and CONSISTENT pressure on the
 sensor. Otherwise you may crush the capillaries in your finger which results
 in bad or no results. A summary of the hardware connections are as follows: 
 SDA -> SDA
 SCL -> SCL
 RESET -> PIN 4
 MFIO -> PIN 5

 Author: Elias Santistevan
 Date: 8/2019
 SparkFun Electronics

 If you run into an error code check the following table to help diagnose your
 problem: 
 1 = Unavailable Command
 2 = Unavailable Function
 3 = Data Format Error
 4 = Input Value Error
 5 = Try Again
 255 = Error Unknown
*/

#include <SparkFun_Bio_Sensor_Hub_Library.h>
#include <Wire.h>

int resPin = 4;
int mfioPin = 5;
int MoPin = 3;

SparkFun_Bio_Sensor_Hub bioHub(resPin, mfioPin); 
bioData body;  



void setup(){

  Serial.begin(115200);
  pinMode( MoPin, OUTPUT );  
  Wire.begin();
  int result = bioHub.begin();
  int error = bioHub.configBpm(MODE_TWO); 
  delay(4000); 

}
      


void loop(){
  
    body = bioHub.readBpm();
    delay(250);
    int heartRate = body.heartRate;
    int oxygen = body.oxygen; 
    Serial.print("{\"heartrate\": ");
    Serial.print(heartRate);
    Serial.print(", \"oxygen\": ");
    Serial.print(oxygen);
    Serial.println("}");
     
  static char endMarker = '\n'; 
  char receivedChar;     
  while(Serial.available() > 0) {
    receivedChar = Serial.read();
    if (receivedChar == endMarker) {
      digitalWrite(MoPin, HIGH);
      delay(1000);
      digitalWrite(MoPin, LOW);
      delay(1000);
      return;      
    }   
  }  
}
