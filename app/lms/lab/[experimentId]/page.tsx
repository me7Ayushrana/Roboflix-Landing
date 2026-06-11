"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { 
  ArrowLeft, Cpu, Sparkles, AlertCircle, Sun, Moon, Layout, 
  MessageSquare, Share2, Trash2, Download, BookOpen, 
  Activity, Gauge, Send, RefreshCw, CheckCircle, ShieldAlert, Play, Upload
} from "lucide-react"
import { EXPERIMENT_CONFIGS } from "@/lib/lab/experimentConfigs"
import { PlacedComponent, WireConnection, runClientSideSimulation } from "@/lib/lab/simulationEngine"
import ComponentPalette from "@/components/lab/ComponentPalette"
import WiringCanvas from "@/components/lab/WiringCanvas"
import CodeEditor from "@/components/lab/CodeEditor"
import SerialMonitor from "@/components/lab/SerialMonitor"

interface User {
  email: string
}

// ─── DEFAULT CIRCUIT: Ultrasonic Sensor + LED Glow (Object Detection Demo) ───
// Loaded on first visit when no saved state exists
const DEFAULT_CIRCUIT = {
  name: "Object Detection Demo (HC-SR04 + LED)",
  components: [
    { id: "arduino_default_1", componentId: "arduino-uno",  x: 80,  y: 140, rotation: 0, scale: 1 },
    { id: "sensor_default_1", componentId: "hc-sr04",     x: 310, y: 80,  rotation: 0, scale: 1 },
    { id: "led_default_1",    componentId: "led-red",      x: 310, y: 240, rotation: 0, scale: 1 },
    { id: "buzzer_default_1", componentId: "buzzer",       x: 460, y: 80,  rotation: 0, scale: 1 },
    { id: "obj_default_1",    componentId: "obj-box",      x: 580, y: 90,  rotation: 0, scale: 1 },
  ],
  connections: [
    { fromComponentId: "arduino_default_1", fromPinId: "vcc-5v",  toComponentId: "sensor_default_1", toPinId: "vcc",     color: "red"    },
    { fromComponentId: "arduino_default_1", fromPinId: "gnd-1",   toComponentId: "sensor_default_1", toPinId: "gnd",     color: "black"  },
    { fromComponentId: "arduino_default_1", fromPinId: "pin-7",   toComponentId: "sensor_default_1", toPinId: "trig",    color: "yellow" },
    { fromComponentId: "arduino_default_1", fromPinId: "pin-6",   toComponentId: "sensor_default_1", toPinId: "echo",    color: "green"  },
    { fromComponentId: "arduino_default_1", fromPinId: "pin-13",  toComponentId: "led_default_1",    toPinId: "anode",   color: "orange" },
    { fromComponentId: "arduino_default_1", fromPinId: "gnd-2",   toComponentId: "led_default_1",    toPinId: "cathode", color: "black"  },
    { fromComponentId: "arduino_default_1", fromPinId: "pin-8",   toComponentId: "buzzer_default_1", toPinId: "pos",     color: "purple" },
    { fromComponentId: "arduino_default_1", fromPinId: "gnd-2",   toComponentId: "buzzer_default_1", toPinId: "neg",     color: "black"  },
  ],
  code: `// Object Detection – HC-SR04 Ultrasonic + LED Glow + Buzzer Alert
// ─────────────────────────────────────────────────────────────────
// TRIG → Pin 7  |  ECHO → Pin 6
// LED  → Pin 13 |  BUZZER → Pin 8

#define TRIG_PIN   7
#define ECHO_PIN   6
#define LED_PIN    13
#define BUZZER_PIN 8
#define ALERT_DIST 30   // cm – obstacle alert threshold

void setup() {
  Serial.begin(9600);
  pinMode(TRIG_PIN,   OUTPUT);
  pinMode(ECHO_PIN,   INPUT);
  pinMode(LED_PIN,    OUTPUT);
  pinMode(BUZZER_PIN, OUTPUT);
  Serial.println("Object Detection Node Initialized.");
  Serial.println("Waiting for obstacles...");
}

void loop() {
  // Trigger ultrasonic pulse
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);

  long duration   = pulseIn(ECHO_PIN, HIGH);
  long distanceCm = duration * 0.034 / 2;

  Serial.print("Sensor distance: ");
  Serial.print(distanceCm);
  Serial.println(" cm");

  if (distanceCm < ALERT_DIST) {
    digitalWrite(LED_PIN,    HIGH);
    digitalWrite(BUZZER_PIN, HIGH);
    Serial.println("ALERT - Obstacle detected - BUZZER active!");
  } else {
    digitalWrite(LED_PIN,    LOW);
    digitalWrite(BUZZER_PIN, LOW);
  }

  delay(1000);
}`,
}

// Preset circuit templates for instant loading
const LAB_TEMPLATES = {
  garden: {
    name: "Smart Agriculture Preset",
    code: `// Smart Garden & Irrigation Node
#define SOIL_PIN A0
#define RELAY_PIN 4

void setup() {
  Serial.begin(9600);
  pinMode(RELAY_PIN, OUTPUT);
  Serial.println("Smart Garden Online.");
}

void loop() {
  int moisture = analogRead(SOIL_PIN);
  int percent = map(moisture, 0, 1023, 100, 0);
  
  Serial.print("Soil Moisture: ");
  Serial.print(percent);
  Serial.println("%");
  
  if (percent < 35) {
    digitalWrite(RELAY_PIN, HIGH);
    Serial.println("RELAY ON: Water pump activated!");
  } else {
    digitalWrite(RELAY_PIN, LOW);
    Serial.println("RELAY OFF: Soil moisture healthy.");
  }
  delay(1500);
}`,
    components: [
      { id: "arduino_1", componentId: "arduino-uno", x: 60, y: 120, rotation: 0, scale: 1 },
      { id: "soil_1", componentId: "soil-moisture", x: 280, y: 70, rotation: 0, scale: 1 },
      { id: "relay_1", componentId: "relay-module", x: 280, y: 200, rotation: 90, scale: 1 },
      { id: "oled_1", componentId: "oled-display", x: 60, y: 280, rotation: 0, scale: 1 }
    ],
    connections: [
      { fromComponentId: "arduino_1", fromPinId: "vcc-5v", toComponentId: "soil_1", toPinId: "vcc", color: "red" },
      { fromComponentId: "arduino_1", fromPinId: "gnd-1", toComponentId: "soil_1", toPinId: "gnd", color: "black" },
      { fromComponentId: "arduino_1", fromPinId: "pin-a0", toComponentId: "soil_1", toPinId: "sig", color: "yellow" },
      { fromComponentId: "arduino_1", fromPinId: "vcc-5v", toComponentId: "relay_1", toPinId: "vcc", color: "red" },
      { fromComponentId: "arduino_1", fromPinId: "gnd-2", toComponentId: "relay_1", toPinId: "gnd", color: "black" },
      { fromComponentId: "arduino_1", fromPinId: "pin-4", toComponentId: "relay_1", toPinId: "in", color: "green" }
    ]
  },
  car: {
    name: "Obstacle Avoiding Car Preset",
    code: `// Obstacle Avoiding Robot Car
#define TRIG_PIN 7
#define ECHO_PIN 6
#define MOTOR_IN1 4
#define MOTOR_IN2 5
#define MOTOR_ENA 9

void setup() {
  Serial.begin(9600);
  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);
  pinMode(MOTOR_IN1, OUTPUT);
  pinMode(MOTOR_IN2, OUTPUT);
  pinMode(MOTOR_ENA, OUTPUT);
  Serial.println("Chassis Drive Controller Initialized.");
}

void loop() {
  // Trigger sensor pulse
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);
  
  long duration = pulseIn(ECHO_PIN, HIGH);
  long distanceCm = duration * 0.034 / 2;
  
  Serial.print("Sensor distance: ");
  Serial.print(distanceCm);
  Serial.println(" cm");
  
  if (distanceCm < 30) {
    // Stop vehicle
    analogWrite(MOTOR_ENA, 0);
    digitalWrite(MOTOR_IN1, LOW);
    digitalWrite(MOTOR_IN2, LOW);
    Serial.println("ALERT - Obstacle detected - Stopping Motors!");
  } else {
    // Move Forward
    analogWrite(MOTOR_ENA, 200);
    digitalWrite(MOTOR_IN1, HIGH);
    digitalWrite(MOTOR_IN2, LOW);
    Serial.println("PATH CLEAR - Driving Forward at 80% speed");
  }
  delay(1000);
}`,
    components: [
      { id: "arduino_1", componentId: "arduino-uno", x: 60, y: 120, rotation: 0, scale: 1 },
      { id: "sensor_1", componentId: "hc-sr04", x: 280, y: 70, rotation: 0, scale: 1 },
      { id: "driver_1", componentId: "l298n", x: 280, y: 200, rotation: 90, scale: 1 },
      { id: "motor_1", componentId: "geared-dc-motor", x: 440, y: 180, rotation: 0, scale: 1 }
    ],
    connections: [
      { fromComponentId: "arduino_1", fromPinId: "vcc-5v", toComponentId: "sensor_1", toPinId: "vcc", color: "red" },
      { fromComponentId: "arduino_1", fromPinId: "gnd-1", toComponentId: "sensor_1", toPinId: "gnd", color: "black" },
      { fromComponentId: "arduino_1", fromPinId: "pin-7", toComponentId: "sensor_1", toPinId: "trig", color: "yellow" },
      { fromComponentId: "arduino_1", fromPinId: "pin-6", toComponentId: "sensor_1", toPinId: "echo", color: "green" },
      { fromComponentId: "arduino_1", fromPinId: "pin-9", toComponentId: "driver_1", toPinId: "ena", color: "blue" },
      { fromComponentId: "arduino_1", fromPinId: "pin-4", toComponentId: "driver_1", toPinId: "in1", color: "orange" },
      { fromComponentId: "arduino_1", fromPinId: "pin-5", toComponentId: "driver_1", toPinId: "in2", color: "purple" }
    ]
  },
  home: {
    name: "Smart Home Automation Preset",
    code: `// Smart Home Automation controller
#define LDR_PIN A0
#define PIR_PIN 2
#define SERVO_PIN 9
#define LED_PIN 13

void setup() {
  Serial.begin(9600);
  pinMode(PIR_PIN, INPUT);
  pinMode(LED_PIN, OUTPUT);
  Serial.println("Smart Home Control Unit active.");
}

void loop() {
  int lightVal = analogRead(LDR_PIN);
  int motion = digitalRead(PIR_PIN);
  
  Serial.print("Ambient Light: ");
  Serial.print(lightVal);
  Serial.print(" | Motion: ");
  Serial.println(motion ? "DETECTED" : "NONE");
  
  if (lightVal < 300 || motion == HIGH) {
    digitalWrite(LED_PIN, HIGH);
    Serial.println("STATUS: LED ON (Smart Lamp active)");
  } else {
    digitalWrite(LED_PIN, LOW);
  }
  
  if (motion == HIGH) {
    Serial.println("STATUS: Opening Servo Door/Fan...");
  }
  delay(1200);
}`,
    components: [
      { id: "arduino_1", componentId: "arduino-uno", x: 60, y: 120, rotation: 0, scale: 1 },
      { id: "ldr_1", componentId: "photoresistor", x: 280, y: 70, rotation: 0, scale: 1 },
      { id: "pir_1", componentId: "pir-sensor", x: 280, y: 200, rotation: 0, scale: 1 },
      { id: "servo_1", componentId: "servo-motor", x: 60, y: 280, rotation: 90, scale: 1 }
    ],
    connections: [
      { fromComponentId: "arduino_1", fromPinId: "vcc-5v", toComponentId: "ldr_1", toPinId: "pin-1", color: "red" },
      { fromComponentId: "arduino_1", fromPinId: "pin-a0", toComponentId: "ldr_1", toPinId: "pin-2", color: "yellow" },
      { fromComponentId: "arduino_1", fromPinId: "vcc-5v", toComponentId: "pir_1", toPinId: "vcc", color: "red" },
      { fromComponentId: "arduino_1", fromPinId: "gnd-1", toComponentId: "pir_1", toPinId: "gnd", color: "black" },
      { fromComponentId: "arduino_1", fromPinId: "pin-2", toComponentId: "pir_1", toPinId: "out", color: "green" },
      { fromComponentId: "arduino_1", fromPinId: "vcc-5v", toComponentId: "servo_1", toPinId: "vcc", color: "red" },
      { fromComponentId: "arduino_1", fromPinId: "gnd-2", toComponentId: "servo_1", toPinId: "gnd", color: "black" },
      { fromComponentId: "arduino_1", fromPinId: "pin-9", toComponentId: "servo_1", toPinId: "pwm", color: "blue" }
    ]
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// DEFAULT WORKS LIBRARY  – Pre-built, fully-wired, ready-to-run demo projects
// ─────────────────────────────────────────────────────────────────────────────
export const DEMO_PROJECTS: DemoProject[] = [
  // ── 1. Object Detection + LED Alert ──────────────────────────────────────
  {
    id: "demo-ultrasonic-led",
    title: "Object Detection + LED Alert",
    emoji: "📡",
    description: "HC-SR04 ultrasonic sensor detects obstacles. LED glows bright red when object is within 30 cm. Buzzer beeps on alert.",
    difficulty: "Beginner",
    category: "Sensors",
    expectedBehaviors: ["💡 LED glows when obstacle < 30 cm", "🔊 Buzzer beeps on detection", "📟 Distance shown in serial monitor"],
    components: [
      { id: "ard1", componentId: "arduino-uno",  x: 80,  y: 140, rotation: 0, scale: 1 },
      { id: "sr1",  componentId: "hc-sr04",      x: 310, y: 80,  rotation: 0, scale: 1 },
      { id: "led1", componentId: "led-red",       x: 310, y: 240, rotation: 0, scale: 1 },
      { id: "buz1", componentId: "buzzer",        x: 460, y: 80,  rotation: 0, scale: 1 },
      { id: "obj1", componentId: "obj-box",       x: 580, y: 90,  rotation: 0, scale: 1 },
    ],
    connections: [
      { fromComponentId: "ard1", fromPinId: "vcc-5v",  toComponentId: "sr1",  toPinId: "vcc",     color: "red"    },
      { fromComponentId: "ard1", fromPinId: "gnd-1",   toComponentId: "sr1",  toPinId: "gnd",     color: "black"  },
      { fromComponentId: "ard1", fromPinId: "pin-7",   toComponentId: "sr1",  toPinId: "trig",    color: "yellow" },
      { fromComponentId: "ard1", fromPinId: "pin-6",   toComponentId: "sr1",  toPinId: "echo",    color: "green"  },
      { fromComponentId: "ard1", fromPinId: "pin-13",  toComponentId: "led1", toPinId: "anode",   color: "orange" },
      { fromComponentId: "ard1", fromPinId: "gnd-2",   toComponentId: "led1", toPinId: "cathode", color: "black"  },
      { fromComponentId: "ard1", fromPinId: "pin-8",   toComponentId: "buz1", toPinId: "pos",     color: "purple" },
      { fromComponentId: "ard1", fromPinId: "gnd-2",   toComponentId: "buz1", toPinId: "neg",     color: "black"  },
    ],
    code: `// 📡 Object Detection – HC-SR04 + LED + Buzzer
#define TRIG_PIN   7
#define ECHO_PIN   6
#define LED_PIN    13
#define BUZZER_PIN 8
#define ALERT_CM   30

void setup() {
  Serial.begin(9600);
  pinMode(TRIG_PIN,   OUTPUT);
  pinMode(ECHO_PIN,   INPUT);
  pinMode(LED_PIN,    OUTPUT);
  pinMode(BUZZER_PIN, OUTPUT);
  Serial.println("Object Detection Node Initialized.");
  Serial.println("Waiting for obstacles...");
}

void loop() {
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);

  long duration   = pulseIn(ECHO_PIN, HIGH);
  long distanceCm = duration * 0.034 / 2;

  Serial.print("Sensor distance: ");
  Serial.print(distanceCm);
  Serial.println(" cm");

  if (distanceCm < ALERT_CM) {
    digitalWrite(LED_PIN,    HIGH);  // Bulb GLOWS
    digitalWrite(BUZZER_PIN, HIGH);  // Buzzer BEEPS
    Serial.println("ALERT - Obstacle detected - BUZZER active!");
  } else {
    digitalWrite(LED_PIN,    LOW);
    digitalWrite(BUZZER_PIN, LOW);
  }
  delay(1000);
}`,
    simTab: "car",
  },

  // ── 2. LED Blinky – Hello World of Hardware ───────────────────────────────
  {
    id: "demo-blink-led",
    title: "LED Blink – Hello Hardware!",
    emoji: "💡",
    description: "The classic first project. LED on Pin 13 blinks ON and OFF every second. Perfect first step for any student.",
    difficulty: "Beginner",
    category: "Basics",
    expectedBehaviors: ["💡 LED blinks ON for 1 second", "⬛ LED turns OFF for 1 second", "🔁 Repeats forever"],
    components: [
      { id: "ard1", componentId: "arduino-uno", x: 80,  y: 140, rotation: 0, scale: 1 },
      { id: "res1", componentId: "resistor",    x: 300, y: 150, rotation: 0, scale: 1 },
      { id: "led1", componentId: "led-red",     x: 430, y: 130, rotation: 0, scale: 1 },
    ],
    connections: [
      { fromComponentId: "ard1", fromPinId: "pin-13",  toComponentId: "res1", toPinId: "pin-1",   color: "orange" },
      { fromComponentId: "res1", fromPinId: "pin-2",   toComponentId: "led1", toPinId: "anode",   color: "orange" },
      { fromComponentId: "ard1", fromPinId: "gnd-1",   toComponentId: "led1", toPinId: "cathode", color: "black"  },
    ],
    code: `// 💡 LED Blink – Hello Hardware World!
// LED is connected to Pin 13 via 220Ω resistor
#define LED_PIN 13

void setup() {
  Serial.begin(9600);
  pinMode(LED_PIN, OUTPUT);
  Serial.println("LED Blink Initialized.");
}

void loop() {
  digitalWrite(LED_PIN, HIGH);
  Serial.println("LED turned ON");
  delay(1000);

  digitalWrite(LED_PIN, LOW);
  Serial.println("LED turned OFF");
  delay(1000);
}`,
    simTab: "home",
  },

  // ── 3. Smart Home Light – LDR + PIR + LED ────────────────────────────────
  {
    id: "demo-smart-home",
    title: "Smart Home Light Controller",
    emoji: "🏠",
    description: "Automatic smart lighting. LED turns ON when it's dark (LDR) OR motion is detected (PIR). Just like a real smart bulb!",
    difficulty: "Intermediate",
    category: "IoT",
    expectedBehaviors: ["🌑 LED ON when dark (Light < 300)", "🚶 LED ON when motion detected (PIR)", "☀️ LED OFF in daylight + no motion"],
    components: [
      { id: "ard1",  componentId: "arduino-uno",   x: 80,  y: 140, rotation: 0, scale: 1 },
      { id: "ldr1",  componentId: "photoresistor",  x: 300, y: 60,  rotation: 0, scale: 1 },
      { id: "pir1",  componentId: "pir-sensor",     x: 300, y: 200, rotation: 0, scale: 1 },
      { id: "led1",  componentId: "led-red",        x: 480, y: 130, rotation: 0, scale: 1 },
    ],
    connections: [
      { fromComponentId: "ard1", fromPinId: "vcc-5v",  toComponentId: "ldr1", toPinId: "pin-1",  color: "red"    },
      { fromComponentId: "ard1", fromPinId: "pin-a0",  toComponentId: "ldr1", toPinId: "pin-2",  color: "yellow" },
      { fromComponentId: "ard1", fromPinId: "vcc-5v",  toComponentId: "pir1", toPinId: "vcc",    color: "red"    },
      { fromComponentId: "ard1", fromPinId: "gnd-1",   toComponentId: "pir1", toPinId: "gnd",    color: "black"  },
      { fromComponentId: "ard1", fromPinId: "pin-2",   toComponentId: "pir1", toPinId: "out",    color: "green"  },
      { fromComponentId: "ard1", fromPinId: "pin-13",  toComponentId: "led1", toPinId: "anode",  color: "orange" },
      { fromComponentId: "ard1", fromPinId: "gnd-2",   toComponentId: "led1", toPinId: "cathode",color: "black"  },
    ],
    code: `// 🏠 Smart Home Light – LDR + PIR Auto-Control
#define LDR_PIN  A0
#define PIR_PIN  2
#define LED_PIN  13

void setup() {
  Serial.begin(9600);
  pinMode(PIR_PIN, INPUT);
  pinMode(LED_PIN, OUTPUT);
  Serial.println("Smart Home Control Unit active.");
}

void loop() {
  int  lightVal = analogRead(LDR_PIN);
  bool motion   = digitalRead(PIR_PIN);

  Serial.print("Ambient Light: ");
  Serial.print(lightVal);
  Serial.print(" | Motion: ");
  Serial.println(motion ? "DETECTED" : "NONE");

  if (lightVal < 300 || motion) {
    digitalWrite(LED_PIN, HIGH);
    Serial.println("STATUS: LED ON (Smart Lamp active)");
  } else {
    digitalWrite(LED_PIN, LOW);
    Serial.println("STATUS: LED OFF");
  }
  delay(1200);
}`,
    simTab: "home",
  },

  // ── 4. Smart Fan – Temperature Controlled ────────────────────────────────
  {
    id: "demo-temp-fan",
    title: "Temperature-Controlled Fan",
    emoji: "🌡️",
    description: "DHT11 reads temperature. DC motor (fan) spins when temp exceeds 28°C. Real-life thermostat simulation!",
    difficulty: "Intermediate",
    category: "Climate",
    expectedBehaviors: ["🌡️ Reads temperature from DHT11", "💨 Fan spins when Temp > 28°C", "⏹️ Fan stops in cool conditions"],
    components: [
      { id: "ard1",  componentId: "arduino-uno",  x: 80,  y: 140, rotation: 0, scale: 1 },
      { id: "dht1",  componentId: "dht11",         x: 300, y: 80,  rotation: 0, scale: 1 },
      { id: "drv1",  componentId: "l298n",          x: 300, y: 210, rotation: 0, scale: 1 },
      { id: "mot1",  componentId: "dc-motor",       x: 480, y: 210, rotation: 0, scale: 1 },
    ],
    connections: [
      { fromComponentId: "ard1", fromPinId: "vcc-5v",  toComponentId: "dht1", toPinId: "vcc",   color: "red"    },
      { fromComponentId: "ard1", fromPinId: "gnd-1",   toComponentId: "dht1", toPinId: "gnd",   color: "black"  },
      { fromComponentId: "ard1", fromPinId: "pin-2",   toComponentId: "dht1", toPinId: "sig",   color: "green"  },
      { fromComponentId: "ard1", fromPinId: "pin-9",   toComponentId: "drv1", toPinId: "ena",   color: "blue"   },
      { fromComponentId: "ard1", fromPinId: "pin-4",   toComponentId: "drv1", toPinId: "in1",   color: "orange" },
      { fromComponentId: "ard1", fromPinId: "pin-5",   toComponentId: "drv1", toPinId: "in2",   color: "purple" },
      { fromComponentId: "drv1", fromPinId: "out1",    toComponentId: "mot1", toPinId: "pos",   color: "cyan"   },
    ],
    code: `// 🌡️ Temperature-Controlled Fan – DHT11 + L298N + DC Motor
#include <DHT.h>
#define DHT_PIN  2
#define ENA      9
#define IN1      4
#define IN2      5
#define TEMP_ON  28.0   // °C threshold

DHT dht(DHT_PIN, DHT11);

void setup() {
  Serial.begin(9600);
  dht.begin();
  pinMode(ENA, OUTPUT);
  pinMode(IN1, OUTPUT);
  pinMode(IN2, OUTPUT);
  Serial.println("Thermal Fan Controller Online.");
}

void loop() {
  float temp = dht.readTemperature();
  float hum  = dht.readHumidity();

  Serial.print("Temperature: "); Serial.print(temp); Serial.println(" C");
  Serial.print("Humidity   : "); Serial.print(hum);  Serial.println(" %");

  if (temp > TEMP_ON) {
    analogWrite(ENA, 200);
    digitalWrite(IN1, HIGH);
    digitalWrite(IN2, LOW);
    Serial.println("FAN ON – cooling active at 80% speed");
  } else {
    analogWrite(ENA, 0);
    Serial.println("FAN OFF – temperature normal");
  }
  delay(2000);
}`,
    simTab: "home",
  },

  // ── 5. Smart Garden Irrigation ────────────────────────────────────────────
  {
    id: "demo-smart-garden",
    title: "Smart Garden Irrigation",
    emoji: "🌱",
    description: "Soil moisture sensor monitors plant health. Relay triggers water pump when soil is dry. Saves water automatically!",
    difficulty: "Intermediate",
    category: "Agriculture",
    expectedBehaviors: ["🌱 Reads soil moisture level", "💧 Relay ON (pump runs) when moisture < 35%", "✅ Relay OFF when soil is healthy"],
    components: [
      { id: "ard1",  componentId: "arduino-uno",    x: 80,  y: 140, rotation: 0, scale: 1 },
      { id: "soil1", componentId: "soil-moisture",   x: 300, y: 80,  rotation: 0, scale: 1 },
      { id: "rel1",  componentId: "relay-module",    x: 300, y: 220, rotation: 0, scale: 1 },
    ],
    connections: [
      { fromComponentId: "ard1",  fromPinId: "vcc-5v",  toComponentId: "soil1", toPinId: "vcc", color: "red"    },
      { fromComponentId: "ard1",  fromPinId: "gnd-1",   toComponentId: "soil1", toPinId: "gnd", color: "black"  },
      { fromComponentId: "ard1",  fromPinId: "pin-a0",  toComponentId: "soil1", toPinId: "sig", color: "yellow" },
      { fromComponentId: "ard1",  fromPinId: "vcc-5v",  toComponentId: "rel1",  toPinId: "vcc", color: "red"    },
      { fromComponentId: "ard1",  fromPinId: "gnd-2",   toComponentId: "rel1",  toPinId: "gnd", color: "black"  },
      { fromComponentId: "ard1",  fromPinId: "pin-4",   toComponentId: "rel1",  toPinId: "in",  color: "green"  },
    ],
    code: `// 🌱 Smart Garden – Soil Sensor + Relay Pump
#define SOIL_PIN   A0
#define RELAY_PIN  4

void setup() {
  Serial.begin(9600);
  pinMode(RELAY_PIN, OUTPUT);
  Serial.println("Smart Garden Online.");
}

void loop() {
  int moisture = analogRead(SOIL_PIN);
  int percent  = map(moisture, 0, 1023, 100, 0);

  Serial.print("Soil Moisture: ");
  Serial.print(percent);
  Serial.println("%");

  if (percent < 35) {
    digitalWrite(RELAY_PIN, HIGH);
    Serial.println("RELAY ON: Water pump activated!");
  } else {
    digitalWrite(RELAY_PIN, LOW);
    Serial.println("RELAY OFF: Soil moisture healthy.");
  }
  delay(1500);
}`,
    simTab: "garden",
  },

  // ── 6. Obstacle-Avoiding Robot Car ───────────────────────────────────────
  {
    id: "demo-robot-car",
    title: "Obstacle-Avoiding Robot Car",
    emoji: "🚗",
    description: "Autonomous robot car using HC-SR04. Drives forward when path is clear, stops and avoids obstacles automatically.",
    difficulty: "Advanced",
    category: "Robotics",
    expectedBehaviors: ["🚗 Motors drive forward on clear path", "🛑 Car stops when obstacle < 30 cm", "📡 Real-time distance shown"],
    components: [
      { id: "ard1",  componentId: "arduino-uno",   x: 80,  y: 140, rotation: 0, scale: 1 },
      { id: "sr1",   componentId: "hc-sr04",        x: 310, y: 70,  rotation: 0, scale: 1 },
      { id: "drv1",  componentId: "l298n",           x: 310, y: 200, rotation: 90,scale: 1 },
      { id: "mot1",  componentId: "dc-motor",        x: 480, y: 180, rotation: 0, scale: 1 },
      { id: "obj1",  componentId: "obj-box",         x: 600, y: 80,  rotation: 0, scale: 1 },
    ],
    connections: [
      { fromComponentId: "ard1", fromPinId: "vcc-5v",  toComponentId: "sr1",  toPinId: "vcc",  color: "red"    },
      { fromComponentId: "ard1", fromPinId: "gnd-1",   toComponentId: "sr1",  toPinId: "gnd",  color: "black"  },
      { fromComponentId: "ard1", fromPinId: "pin-7",   toComponentId: "sr1",  toPinId: "trig", color: "yellow" },
      { fromComponentId: "ard1", fromPinId: "pin-6",   toComponentId: "sr1",  toPinId: "echo", color: "green"  },
      { fromComponentId: "ard1", fromPinId: "pin-9",   toComponentId: "drv1", toPinId: "ena",  color: "blue"   },
      { fromComponentId: "ard1", fromPinId: "pin-4",   toComponentId: "drv1", toPinId: "in1",  color: "orange" },
      { fromComponentId: "ard1", fromPinId: "pin-5",   toComponentId: "drv1", toPinId: "in2",  color: "purple" },
      { fromComponentId: "drv1", fromPinId: "out1",    toComponentId: "mot1", toPinId: "pos",  color: "cyan"   },
    ],
    code: `// 🚗 Obstacle-Avoiding Robot Car
#define TRIG_PIN 7
#define ECHO_PIN 6
#define ENA      9
#define IN1      4
#define IN2      5

void setup() {
  Serial.begin(9600);
  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);
  pinMode(ENA, OUTPUT);
  pinMode(IN1, OUTPUT);
  pinMode(IN2, OUTPUT);
  Serial.println("Chassis Drive Controller Initialized.");
}

void loop() {
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);

  long duration   = pulseIn(ECHO_PIN, HIGH);
  long distanceCm = duration * 0.034 / 2;

  Serial.print("Sensor distance: ");
  Serial.print(distanceCm);
  Serial.println(" cm");

  if (distanceCm < 30) {
    analogWrite(ENA, 0);
    Serial.println("ALERT - Obstacle detected - Stopping Motors!");
  } else {
    analogWrite(ENA, 200);
    digitalWrite(IN1, HIGH);
    digitalWrite(IN2, LOW);
    Serial.println("PATH CLEAR - Driving Forward at 80% speed");
  }
  delay(1000);
}`,
    simTab: "car",
  },

  // ── 7. Servo Door Lock ────────────────────────────────────────────────────
  {
    id: "demo-servo-door",
    title: "Servo Door Lock System",
    emoji: "🔐",
    description: "Push button controls a servo motor to open/close a door lock. 0° = locked, 90° = unlocked. Electronic security demo.",
    difficulty: "Beginner",
    category: "Actuators",
    expectedBehaviors: ["🔐 Servo at 0° = door locked", "🔓 Servo at 90° = door open", "🔘 Push button toggles state"],
    components: [
      { id: "ard1",  componentId: "arduino-uno",  x: 80,  y: 140, rotation: 0, scale: 1 },
      { id: "btn1",  componentId: "push-button",   x: 300, y: 80,  rotation: 0, scale: 1 },
      { id: "srv1",  componentId: "servo-motor",   x: 300, y: 230, rotation: 0, scale: 1 },
    ],
    connections: [
      { fromComponentId: "ard1", fromPinId: "vcc-5v",  toComponentId: "btn1", toPinId: "pin-1a", color: "red"    },
      { fromComponentId: "ard1", fromPinId: "pin-2",   toComponentId: "btn1", toPinId: "pin-1b", color: "green"  },
      { fromComponentId: "ard1", fromPinId: "vcc-5v",  toComponentId: "srv1", toPinId: "vcc",    color: "red"    },
      { fromComponentId: "ard1", fromPinId: "gnd-1",   toComponentId: "srv1", toPinId: "gnd",    color: "black"  },
      { fromComponentId: "ard1", fromPinId: "pin-9",   toComponentId: "srv1", toPinId: "pwm",    color: "orange" },
    ],
    code: `// 🔐 Servo Door Lock – Button Toggle
#include <Servo.h>
#define BUTTON_PIN 2
#define SERVO_PIN  9

Servo doorServo;
bool  isOpen = false;
int   lastState = LOW;

void setup() {
  Serial.begin(9600);
  pinMode(BUTTON_PIN, INPUT);
  doorServo.attach(SERVO_PIN);
  doorServo.write(0);
  Serial.println("Door Lock System Initialized.");
  Serial.println("Door: LOCKED (0°)");
}

void loop() {
  int reading = digitalRead(BUTTON_PIN);

  if (reading == HIGH && lastState == LOW) {
    isOpen = !isOpen;
    if (isOpen) {
      doorServo.write(90);
      Serial.println("Button Pressed – Door UNLOCKED (90°)");
    } else {
      doorServo.write(0);
      Serial.println("Button Pressed – Door LOCKED (0°)");
    }
    delay(200);
  }
  lastState = reading;
  delay(50);
}`,
    simTab: "home",
  },

  // ── 8. Gas Leak Alarm ─────────────────────────────────────────────────────
  {
    id: "demo-gas-alarm",
    title: "Gas Leak Alarm System",
    emoji: "💨",
    description: "MQ-2 gas sensor monitors LPG / smoke levels. Buzzer sounds alarm and LED flashes when gas concentration is dangerous.",
    difficulty: "Intermediate",
    category: "Safety",
    expectedBehaviors: ["💨 Reads gas PPM continuously", "🚨 Buzzer + LED alarm when PPM > 300", "✅ All clear when air is clean"],
    components: [
      { id: "ard1",  componentId: "arduino-uno", x: 80,  y: 140, rotation: 0, scale: 1 },
      { id: "gas1",  componentId: "gas-sensor",  x: 300, y: 80,  rotation: 0, scale: 1 },
      { id: "buz1",  componentId: "buzzer",       x: 300, y: 240, rotation: 0, scale: 1 },
      { id: "led1",  componentId: "led-red",      x: 460, y: 130, rotation: 0, scale: 1 },
      { id: "obj1",  componentId: "obj-gas",      x: 580, y: 80,  rotation: 0, scale: 1 },
    ],
    connections: [
      { fromComponentId: "ard1", fromPinId: "vcc-5v",  toComponentId: "gas1", toPinId: "vcc",     color: "red"    },
      { fromComponentId: "ard1", fromPinId: "gnd-1",   toComponentId: "gas1", toPinId: "gnd",     color: "black"  },
      { fromComponentId: "ard1", fromPinId: "pin-a0",  toComponentId: "gas1", toPinId: "aout",    color: "yellow" },
      { fromComponentId: "ard1", fromPinId: "pin-8",   toComponentId: "buz1", toPinId: "pos",     color: "purple" },
      { fromComponentId: "ard1", fromPinId: "gnd-2",   toComponentId: "buz1", toPinId: "neg",     color: "black"  },
      { fromComponentId: "ard1", fromPinId: "pin-13",  toComponentId: "led1", toPinId: "anode",   color: "orange" },
      { fromComponentId: "ard1", fromPinId: "gnd-2",   toComponentId: "led1", toPinId: "cathode", color: "black"  },
    ],
    code: `// 💨 Gas Leak Alarm – MQ-2 + Buzzer + LED
#define GAS_PIN    A0
#define BUZZER_PIN 8
#define LED_PIN    13
#define DANGER_PPM 300

void setup() {
  Serial.begin(9600);
  pinMode(BUZZER_PIN, OUTPUT);
  pinMode(LED_PIN,    OUTPUT);
  Serial.println("Gas Detection System Online.");
}

void loop() {
  int raw  = analogRead(GAS_PIN);
  int ppm  = map(raw, 0, 1023, 50, 800);

  Serial.print("Gas Level: ");
  Serial.print(ppm);
  Serial.println(" PPM");

  if (ppm > DANGER_PPM) {
    digitalWrite(BUZZER_PIN, HIGH);  // BEEP!
    digitalWrite(LED_PIN,    HIGH);  // ALERT LED
    Serial.println("WARNING: Dangerous gas level detected!");
    delay(200);
    digitalWrite(BUZZER_PIN, LOW);
    delay(200);
  } else {
    digitalWrite(BUZZER_PIN, LOW);
    digitalWrite(LED_PIN,    LOW);
    Serial.println("Air quality: NORMAL");
    delay(1000);
  }
}`,
    simTab: "car",
  },
]

// TypeScript interface for demo projects
interface DemoProject {
  id: string
  title: string
  emoji: string
  description: string
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  category: string
  expectedBehaviors: string[]
  components: Array<{ id: string; componentId: string; x: number; y: number; rotation: number; scale: number }>
  connections: Array<{ fromComponentId: string; fromPinId: string; toComponentId: string; toPinId: string; color: string }>
  code: string
  simTab: "home" | "car" | "garden"
}


export default function VirtualLabPage() {
  const params = useParams()
  const router = useRouter()
  const experimentId = params.experimentId as string

  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load experiment configuration
  const config = EXPERIMENT_CONFIGS[experimentId]

  // Placed components on canvas
  const [placedComponents, setPlacedComponents] = useState<PlacedComponent[]>([])
  
  // Wires connected
  const [connections, setConnections] = useState<WireConnection[]>([])

  // Editor C++ source code
  const [code, setCode] = useState("")

  // Simulation telemetry state
  const [logs, setLogs] = useState<string[]>([])
  const [isSimulating, setIsSimulating] = useState(false)
  const [passed, setPassed] = useState<boolean | null>(null)
  const [xpAwarded, setXpAwarded] = useState(0)
  const [simulationHint, setSimulationHint] = useState<string | undefined>(undefined)

  // Uploading state
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadStepText, setUploadStepText] = useState("")

  // --- NEW STATES FOR ENHANCED VIRTUAL BOX ---
  const [isNightMode, setIsNightMode] = useState(true)
  const [workspaceLayout, setWorkspaceLayout] = useState<"schematic" | "immersive" | "telemetry">("immersive")
  const [isAIDrawerOpen, setIsAIDrawerOpen] = useState(false)
  const [activePlaygroundTab, setActivePlaygroundTab] = useState<"home" | "car" | "garden">("home")

  // Web Audio API context ref for buzzer sound synthesis
  const audioCtxRef = useRef<AudioContext | null>(null)
  const buzzerOscRef = useRef<OscillatorNode | null>(null)
  const buzzerGainRef = useRef<GainNode | null>(null)

  // Simulation live state – LED glow & buzzer driven from envDistance
  const [ledActive, setLedActive] = useState(false)
  const [buzzerActive, setBuzzerActive] = useState(false)

  // Status banner for live simulation feedback
  const [simBanner, setSimBanner] = useState<string | null>(null)

  // Interactive Slider Mock sensor inputs
  const [envDistance, setEnvDistance] = useState(40)      // HC-SR04 mock (10cm - 200cm)
  const [envLight, setEnvLight] = useState(400)          // LDR photoresistor (0 - 1023)
  const [envPIRMotion, setEnvPIRMotion] = useState(false) // PIR motion trigger
  const [envTemp, setEnvTemp] = useState(24)             // DHT11 temperature (0°C - 50°C)
  const [envHumidity, setEnvHumidity] = useState(55)     // DHT11 humidity (10% - 90%)
  const [envMoisture, setEnvMoisture] = useState(45)     // Soil moisture (0% - 100%)
  const [envGas, setEnvGas] = useState(150)              // Gas sensor level ppm (50 - 800)

  // AI Chat Tutor Log states
  const [chatMessages, setChatMessages] = useState<Array<{ sender: "user" | "ai"; text: string }>>([
    { sender: "ai", text: "Welcome to the Roboflix hardware lab! I can help you build your circuit, identify wiring errors, or debug compilation faults. How can I help you today?" }
  ])
  const [chatInput, setChatInput] = useState("")
  const [isChatTyping, setIsChatTyping] = useState(false)
  const chatScrollRef = useRef<HTMLDivElement>(null)

  // Default Works Panel state
  const [isDefaultWorksOpen, setIsDefaultWorksOpen] = useState(false)
  const [selectedDemoId, setSelectedDemoId] = useState<string | null>(null)

  // 1. Session Protection and Access Control
  useEffect(() => {
    const checkSession = () => {
      try {
        let loggedInEmail = ""
        const storedUser = localStorage.getItem("lms_user")
        if (storedUser) {
          const parsed = JSON.parse(storedUser)
          loggedInEmail = parsed.email || ""
        }

        if (loggedInEmail) {
          setUser({ email: loggedInEmail })
          setIsLoading(false)
        } else {
          router.push("/lms/login")
        }
      } catch (err) {
        router.push("/lms/login")
      }
    }

    checkSession()
  }, [router])

  // 2. Load Persisted State from localStorage (Autosave Restore)
  useEffect(() => {
    if (isLoading || !config) return

    const savedCodeKey = `roboflix_lab_code_${config.id}`
    const savedCompsKey = `roboflix_lab_comps_${config.id}`
    const savedConnsKey = `roboflix_lab_conns_${config.id}`

    const localCode = localStorage.getItem(savedCodeKey)
    const localComps = localStorage.getItem(savedCompsKey)
    const localConns = localStorage.getItem(savedConnsKey)

    if (localCode) {
      setCode(localCode)
    } else {
      // First visit: load DEFAULT_CIRCUIT code (object detection demo) instead of experiment template
      setCode(DEFAULT_CIRCUIT.code)
    }

    if (localComps) {
      try {
        setPlacedComponents(JSON.parse(localComps))
      } catch (e) {
        console.error(e)
        // On parse failure fall back to default circuit
        setPlacedComponents(DEFAULT_CIRCUIT.components)
      }
    } else {
      // First visit – load default demo circuit
      setPlacedComponents(DEFAULT_CIRCUIT.components)
    }

    if (localConns) {
      try {
        setConnections(JSON.parse(localConns))
      } catch (e) {
        console.error(e)
        setConnections(DEFAULT_CIRCUIT.connections)
      }
    } else {
      // First visit – load default connections
      setConnections(DEFAULT_CIRCUIT.connections)
    }

    setLogs([])
    setPassed(null)
    setXpAwarded(0)
    setSimulationHint(undefined)

  }, [isLoading, config])

  // 2b. Dynamic Real-time Canvas Proximity Asset Interaction
  useEffect(() => {
    // 1. Distance sensor trigger (hc-sr04 + obj-box)
    const hcComp = placedComponents.find(c => c.componentId === "hc-sr04")
    const boxComp = placedComponents.find(c => c.componentId === "obj-box")
    if (hcComp && boxComp) {
      const dx = boxComp.x - hcComp.x
      const dy = boxComp.y - hcComp.y
      const distPx = Math.sqrt(dx * dx + dy * dy)
      // Map pixel distance to simulated cm (e.g., 2.5px = 1cm)
      const realDist = Math.max(10, Math.min(200, Math.round(distPx / 2.5)))
      setEnvDistance(realDist)
    }

    // 2. Soil Moisture sensor trigger (soil-moisture + obj-water)
    const soilComp = placedComponents.find(c => c.componentId === "soil-moisture")
    const waterComp = placedComponents.find(c => c.componentId === "obj-water")
    if (soilComp && waterComp) {
      const dx = waterComp.x - soilComp.x
      const dy = waterComp.y - soilComp.y
      const dist = Math.sqrt(dx * dx + dy * dy)
      if (dist < 120) {
        // Wet soil intensity scales higher as they get closer
        const intensity = Math.round(100 - (dist / 1.6))
        setEnvMoisture(Math.max(45, Math.min(95, intensity)))
      } else {
        setEnvMoisture(15) // dry default
      }
    }

    // 3. PIR motion sensor trigger (pir-sensor + obj-human)
    const pirComp = placedComponents.find(c => c.componentId === "pir-sensor")
    const humanComp = placedComponents.find(c => c.componentId === "obj-human")
    if (pirComp && humanComp) {
      const dx = humanComp.x - pirComp.x
      const dy = humanComp.y - pirComp.y
      const dist = Math.sqrt(dx * dx + dy * dy)
      if (dist < 120) {
        setEnvPIRMotion(true)
      } else {
        setEnvPIRMotion(false)
      }
    }

    // 4. Gas sensor trigger (gas-sensor + obj-gas)
    const gasComp = placedComponents.find(c => c.componentId === "gas-sensor")
    const smokeComp = placedComponents.find(c => c.componentId === "obj-gas")
    if (gasComp && smokeComp) {
      const dx = smokeComp.x - gasComp.x
      const dy = smokeComp.y - gasComp.y
      const dist = Math.sqrt(dx * dx + dy * dy)
      if (dist < 120) {
        const ppm = Math.round(750 - (dist * 4.2))
        setEnvGas(Math.max(100, Math.min(750, ppm)))
      } else {
        setEnvGas(70) // clean default
      }
    }
  }, [placedComponents])

  // Web Audio API helpers – play / stop buzzer beep
  const startBuzzerSound = () => {
    try {
      if (!audioCtxRef.current || audioCtxRef.current.state === "closed") {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
      }
      const ctx = audioCtxRef.current
      if (ctx.state === "suspended") ctx.resume()
      // Stop any previous sound
      if (buzzerOscRef.current) {
        try { buzzerOscRef.current.stop() } catch (_) {}
      }
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = "square"
      osc.frequency.setValueAtTime(880, ctx.currentTime)  // 880Hz beep
      gain.gain.setValueAtTime(0.15, ctx.currentTime)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start()
      buzzerOscRef.current = osc
      buzzerGainRef.current = gain
    } catch (_) {}
  }

  const stopBuzzerSound = () => {
    try {
      if (buzzerOscRef.current) {
        buzzerOscRef.current.stop()
        buzzerOscRef.current = null
      }
    } catch (_) {}
  }

  // Real-time simulation loop: drives LED + buzzer from envDistance when simulating
  useEffect(() => {
    if (!isSimulating) {
      setLedActive(false)
      setBuzzerActive(false)
      stopBuzzerSound()
      setSimBanner(null)
      return
    }

    const interval = setInterval(() => {
      const hasSensor = placedComponents.some(c => c.componentId === "hc-sr04")
      const hasLed    = placedComponents.some(c => c.componentId === "led-red")
      const hasBuzzer = placedComponents.some(c => c.componentId === "buzzer")

      if (!hasSensor) {
        setSimBanner("⚠️ HC-SR04 sensor not found on canvas")
        setLedActive(false)
        setBuzzerActive(false)
        stopBuzzerSound()
        return
      }

      if (envDistance < 30) {
        // Obstacle close – glow LED, beep buzzer
        if (hasLed) setLedActive(true)
        if (hasBuzzer) {
          setBuzzerActive(true)
          startBuzzerSound()
        }
        setSimBanner(`🔴 OBSTACLE DETECTED at ${envDistance} cm! LED ON – BUZZER ACTIVE`)
      } else {
        setLedActive(false)
        setBuzzerActive(false)
        stopBuzzerSound()
        setSimBanner(`✅ Path clear – ${envDistance} cm. LED OFF.`)
      }
    }, 500)

    return () => {
      clearInterval(interval)
      stopBuzzerSound()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSimulating, envDistance, placedComponents])

  // Load a demo project onto the canvas (Default Works feature)
  const handleLoadDemoProject = (project: DemoProject) => {
    if (!config) return
    // Stop any running simulation first
    setIsSimulating(false)
    stopBuzzerSound()

    // Load project onto canvas
    setCode(project.code)
    setPlacedComponents(project.components as any)
    setConnections(project.connections as any)
    setActivePlaygroundTab(project.simTab)
    setSelectedDemoId(project.id)

    // Reset environment sliders based on project type
    if (project.id.includes("ultrasonic") || project.id.includes("robot-car")) {
      setEnvDistance(60) // clear path initially
    }
    if (project.id.includes("garden")) {
      setEnvMoisture(25) // dry soil to show pump active
    }
    if (project.id.includes("gas-alarm")) {
      setEnvGas(400) // elevated gas
    }
    if (project.id.includes("smart-home")) {
      setEnvLight(150) // dark room
      setEnvPIRMotion(false)
    }
    if (project.id.includes("temp-fan")) {
      setEnvTemp(32) // warm – fan should spin
    }

    // Persist to localStorage
    localStorage.setItem(`roboflix_lab_code_${config.id}`, project.code)
    localStorage.setItem(`roboflix_lab_comps_${config.id}`, JSON.stringify(project.components))
    localStorage.setItem(`roboflix_lab_conns_${config.id}`, JSON.stringify(project.connections))

    setLogs([
      `✅ Demo loaded: "${project.title}"`,
      `📌 ${project.components.length} components placed, ${project.connections.length} wires connected.`,
      `▶️  Click "Quick Simulation Run" to see it in action!`,
      ...project.expectedBehaviors.map(b => `   ${b}`)
    ])
    setPassed(null)
    setSimulationHint(undefined)
    setIsDefaultWorksOpen(false)

    // Play a quick audio "loaded" chime
    try {
      if (!audioCtxRef.current || audioCtxRef.current.state === "closed") {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
      }
      const ctx = audioCtxRef.current
      if (ctx.state === "suspended") ctx.resume()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = "sine"
      osc.frequency.setValueAtTime(523, ctx.currentTime)
      osc.frequency.setValueAtTime(659, ctx.currentTime + 0.12)
      osc.frequency.setValueAtTime(784, ctx.currentTime + 0.24)
      gain.gain.setValueAtTime(0.2, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start()
      osc.stop(ctx.currentTime + 0.5)
    } catch (_) {}
  }

  // Reset canvas to default demo circuit
  const handleResetToDefault = () => {
    if (!config) return
    if (confirm("Reset to default Object Detection demo? Your current work will be saved first.")) {
      setCode(DEFAULT_CIRCUIT.code)
      setPlacedComponents(DEFAULT_CIRCUIT.components)
      setConnections(DEFAULT_CIRCUIT.connections)
      setActivePlaygroundTab("car")
      setEnvDistance(60)
      localStorage.setItem(`roboflix_lab_code_${config.id}`, DEFAULT_CIRCUIT.code)
      localStorage.setItem(`roboflix_lab_comps_${config.id}`, JSON.stringify(DEFAULT_CIRCUIT.components))
      localStorage.setItem(`roboflix_lab_conns_${config.id}`, JSON.stringify(DEFAULT_CIRCUIT.connections))
      setLogs(["🔄 Canvas reset to default Object Detection demo.", "🔌 HC-SR04 + LED + Buzzer wired and ready.", "📦 Drag the obstacle box closer to the sensor to test detection!"])
      setPassed(null)
    }
  }

  // 3. AutoSave System on State changes
  const autoSave = useCallback((updatedCode: string, updatedComps: PlacedComponent[], updatedConns: WireConnection[]) => {
    if (!config) return
    localStorage.setItem(`roboflix_lab_code_${config.id}`, updatedCode)
    localStorage.setItem(`roboflix_lab_comps_${config.id}`, JSON.stringify(updatedComps))
    localStorage.setItem(`roboflix_lab_conns_${config.id}`, JSON.stringify(updatedConns))
  }, [config])

  const handleCodeChange = (newVal: string) => {
    setCode(newVal)
    autoSave(newVal, placedComponents, connections)
  }

  const handleUpdateComponents = (newComps: PlacedComponent[]) => {
    setPlacedComponents(newComps)
    autoSave(code, newComps, connections)
  }

  const handleUpdateConnections = (newConns: WireConnection[]) => {
    setConnections(newConns)
    autoSave(code, placedComponents, newConns)
  }

  const handleDragStart = (e: React.DragEvent, componentId: string) => {
    e.dataTransfer.setData("text/plain", componentId)
  }

  // 3b. Upload Code Flashing HUD Simulation
  const handleUploadCode = () => {
    if (!config) return
    setIsUploading(true)
    setUploadProgress(0)
    setUploadStepText("Checking syntax rules & compiling compiler variables...")
    setPassed(null)
    setSimulationHint(undefined)

    const steps = [
      { progress: 15, text: "Compiling code sketch.ino.cpp using avr-g++ compiler..." },
      { progress: 35, text: "Scanning USB serial ports for active microcontrollers..." },
      { progress: 55, text: "Found board on Virtual COM3. Initiating flash upload..." },
      { progress: 75, text: "Writing memory pages: 42% [====          ]" },
      { progress: 90, text: "Writing memory pages: 100% [==========]" },
      { progress: 100, text: "Flash write verification successful! Board resetting..." }
    ]

    let stepIdx = 0
    const interval = setInterval(() => {
      if (stepIdx < steps.length) {
        setUploadProgress(steps[stepIdx].progress)
        setUploadStepText(steps[stepIdx].text)
        stepIdx++
      } else {
        clearInterval(interval)
        setIsUploading(false)
        handleRunSimulation()
      }
    }, 450)
  }

  // 4. Run Client-Side Simulation & grading
  const handleRunSimulation = () => {
    if (!config) return
    setIsSimulating(true)
    setLogs(["⚙️ Starting build environment...", "🔨 Checking circuit connectivity rules..."])
    setPassed(null)
    setXpAwarded(0)
    setSimulationHint(undefined)

    setTimeout(() => {
      // Custom grading incorporating telemetry slider states
      const logsTemp: string[] = []
      logsTemp.push("⚙️ Compiling Sketch...")
      logsTemp.push("✨ Compilation Successful! Uploading to Microcontroller...")
      logsTemp.push(`[00:00:00] [SYSTEM] Sketch size: 4892 bytes. Dynamic memory: 254 bytes.`)
      logsTemp.push("[00:00:00] [SYSTEM] Waking up board peripherals...")

      let timestamp = 0
      const formatTime = (sec: number) => {
        const min = Math.floor(sec / 60).toString().padStart(2, "0")
        const s = (sec % 60).toString().padStart(2, "0")
        return `[00:${min}:${s}]`
      }

      // Check microcontroller board
      const hasArduino = placedComponents.some(c => c.componentId === "arduino-uno" || c.componentId === "esp32")
      if (!hasArduino) {
        setLogs([
          ...logsTemp,
          "⚠️ WARNING: Microcontroller board (Arduino Uno / ESP32) is missing from the canvas!",
          "[00:00:01] [SYSTEM] Board offline. Simulation halted."
        ])
        setPassed(false)
        setIsSimulating(false)
        return
      }

      // Check missing required components (skip if a demo is selected, or if user built a custom large circuit)
      const missingRequired = config.components.filter(reqId => {
        return !placedComponents.some(pc => pc.componentId === reqId)
      })

      if (missingRequired.length > 0 && !selectedDemoId && connections.length < 5) {
        setLogs([
          ...logsTemp,
          `⚠️ WARNING: Missing required components for this experiment: ${missingRequired.join(", ")}`,
          "[00:00:01] [SYSTEM] Simulation stopped due to missing peripherals."
        ])
        setPassed(false)
        setIsSimulating(false)
        return
      }

      // Check wire connection validation
      const hasWires = connections.length > 0
      if (!hasWires) {
        setLogs([
          ...logsTemp,
          "⚠️ WARNING: No jumper wires are connected! Peripherals are disconnected.",
          "[00:00:01] [SYSTEM] Open circuit detected."
        ])
        setPassed(false)
        setIsSimulating(false)
        return
      }

      // Dynamically simulate loop based on Slider telemetry states
      // Detect which scenario is running based on placed components
      const isCarPreset = activePlaygroundTab === "car"
      const isGardenPreset = activePlaygroundTab === "garden"
      const isHomePreset = activePlaygroundTab === "home"
      const hasUltrasonic = placedComponents.some(c => c.componentId === "hc-sr04")
      const hasLedOnCanvas = placedComponents.some(c => c.componentId === "led-red")
      const hasBuzzerOnCanvas = placedComponents.some(c => c.componentId === "buzzer")

      // Always log Object Detection Node init if HC-SR04 is present
      if (hasUltrasonic) {
        logsTemp.push(`[00:00:00] Object Detection Node Initialized.`)
        logsTemp.push(`[00:00:00] Waiting for obstacles...`)
      }

      for (let i = 0; i < 5; i++) {
        timestamp += 1
        if (hasUltrasonic) {
          // Ultrasonic scenario: show live distance readings and LED/buzzer state
          const tickDist = Math.max(10, envDistance + Math.floor(Math.random() * 6 - 3))
          logsTemp.push(`${formatTime(timestamp)} Sensor distance: ${tickDist} cm`)
          if (tickDist < 30) {
            if (hasLedOnCanvas)    logsTemp.push(`${formatTime(timestamp)} LED ON — obstacle in range!`)
            if (hasBuzzerOnCanvas) logsTemp.push(`${formatTime(timestamp)} ALERT - Obstacle detected - BUZZER active!`)
          } else {
            if (hasLedOnCanvas)    logsTemp.push(`${formatTime(timestamp)} LED OFF — path clear.`)
            if (isCarPreset)       logsTemp.push(`${formatTime(timestamp)} PATH CLEAR - Driving Forward at 80% speed`)
          }
        } else if (isCarPreset) {
          logsTemp.push(`${formatTime(timestamp)} Sensor distance: ${envDistance} cm`)
          if (envDistance < 30) {
            logsTemp.push(`${formatTime(timestamp)} ALERT - Obstacle detected - Stopping Motors!`)
          } else {
            logsTemp.push(`${formatTime(timestamp)} PATH CLEAR - Driving Forward at 80% speed`)
          }
        } else if (isGardenPreset) {
          logsTemp.push(`${formatTime(timestamp)} Soil Moisture: ${envMoisture}%`)
          if (envMoisture < 35) {
            logsTemp.push(`${formatTime(timestamp)} RELAY ON: Water pump activated!`)
          } else {
            logsTemp.push(`${formatTime(timestamp)} RELAY OFF: Soil moisture healthy.`)
          }
        } else if (isHomePreset) {
          logsTemp.push(`${formatTime(timestamp)} Ambient Light: ${envLight} | Motion: ${envPIRMotion ? "DETECTED" : "NONE"}`)
          if (envLight < 300 || envPIRMotion) {
            logsTemp.push(`${formatTime(timestamp)} STATUS: LED ON (Smart Lamp active)`)
          }
          if (envPIRMotion) {
            logsTemp.push(`${formatTime(timestamp)} STATUS: Opening Servo Door/Fan...`)
          }
        }
      }

      const lowerLogs = logsTemp.map(l => l.toLowerCase()).join(" ")
      const matchedKeywords = config.expectedOutputKeywords.filter(kw => {
        return lowerLogs.includes(kw.toLowerCase()) || code.toLowerCase().includes(kw.toLowerCase())
      })

      // Validation passes if expected keywords match OR we loaded presets nicely
      const validationPassed = matchedKeywords.length === config.expectedOutputKeywords.length || connections.length >= 5
      
      if (validationPassed) {
        logsTemp.push("🎉 SUCCESS: Experiment validation passed successfully!")
        logsTemp.push(`🏆 +100 XP AWARDED! Status synced to your LMS Profile.`)
        setPassed(true)
        setXpAwarded(100)
      } else {
        logsTemp.push("❌ VALIDATION FAILED: Circuit output did not match expected requirements.")
        setPassed(false)
        setSimulationHint(config.hint)
      }

      setLogs(logsTemp)
      setIsSimulating(false)

      if (validationPassed) {
        const completed = localStorage.getItem("roboflix_completed_experiments")
        let list: string[] = []
        if (completed) {
          try {
            list = JSON.parse(completed)
          } catch {}
        }
        if (!list.includes(config.id)) {
          list.push(config.id)
          localStorage.setItem("roboflix_completed_experiments", JSON.stringify(list))
        }
      }
    }, 1500)
  }

  const handleClearLogs = () => {
    setLogs([])
    setPassed(null)
    setXpAwarded(0)
    setSimulationHint(undefined)
  }

  // Preset Template Loader Trigger
  const handleLoadTemplate = (presetKey: "garden" | "car" | "home") => {
    const preset = LAB_TEMPLATES[presetKey]
    if (!preset) return

    if (confirm(`Load "${preset.name}" preset? This will overwrite your current workspace wires and code.`)) {
      setCode(preset.code)
      setPlacedComponents(preset.components)
      setConnections(preset.connections)
      setActivePlaygroundTab(presetKey)
      
      // AutoSave
      localStorage.setItem(`roboflix_lab_code_${config.id}`, preset.code)
      localStorage.setItem(`roboflix_lab_comps_${config.id}`, JSON.stringify(preset.components))
      localStorage.setItem(`roboflix_lab_conns_${config.id}`, JSON.stringify(preset.connections))

      // Trigger telemetry updates
      if (presetKey === "car") {
        setEnvDistance(45)
      } else if (presetKey === "garden") {
        setEnvMoisture(25)
      } else if (presetKey === "home") {
        setEnvLight(250)
        setEnvPIRMotion(true)
      }

      setLogs([`✅ Loaded preset workspace: ${preset.name}`, `🔧 Circuit pre-configured with ${preset.components.length} components.`])
      setPassed(null)
      setSimulationHint(undefined)
    }
  }

  // Export current sketch and configurations to JSON
  const handleExportProject = () => {
    const projectData = {
      experimentId: config.id,
      timestamp: new Date().toISOString(),
      code,
      placedComponents,
      connections
    }
    const blob = new Blob([JSON.stringify(projectData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `roboflix_lab_${config.id}_export.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const handleImportProject = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string)
        if (json.code !== undefined && Array.isArray(json.placedComponents) && Array.isArray(json.connections)) {
          setCode(json.code)
          setPlacedComponents(json.placedComponents)
          setConnections(json.connections)
          setSelectedDemoId("imported_custom")
          setIsSimulating(false)
          setPassed(null)
          setLogs(["[SYSTEM] Custom Project imported successfully!"])
        }
      } catch (err) {
        alert("Failed to parse project file.")
      }
    }
    reader.readAsText(file)
    e.target.value = "" // reset input
  }

  // AI Assistant Chat Drawer Send Handler
  const handleSendChatMessage = () => {
    if (!chatInput.trim()) return

    const userMsg = chatInput.trim()
    setChatMessages(prev => [...prev, { sender: "user", text: userMsg }])
    setChatInput("")
    setIsChatTyping(true)

    // Scroll chat window to bottom
    setTimeout(() => {
      if (chatScrollRef.current) {
        chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight
      }
    }, 50)

    // Generate AI simulated response based on question matching
    setTimeout(() => {
      let aiResponse = "I've analyzed your question. To implement this circuit, ensure you route power from VCC (5V) to the sensor's power pins, share common ground, and hook signal outputs to digital or analog GPIO pins on the Uno. Click 'Upload' to flash and test!"
      const query = userMsg.toLowerCase()

      if (query.includes("wire") || query.includes("connections") || query.includes("how to connect")) {
        aiResponse = `Here is a step-by-step wiring recommendation:
1. Connect **GND** of Arduino Uno to the Ground rail or negative pin of your peripheral.
2. Route **5V** or **3V3** from Arduino to the Power pin of the sensor (HC-SR04/PIR).
3. Connect **TRIG** pin of the Ultrasonic sensor to D7, and **ECHO** to D6.
4. If using an LED, connect the anode (+) through a **220Ω resistor** to digital pin D13, and the cathode (-) to GND.`
      } else if (query.includes("dht11") || query.includes("dht22") || query.includes("temperature")) {
        aiResponse = "The **DHT11 sensor** reads environment humidity and temperature. Wire VCC to 5V, GND to GND, and DATA to digital pin D2. In code, initialize the DHT library, start communication using `dht.begin()`, and fetch readings using `dht.readTemperature()`."
      } else if (query.includes("compilation") || query.includes("error") || query.includes("fail") || query.includes("semicolon")) {
        aiResponse = "Compilation errors usually arise from three issues:\n1. **Missing semicolons (;)** at the end of function lines.\n2. **Mismatched curly braces ({ or })** causing syntax block confusion.\n3. **Mismatched Pin numbers** in code definitions vs. canvas wires."
      } else if (query.includes("car") || query.includes("motor") || query.includes("l298n")) {
        aiResponse = "To drive the Geared DC Motor using the L298N driver:\n- Connect **ENA** to a PWM-capable pin (D9/D10/D11) to control motor speed.\n- Connect **IN1** and **IN2** to digital output pins (D4/D5) to set direction.\n- Set IN1 HIGH and IN2 LOW to spin forward; reverse pins to spin backward."
      } else if (query.includes("garden") || query.includes("moisture") || query.includes("relay")) {
        aiResponse = "For the Smart Agriculture setup:\n- Connect the **Soil Moisture Sensor** SIG pin to Analog input A0.\n- Connect the **Relay module** IN pin to Digital pin D4.\n- Code logic: Read raw analog input, map it to 0-100%, and switch the relay high/low to trigger the mock pump droplets!"
      }

      setChatMessages(prev => [...prev, { sender: "ai", text: aiResponse }])
      setIsChatTyping(false)

      setTimeout(() => {
        if (chatScrollRef.current) {
          chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight
        }
      }, 50)
    }, 1200)
  }

  // Handle Preset quick prompts in AI assistant drawer
  const handleQuickPrompt = (promptText: string) => {
    setChatMessages(prev => [...prev, { sender: "user", text: promptText }])
    setIsChatTyping(true)
    
    setTimeout(() => {
      let responseText = ""
      if (promptText.includes("Check my wiring")) {
        if (connections.length === 0) {
          responseText = "⚠️ ANALYSIS: I don't see any jumper wires connected! Drag wires from Arduino pins to your sensor nodes to create active electrical nets."
        } else {
          responseText = `❇️ WIRING REPORT: Active nodes look good! 
- Found ${placedComponents.length} parts on board.
- Connected ${connections.length} circuit nets.
- Ground lanes are shared. Ready to compile and flash code!`
        }
      } else if (promptText.includes("How to wire LDR")) {
        responseText = "To wire the LDR Photoresistor: Connect Pin 1 of LDR to Arduino 5V. Connect Pin 2 of LDR to Arduino Analog A0. Also, place a pull-down resistor from A0 to GND to form a voltage divider!"
      } else if (promptText.includes("Explain Stepper Motor")) {
        responseText = "The **28BYJ-48 Stepper Motor** operates by sequential coil activation. It utilizes 4 inputs (IN1-IN4) connected to digital outputs (e.g. D8-D11) on the Arduino. Pulse them in sequence to rotate step-by-step!"
      } else {
        responseText = "I can guide you! Make sure your GND lines are shared, compile using 'Verify', and watch the serial output."
      }

      setChatMessages(prev => [...prev, { sender: "ai", text: responseText }])
      setIsChatTyping(false)
      
      setTimeout(() => {
        if (chatScrollRef.current) {
          chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight
        }
      }, 50)
    }, 1000)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        <div className="text-center space-y-4">
          <div className="w-10 h-10 border-2 border-red-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-mono text-gray-500">Checking lab credentials...</p>
        </div>
      </div>
    )
  }

  if (!config) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6 text-white text-center">
        <div className="max-w-md bg-gray-900 border border-gray-800 rounded-2xl p-8 space-y-6">
          <ShieldAlert className="w-12 h-12 text-red-650 mx-auto" />
          <div>
            <h1 className="text-xl font-bold">Experiment Configuration Missing</h1>
            <p className="text-gray-400 text-sm mt-2">
              The Virtual Lab experiment ID <span className="font-mono text-red-400">"{experimentId}"</span> is currently under construction or does not exist.
            </p>
          </div>
          <Link href="/lms/dashboard">
            <button className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-xs font-bold rounded-lg transition-all cursor-pointer">
              Go to Dashboard
            </button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className={`h-screen w-screen flex flex-col overflow-hidden font-sans antialiased transition-colors duration-300 ${
      isNightMode === false ? "bg-[#f3f4f6] text-[#1f2937]" : "bg-[#070707] text-white"
    }`}>
      
      {/* ─── Premium Header Ribbon ─── */}
      <header className={`h-16 border-b flex items-center justify-between px-6 flex-shrink-0 z-40 select-none transition-colors ${
        isNightMode === false ? "bg-white border-gray-200" : "bg-black border-gray-800"
      }`}>
        <div className="flex items-center gap-6">
          <Link href="/">
            <span className="text-xl sm:text-2xl font-bold cursor-pointer">
              ROBO<span className="text-red-600">FLIX</span>
            </span>
          </Link>

          <span className={`h-5 w-[1px] hidden sm:inline ${
            isNightMode === false ? "bg-gray-200" : "bg-gray-800"
          }`} />

          <div className="hidden sm:flex items-center gap-2">
            <Cpu className="w-4 h-4 text-red-650" />
            <span className={`text-xs font-mono font-bold uppercase tracking-widest ${
              isNightMode === false ? "text-gray-650" : "text-gray-300"
            }`}>
              Virtual Lab Sandbox v2.0
            </span>
          </div>
        </div>

        {/* Toolbar Center/Right Actions */}
        <div className="flex items-center gap-3">

          {/* ⭐ DEFAULT WORKS Button – opens demo project library */}
          <button
            onClick={() => setIsDefaultWorksOpen(true)}
            title="Browse ready-made demo projects"
            className={`flex items-center gap-1.5 px-3 py-1.5 border rounded-lg text-[10px] font-bold transition-all hover:scale-105 ${
              isNightMode === false
                ? "bg-gradient-to-r from-red-50 to-orange-50 border-red-200 hover:border-red-400 text-red-600"
                : "bg-gradient-to-r from-red-950/60 to-orange-950/40 border-red-900/60 hover:border-red-600 text-red-400 hover:text-red-300 shadow-[0_0_8px_rgba(220,38,38,0.2)]"
            }`}
          >
            <span className="text-sm">⚡</span>
            <span>Default Works</span>
          </button>

          {/* Reset to Default demo circuit */}
          <button
            onClick={handleResetToDefault}
            title="Reset to default Object Detection demo circuit"
            className={`flex items-center gap-1.5 px-3 py-1.5 border rounded-lg text-[10px] font-bold transition-colors ${
              isNightMode === false
                ? "bg-gray-50 border-gray-200 hover:bg-gray-100 text-gray-600"
                : "bg-white/5 border-gray-800 hover:bg-white/10 text-gray-400 hover:text-white"
            }`}
          >
            <RefreshCw className="w-3 h-3 text-red-500" />
            <span className="hidden sm:inline">Reset Demo</span>
          </button>

          {/* Preset templates dropdown loader */}
          <div className="relative group">
            <select
              onChange={(e) => handleLoadTemplate(e.target.value as any)}
              defaultValue=""
              className={`px-3 py-1.5 text-xs font-bold rounded-lg border focus:outline-none transition-all cursor-pointer ${
                isNightMode === false 
                  ? "bg-gray-50 border-gray-250 text-gray-700 focus:border-red-500" 
                  : "bg-gray-900 border-gray-800 text-gray-200 focus:border-red-600"
              }`}
            >
              <option value="" disabled>📁 Load Project Preset...</option>
              <option value="garden">🌱 Smart Garden Template</option>
              <option value="car">🚗 Obstacle Car Template</option>
              <option value="home">🏠 Smart Home Template</option>
            </select>
          </div>

          {/* Workspace Layout Selector */}
          <div className={`flex items-center border rounded-lg overflow-hidden ${
            isNightMode === false ? "bg-gray-50 border-gray-200" : "bg-gray-900 border-gray-800"
          }`}>
            <button
              onClick={() => setWorkspaceLayout("schematic")}
              className={`p-1.5 text-xs font-bold transition flex items-center gap-1 ${
                workspaceLayout === "schematic" 
                  ? "bg-red-600 text-white" 
                  : isNightMode === false ? "text-gray-500 hover:bg-gray-100" : "text-gray-400 hover:bg-white/5"
              }`}
              title="Schematic Focus Layout"
            >
              <Layout className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setWorkspaceLayout("immersive")}
              className={`p-1.5 text-xs font-bold transition flex items-center gap-1 ${
                workspaceLayout === "immersive" 
                  ? "bg-red-600 text-white" 
                  : isNightMode === false ? "text-gray-500 hover:bg-gray-100" : "text-gray-400 hover:bg-white/5"
              }`}
              title="Immersive Split Layout"
            >
              <Sparkles className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setWorkspaceLayout("telemetry")}
              className={`p-1.5 text-xs font-bold transition flex items-center gap-1 ${
                workspaceLayout === "telemetry" 
                  ? "bg-red-600 text-white" 
                  : isNightMode === false ? "text-gray-500 hover:bg-gray-100" : "text-gray-400 hover:bg-white/5"
              }`}
              title="Telemetry Focus Layout"
            >
              <Activity className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Day/Night Theme Toggle */}
          <button
            onClick={() => setIsNightMode(!isNightMode)}
            className={`p-2 rounded-lg border transition-colors ${
              isNightMode === false 
                ? "bg-gray-50 border-gray-200 text-amber-500 hover:bg-gray-100" 
                : "bg-gray-900 border-gray-800 text-yellow-400 hover:bg-white/5"
            }`}
            title="Toggle Day/Night Viewport"
          >
            {isNightMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* AI Helper Toggle Button */}
          <button
            onClick={() => setIsAIDrawerOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-500 text-xs font-semibold text-white rounded-lg transition-colors shadow-md shadow-red-950/20"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            Ask Tutor
          </button>

          {/* Export / Import */}
          <div className="flex items-center gap-1.5 ml-1">
            <button
              onClick={handleExportProject}
              className={`flex items-center gap-1.5 px-3 py-1.5 border rounded-lg text-xs font-semibold transition-colors ${
                isNightMode === false 
                  ? "bg-gray-50 border-gray-200 hover:bg-gray-100 text-gray-700" 
                  : "bg-white/5 border-white/10 hover:bg-white/10 text-gray-200"
              }`}
              title="Save project to your device"
            >
              <Download className="w-3.5 h-3.5" />
              Save
            </button>
            <label
              className={`flex items-center gap-1.5 px-3 py-1.5 border rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                isNightMode === false 
                  ? "bg-gray-50 border-gray-200 hover:bg-gray-100 text-gray-700" 
                  : "bg-white/5 border-white/10 hover:bg-white/10 text-gray-200"
              }`}
              title="Load project from your device"
            >
              <Upload className="w-3.5 h-3.5" />
              Load
              <input type="file" accept=".json" className="hidden" onChange={handleImportProject} />
            </label>
          </div>

          {/* Watch Page Link */}
          <button
            onClick={() => router.back()}
            className={`flex items-center gap-1.5 px-3 py-1.5 border rounded-lg text-xs font-semibold transition-colors ${
              isNightMode === false 
                ? "bg-gray-50 border-gray-200 hover:bg-gray-100" 
                : "bg-white/5 border-white/10 hover:bg-white/10"
            }`}
          >
            <ArrowLeft className="w-3.5 h-3.5 text-red-500" />
            Watch Lecture
          </button>
        </div>
      </header>

      {/* ─── Live Simulation Status Banner ─── */}
      {isSimulating && simBanner && (
        <div className={`flex-shrink-0 px-5 py-2 flex items-center gap-3 text-[11px] font-mono font-bold border-b transition-all ${
          simBanner.includes('OBSTACLE')
            ? 'bg-red-950/80 border-red-900/50 text-red-300'
            : 'bg-emerald-950/80 border-emerald-900/50 text-emerald-300'
        }`}>
          <span className={`w-2 h-2 rounded-full flex-shrink-0 ${
            simBanner.includes('OBSTACLE') ? 'bg-red-500 animate-pulse shadow-[0_0_6px_#ef4444]' : 'bg-emerald-500 animate-pulse shadow-[0_0_6px_#22c55e]'
          }`} />
          {simBanner}
          <span className="ml-auto text-[9px] opacity-60">Drag obstacle box to change distance</span>
        </div>
      )}

      {/* ─── Main Content Canvas Area ─── */}
      <div className="flex-1 flex overflow-hidden min-h-0 relative">
        
        {/* Left bin remains standard Component Palette */}
        <ComponentPalette
          config={config}
          onDragStart={handleDragStart}
        />

        {/* ─── RENDERING LAYOUT VARIATIONS ─── */}
        
        {/* LAYOUT A: SCHEMATIC FOCUS */}
        {workspaceLayout === "schematic" && (
          <div className="flex-1 flex overflow-hidden min-h-0">
            {/* Center Canvas */}
          <WiringCanvas
              placedComponents={placedComponents}
              connections={connections}
              onUpdateComponents={handleUpdateComponents}
              onUpdateConnections={handleUpdateConnections}
              isSimulating={isSimulating}
              onRun={handleRunSimulation}
              onUpload={handleUploadCode}
              onClear={handleClearLogs}
              passed={passed}
              isNightMode={isNightMode}
              ledActive={ledActive}
              buzzerActive={buzzerActive}
            />

            {/* Right Editor/Monitor sidebar */}
            <div className={`w-[380px] border-l flex flex-col h-full flex-shrink-0 transition-colors ${
              isNightMode === false ? "bg-white border-gray-200" : "bg-[#0c0c0c] border-gray-800"
            }`}>
              <CodeEditor code={code} onChange={handleCodeChange} />
              <SerialMonitor
                logs={logs}
                isSimulating={isSimulating}
                onRun={handleRunSimulation}
                onUpload={handleUploadCode}
                onClear={handleClearLogs}
                passed={passed}
                xpAwarded={xpAwarded}
                hint={simulationHint}
              />
            </div>
          </div>
        )}

        {/* LAYOUT B: IMMERSIVE SPLIT LAYOUT */}
        {workspaceLayout === "immersive" && (
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
            {/* Upper Split row */}
            <div className="flex-1 flex min-h-0 border-b border-gray-850">
              
              {/* Wiring grid canvas takes left portion */}
              <div className="flex-1 h-full flex flex-col min-w-0">
                <WiringCanvas
                  placedComponents={placedComponents}
                  connections={connections}
                  onUpdateComponents={handleUpdateComponents}
                  onUpdateConnections={handleUpdateConnections}
                  isSimulating={isSimulating}
                  onRun={handleRunSimulation}
                  onUpload={handleUploadCode}
                  onClear={handleClearLogs}
                  passed={passed}
                  isNightMode={isNightMode}
                  ledActive={ledActive}
                  buzzerActive={buzzerActive}
                />
              </div>

              {/* Right portion is the 2.5D visual playground environment */}
              <div className={`w-[360px] border-l flex flex-col h-full flex-shrink-0 p-4 space-y-4 overflow-y-auto custom-scrollbar ${
                isNightMode === false ? "bg-[#f9fafb] border-gray-200 text-gray-700" : "bg-black/90 border-gray-850"
              }`}>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-red-500 mb-1">
                    Environment Simulation
                  </h3>
                  <p className="text-[10px] text-gray-500 leading-snug">
                    Real-time visualization of your active microcontroller firmware state.
                  </p>
                </div>

                {/* Environment Sandbox Switch Tabs */}
                <div className={`flex border rounded-lg overflow-hidden text-[10px] uppercase font-bold tracking-wider ${
                  isNightMode === false ? "bg-gray-150 border-gray-250 text-gray-700" : "bg-gray-950 border-gray-850"
                }`}>
                  <button
                    onClick={() => setActivePlaygroundTab("home")}
                    className={`flex-1 py-1.5 text-center transition ${
                      activePlaygroundTab === "home" 
                        ? "bg-red-650 text-white" 
                        : isNightMode === false ? "hover:bg-gray-100" : "hover:bg-white/5"
                    }`}
                  >
                    Smart Home
                  </button>
                  <button
                    onClick={() => setActivePlaygroundTab("car")}
                    className={`flex-1 py-1.5 text-center transition ${
                      activePlaygroundTab === "car" 
                        ? "bg-red-650 text-white" 
                        : isNightMode === false ? "hover:bg-gray-100" : "hover:bg-white/5"
                    }`}
                  >
                    Obstacle Car
                  </button>
                  <button
                    onClick={() => setActivePlaygroundTab("garden")}
                    className={`flex-1 py-1.5 text-center transition ${
                      activePlaygroundTab === "garden" 
                        ? "bg-red-650 text-white" 
                        : isNightMode === false ? "hover:bg-gray-100" : "hover:bg-white/5"
                    }`}
                  >
                    Agriculture
                  </button>
                </div>

                {/* ─── RENDER PLAYGROUND WIDGETS ─── */}
                <div className="flex-1 flex items-center justify-center min-h-[160px]">
                  
                  {/* Smart Home Sandbox */}
                  {activePlaygroundTab === "home" && (
                    <div className="w-full space-y-3">
                      <svg className="w-full h-44 bg-slate-950 rounded-2xl border border-slate-800 p-2 overflow-hidden relative shadow-2xl">
                        {/* House Body */}
                        <rect x="70" y="45" width="130" height="85" fill="#1e293b" stroke="#334155" strokeWidth="2.5" rx="8" />
                        <polygon points="60,45 135,12 210,45" fill="#e11d48" stroke="#f43f5e" strokeWidth="1" />
                        
                        {/* Light inside house */}
                        <circle cx="135" cy="75" r="14" fill={envLight < 350 ? "#fef08a" : "#475569"} className="transition-colors duration-300" />
                        <circle cx="135" cy="75" r="22" fill={envLight < 350 ? "rgba(254,240,138,0.18)" : "transparent"} className="transition-colors duration-300" />
                        
                        {/* Door Servo flap */}
                        <rect x="115" y="95" width="40" height="35" fill="#ea580c" rx="1" />
                        {/* Servo arm rotating representing open door */}
                        {envPIRMotion && (
                          <line x1="135" y1="95" x2="155" y2="80" stroke="#fef08a" strokeWidth="3.5" strokeLinecap="round" className="animate-pulse" />
                        )}

                        {/* Window */}
                        <rect x="85" y="65" width="22" height="22" fill="#38bdf8" opacity="0.7" rx="2" />
                        
                        {/* Rooftop Fan spinner */}
                        <g transform="translate(135, 30)">
                          <circle cx="0" cy="0" r="3.5" fill="#94a3b8" />
                          <line x1="-16" y1="0" x2="16" y2="0" stroke="#f1f5f9" strokeWidth="3" className={isSimulating && envTemp > 28 ? "origin-center animate-spin" : ""} />
                        </g>

                        {/* Street lamp (LDR) */}
                        <rect x="25" y="45" width="3.5" height="85" fill="#475569" />
                        <path d="M 20 45 L 34 45 L 27 38 Z" fill="#94a3b8" />
                        <circle cx="27" cy="48" r="7.5" fill={envLight < 500 ? "#fef08a" : "#64748b"} className="transition-colors duration-300" />
                        
                        {/* Walking Human character */}
                        <g transform={`translate(${envPIRMotion ? 40 : 220}, 75)`} className="transition-all duration-700">
                          <circle cx="10" cy="10" r="6.5" fill="#fbcfe8" />
                          <line x1="10" y1="16" x2="10" y2="34" stroke="#fbcfe8" strokeWidth="2.5" />
                          {/* Walking motion legs */}
                          <line x1="10" y1="34" x2="4" y2="48" stroke="#fbcfe8" strokeWidth="2" />
                          <line x1="10" y1="34" x2="16" y2="48" stroke="#fbcfe8" strokeWidth="2" />
                          {/* Arms */}
                          <line x1="10" y1="20" x2="2" y2="28" stroke="#fbcfe8" strokeWidth="2" />
                          <line x1="10" y1="20" x2="18" y2="28" stroke="#fbcfe8" strokeWidth="2" />
                        </g>
                      </svg>
                      
                      {/* Telemetry quick sliders */}
                      <div className="space-y-2.5 p-3 bg-gray-900/50 border border-gray-800/80 rounded-xl text-xs font-mono">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Ambient Light (LDR):</span>
                          <span className="font-bold text-amber-500">{envLight} Analog</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="1023"
                          value={envLight}
                          onChange={(e) => setEnvLight(Number(e.target.value))}
                          className="w-full accent-red-650 h-1 rounded bg-gray-800 cursor-pointer"
                        />

                        <div className="flex justify-between items-center pt-1">
                          <span className="text-gray-400">PIR Motion:</span>
                          <button
                            onClick={() => setEnvPIRMotion(!envPIRMotion)}
                            className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all uppercase ${
                              envPIRMotion ? "bg-red-600 text-white" : "bg-gray-800 text-gray-400"
                            }`}
                          >
                            {envPIRMotion ? "Motion Active" : "No Motion"}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Obstacle Avoidance Robot Car Sandbox */}
                  {activePlaygroundTab === "car" && (
                    <div className="w-full space-y-3">
                      <svg className="w-full h-44 bg-slate-950 rounded-2xl border border-slate-800 p-2 overflow-hidden relative shadow-2xl">
                        {/* Track road */}
                        <rect x="0" y="65" width="100%" height="45" fill="#334155" />
                        <line x1="0" y1="87.5" x2="100%" y2="87.5" stroke="#fef08a" strokeDasharray="12,12" strokeWidth="2.5" />
                        
                        {/* Obstacle box */}
                        <rect x="270" y="55" width="30" height="65" fill="#b45309" stroke="#d97706" rx="4" />
                        <text x="273" y="90" fill="#fff" className="text-[9px] font-mono font-bold">OBST</text>
                        
                        {/* Robot vehicle */}
                        <g transform={`translate(${Math.max(10, Math.min(210, envDistance * 1.5))}, 60)`} className="transition-transform duration-300">
                          {/* Chassis body */}
                          <rect x="0" y="5" width="48" height="34" fill="#ef4444" stroke="#b91c1c" strokeWidth="1.5" rx="5" />
                          <rect x="8" y="10" width="32" height="24" fill="#1e293b" rx="2" />
                          
                          {/* Wheels */}
                          <circle cx="10" cy="40" r="5.5" fill="#000" stroke="#475569" className={isSimulating && envDistance > 30 ? "animate-spin" : ""} />
                          <circle cx="38" cy="40" r="5.5" fill="#000" stroke="#475569" className={isSimulating && envDistance > 30 ? "origin-center animate-spin" : ""} />
                          
                          {/* Ultrasonic Sensor eyes */}
                          <rect x="44" y="9" width="8" height="26" fill="#1e1b4b" rx="1" />
                          <circle cx="48" cy="15" r="4.5" fill="#3b82f6" stroke="#93c5fd" strokeWidth="1" />
                          <circle cx="48" cy="29" r="4.5" fill="#3b82f6" stroke="#93c5fd" strokeWidth="1" />

                          {/* Sensor Beam wave indicator */}
                          {isSimulating && (
                            <path d="M 50 12 L 270 87 L 50 32" fill="rgba(59,130,246,0.15)" stroke="rgba(59,130,246,0.3)" strokeWidth="1" strokeDasharray="3,3" />
                          )}
                        </g>
                      </svg>
                      
                      {/* Telemetry controls */}
                      <div className="space-y-2.5 p-3 bg-gray-900/50 border border-gray-800/80 rounded-xl text-xs font-mono">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Obstacle Distance (cm):</span>
                          <span className="font-bold text-red-500">{envDistance} cm</span>
                        </div>
                        <input
                          type="range"
                          min="10"
                          max="200"
                          value={envDistance}
                          onChange={(e) => setEnvDistance(Number(e.target.value))}
                          className="w-full accent-red-650 h-1 rounded bg-gray-800 cursor-pointer"
                        />
                      </div>
                    </div>
                  )}

                  {/* Smart Agriculture Sandbox */}
                  {activePlaygroundTab === "garden" && (
                    <div className="w-full space-y-3">
                      <svg className="w-full h-44 bg-slate-950 rounded-2xl border border-slate-800 p-2 overflow-hidden relative shadow-2xl">
                        {/* Dirt/Soil base */}
                        <rect x="0" y="110" width="100%" height="34" fill="#451a03" />
                        <line x1="0" y1="110" x2="100%" y2="110" stroke="#15803d" strokeWidth="2.5" />
                        
                        {/* Plant Pot */}
                        <rect x="135" y="70" width="40" height="40" fill="#c2410c" stroke="#ea580c" rx="3" />
                        
                        {/* Plant */}
                        <g transform="translate(155, 70)">
                          {/* Stem */}
                          <path d="M 0 0 Q -8 -25 -8 -45" fill="none" stroke={envMoisture < 30 ? "#a16207" : "#22c55e"} strokeWidth="3.5" strokeLinecap="round" />
                          {/* Leaf components */}
                          {envMoisture >= 30 && envMoisture <= 80 ? (
                            <>
                              <path d="M -8 -20 Q -22 -24 -28 -18 Q -16 -12 -8 -20" fill="#22c55e" />
                              <path d="M -8 -32 Q 6 -36 12 -30 Q 2 -24 -8 -32" fill="#22c55e" />
                              {/* Glowing flower petals */}
                              <circle cx="-8" cy="-47" r="6" fill="#ec4899" className="animate-pulse" />
                              <circle cx="-8" cy="-47" r="2.5" fill="#eab308" />
                            </>
                          ) : (
                            // Wilted droop leaf representation
                            <path d="M -8 -15 Q -24 -6 -32 -2" fill="none" stroke="#a16207" strokeWidth="2" />
                          )}
                        </g>

                        {/* Irrigation Nozzle */}
                        <rect x="75" y="25" width="50" height="8" fill="#475569" rx="1.5" />
                        <rect x="115" y="25" width="10" height="18" fill="#475569" />
                        
                        {/* Water droplets */}
                        {isSimulating && envMoisture < 35 && (
                          <g className="animate-bounce">
                            <circle cx="120" cy="50" r="2.5" fill="#38bdf8" />
                            <circle cx="120" cy="65" r="2" fill="#38bdf8" />
                            <circle cx="120" cy="80" r="1.5" fill="#38bdf8" />
                          </g>
                        )}
                        
                        {/* Soil Health feedback label */}
                        <text x="10" y="22" fill="#94a3b8" className="text-[8.5px] font-mono uppercase tracking-wider font-bold">
                          Soil condition: {
                            envMoisture < 30 ? "❌ DRY SOIL" 
                            : envMoisture > 80 ? "⚠️ WATERLOGGED" 
                            : "❇️ MOIST & HEALTHY"
                          }
                        </text>
                      </svg>
                      
                      {/* Moisture Telemetry Slider */}
                      <div className="space-y-2.5 p-3 bg-gray-900/50 border border-gray-800/80 rounded-xl text-xs font-mono">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Soil Moisture Level:</span>
                          <span className="font-bold text-green-500">{envMoisture}% Moisture</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={envMoisture}
                          onChange={(e) => setEnvMoisture(Number(e.target.value))}
                          className="w-full accent-red-650 h-1 rounded bg-gray-800 cursor-pointer"
                        />
                      </div>
                    </div>
                  )}

                </div>

                {/* Micro-dashboard gauge sensors */}
                <div className="pt-2 border-t border-gray-800">
                  <h4 className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-2">Sensor Telemetry Feed</h4>
                  <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
                    <div className="p-2 bg-gray-900/55 rounded border border-gray-850 flex items-center justify-between">
                      <span className="text-gray-400">Temp:</span>
                      <span className="text-emerald-500 font-bold">{envTemp}°C</span>
                    </div>
                    <div className="p-2 bg-gray-900/55 rounded border border-gray-850 flex items-center justify-between">
                      <span className="text-gray-400">Humidity:</span>
                      <span className="text-emerald-500 font-bold">{envHumidity}%</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Lower Editor/Monitor Row */}
            <div className="h-[40%] flex min-h-[180px] border-t border-gray-850">
              {/* Left Code Editor */}
              <div className="flex-1 h-full border-r border-gray-850">
                <CodeEditor code={code} onChange={handleCodeChange} />
              </div>
              
              {/* Right Serial Monitor Output */}
              <div className="w-[380px] h-full flex-shrink-0">
                <SerialMonitor
                  logs={logs}
                  isSimulating={isSimulating}
                  onRun={handleRunSimulation}
                  onUpload={handleUploadCode}
                  onClear={handleClearLogs}
                  passed={passed}
                  xpAwarded={xpAwarded}
                  hint={simulationHint}
                />
              </div>
            </div>
          </div>
        )}

        {/* LAYOUT C: TELEMETRY FOCUS */}
        {workspaceLayout === "telemetry" && (
          <div className="flex-1 flex overflow-hidden min-h-0">
            {/* Center Expanded Telemetry Dashboard */}
            <div className={`flex-1 p-6 space-y-6 overflow-y-auto custom-scrollbar ${
              isNightMode === false ? "bg-white text-gray-700" : "bg-[#070707] text-white"
            }`}>
              <div>
                <h2 className="text-lg font-bold text-red-500 uppercase tracking-widest flex items-center gap-2">
                  <Activity className="w-5 h-5 text-red-650 animate-pulse" />
                  Advanced Telemetry Dashboard
                </h2>
                <p className="text-xs text-gray-500 mt-1 font-sans">
                  Monitor live system telemetry, adjust physical constants, and inspect micro-controller serial registers.
                </p>
              </div>

              {/* Sliders Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 font-mono">
                {/* LDR light sensor */}
                <div className={`p-4 rounded-xl border ${
                  isNightMode === false ? "bg-gray-50 border-gray-250" : "bg-gray-900/60 border-gray-850"
                }`}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-gray-400 font-bold">LDR LIGHT LEVEL</span>
                    <span className="text-sm font-bold text-amber-500">{envLight} / 1023</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1023"
                    value={envLight}
                    onChange={(e) => setEnvLight(Number(e.target.value))}
                    className="w-full accent-red-650 h-1.5 rounded bg-gray-800 cursor-pointer"
                  />
                  <div className="text-[9px] text-gray-500 mt-2">
                    Triggers smart lighting thresholds when light &lt; 300 analog.
                  </div>
                </div>

                {/* HC-SR04 distance sensor */}
                <div className={`p-4 rounded-xl border ${
                  isNightMode === false ? "bg-gray-50 border-gray-250" : "bg-gray-900/60 border-gray-850"
                }`}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-gray-400 font-bold">HC-SR04 DISTANCE</span>
                    <span className="text-sm font-bold text-blue-500">{envDistance} cm</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="200"
                    value={envDistance}
                    onChange={(e) => setEnvDistance(Number(e.target.value))}
                    className="w-full accent-red-650 h-1.5 rounded bg-gray-800 cursor-pointer"
                  />
                  <div className="text-[9px] text-gray-500 mt-2">
                    Alarms buzzer or halts drive motors if distance falls &lt; 30cm.
                  </div>
                </div>

                {/* Soil Moisture sensor */}
                <div className={`p-4 rounded-xl border ${
                  isNightMode === false ? "bg-gray-50 border-gray-250" : "bg-gray-900/60 border-gray-850"
                }`}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-gray-400 font-bold">SOIL MOISTURE</span>
                    <span className="text-sm font-bold text-green-500">{envMoisture}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={envMoisture}
                    onChange={(e) => setEnvMoisture(Number(e.target.value))}
                    className="w-full accent-red-650 h-1.5 rounded bg-gray-800 cursor-pointer"
                  />
                  <div className="text-[9px] text-gray-500 mt-2">
                    Closes solenoid relay to start drip pump when moisture drops &lt; 35%.
                  </div>
                </div>

                {/* DHT11 temperature */}
                <div className={`p-4 rounded-xl border ${
                  isNightMode === false ? "bg-gray-50 border-gray-250" : "bg-gray-900/60 border-gray-850"
                }`}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-gray-400 font-bold">DHT11 TEMPERATURE</span>
                    <span className="text-sm font-bold text-red-500">{envTemp}°C</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="50"
                    value={envTemp}
                    onChange={(e) => setEnvTemp(Number(e.target.value))}
                    className="w-full accent-red-650 h-1.5 rounded bg-gray-800 cursor-pointer"
                  />
                </div>

                {/* Gas MQ-2 Sensor */}
                <div className={`p-4 rounded-xl border ${
                  isNightMode === false ? "bg-gray-50 border-gray-250" : "bg-gray-900/60 border-gray-850"
                }`}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-gray-400 font-bold">MQ-2 GAS DENSITY</span>
                    <span className="text-sm font-bold text-purple-500">{envGas} PPM</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="800"
                    value={envGas}
                    onChange={(e) => setEnvGas(Number(e.target.value))}
                    className="w-full accent-red-650 h-1.5 rounded bg-gray-800 cursor-pointer"
                  />
                  <div className="text-[9px] text-gray-500 mt-2">
                    Simulates leaks of LPG, smoke, or alcohol particles.
                  </div>
                </div>

                {/* Export Project and presets quick button */}
                <div className={`p-4 rounded-xl border flex flex-col justify-between ${
                  isNightMode === false ? "bg-gray-50 border-gray-250" : "bg-gray-900/60 border-gray-850"
                }`}>
                  <span className="text-xs text-gray-400 font-bold mb-2">PROJECT EXPORT</span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={handleExportProject}
                      className="flex items-center justify-center gap-1.5 px-3 py-2 bg-red-600 hover:bg-red-500 text-white text-[11px] font-bold rounded-lg transition-colors cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      JSON Config
                    </button>
                    <button
                      onClick={() => {
                        const blob = new Blob([code], { type: "text/plain" })
                        const url = URL.createObjectURL(blob)
                        const a = document.createElement("a")
                        a.href = url
                        a.download = "sketch.ino"
                        a.click()
                        URL.revokeObjectURL(url)
                      }}
                      className="flex items-center justify-center gap-1.5 px-3 py-2 bg-gray-850 hover:bg-gray-800 border border-gray-700 text-[11px] font-bold rounded-lg transition-colors cursor-pointer text-gray-300 hover:text-white"
                    >
                      sketch.ino
                    </button>
                  </div>
                </div>
              </div>

              {/* Lower Section: Telemetry Console Monitor */}
              <div className={`rounded-xl border p-4 space-y-3 ${
                isNightMode === false ? "bg-gray-50 border-gray-250" : "bg-gray-950/80 border-gray-850"
              }`}>
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-red-500">Live Serial Data logs</h4>
                  <button onClick={handleClearLogs} className="text-xs text-gray-500 hover:text-gray-300">Clear</button>
                </div>
                
                <div className="h-56 overflow-y-auto bg-black/40 rounded-lg p-4 font-mono text-xs text-emerald-400 space-y-1.5 border border-gray-850/50 custom-scrollbar">
                  {logs.length > 0 ? (
                    logs.map((log, idx) => (
                      <p key={idx} className={log.includes("❌") ? "text-red-500" : log.includes("🎉") ? "text-green-400" : ""}>
                        {log}
                      </p>
                    ))
                  ) : (
                    <p className="text-gray-650 italic">Telemetry stream idle. Click Verify/Upload to compile and begin monitoring sensor thresholds.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Right Editor sidebar */}
            <div className={`w-[380px] border-l flex flex-col h-full flex-shrink-0 transition-colors ${
              isNightMode === false ? "bg-white border-gray-200" : "bg-[#0c0c0c] border-gray-800"
            }`}>
              <CodeEditor code={code} onChange={handleCodeChange} />
              <div className="h-[25%] p-4 border-t border-gray-850 flex flex-col justify-between font-sans">
                <span className="text-[10px] font-bold uppercase text-gray-500">Interactive Controls</span>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={handleRunSimulation}
                    className="w-full py-2 bg-red-650 hover:bg-red-600 text-white text-xs font-bold rounded-lg transition shadow"
                  >
                    Quick Simulation Run
                  </button>
                  <button
                    onClick={handleUploadCode}
                    className="w-full py-2 bg-[#1f2937] hover:bg-gray-850 text-gray-300 hover:text-white text-xs font-bold rounded-lg border border-gray-800 transition"
                  >
                    Hardware COM3 Upload
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* ─── DEFAULT WORKS MODAL PANEL ─── */}
      <AnimatePresence>
        {isDefaultWorksOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.75 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDefaultWorksOpen(false)}
              className="absolute inset-0 bg-black z-40"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 24 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="absolute inset-4 md:inset-10 lg:inset-16 bg-[#070707] border border-gray-800 rounded-2xl z-50 flex flex-col overflow-hidden shadow-[0_40px_120px_rgba(0,0,0,0.95)]"
            >
              {/* Modal Header */}
              <div className="flex-shrink-0 h-16 border-b border-gray-800 flex items-center justify-between px-6 bg-black/60 backdrop-blur">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-600 to-orange-600 flex items-center justify-center text-lg shadow-[0_0_12px_rgba(220,38,38,0.4)]">
                    ⚡
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-white tracking-wide">Default Works</h2>
                    <p className="text-[10px] text-gray-500">Ready-made projects — open, learn & run instantly</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsDefaultWorksOpen(false)}
                  className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 flex items-center justify-center text-gray-400 hover:text-white transition text-xs"
                >✕</button>
              </div>

              {/* Hero Banner */}
              <div className="flex-shrink-0 px-6 py-4 bg-gradient-to-r from-red-950/40 via-black to-orange-950/20 border-b border-gray-800/60">
                <p className="text-xs text-gray-400 leading-relaxed max-w-3xl">
                  🎓 Each project below is <strong className="text-white">fully wired</strong>, has <strong className="text-white">working Arduino code</strong>, and simulates <strong className="text-white">real-life hardware behavior</strong> — LED glows, buzzer beeps, fan rotates, and sensors respond. 
                  <span className="text-red-400 ml-1">Click any card to instantly load it onto your canvas.</span>
                </p>
              </div>

              {/* Projects Grid */}
              <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {DEMO_PROJECTS.map((project) => {
                    const isActive = selectedDemoId === project.id
                    const difficultyColor = {
                      Beginner:     "bg-emerald-900/60 text-emerald-400 border-emerald-800",
                      Intermediate: "bg-amber-900/60  text-amber-400  border-amber-800",
                      Advanced:     "bg-red-900/60    text-red-400    border-red-800",
                    }[project.difficulty]

                    return (
                      <div
                        key={project.id}
                        className={`group relative flex flex-col bg-gray-950 border rounded-xl overflow-hidden cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:shadow-[0_8px_30px_rgba(0,0,0,0.6)] ${
                          isActive
                            ? "border-red-500 shadow-[0_0_20px_rgba(220,38,38,0.3)]"
                            : "border-gray-800 hover:border-red-600/50"
                        }`}
                        onClick={() => handleLoadDemoProject(project)}
                      >
                        {/* Card Top Color Bar */}
                        <div className="h-1 w-full bg-gradient-to-r from-red-600 to-orange-500 opacity-60 group-hover:opacity-100 transition-opacity" />

                        {/* Card Header */}
                        <div className="p-4 flex items-start gap-3">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 flex items-center justify-center text-2xl flex-shrink-0 group-hover:border-red-700/50 transition-colors shadow">
                            {project.emoji}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-bold text-white leading-tight mb-1">{project.title}</h3>
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className={`text-[8.5px] font-bold px-1.5 py-0.5 rounded border uppercase tracking-wider ${difficultyColor}`}>
                                {project.difficulty}
                              </span>
                              <span className="text-[8.5px] text-gray-500 font-mono bg-gray-900 border border-gray-800 px-1.5 py-0.5 rounded">
                                {project.category}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Description */}
                        <div className="px-4 pb-3">
                          <p className="text-[10.5px] text-gray-400 leading-relaxed">{project.description}</p>
                        </div>

                        {/* Expected Behaviors */}
                        <div className="px-4 pb-3 flex-1">
                          <p className="text-[8.5px] uppercase font-bold text-gray-600 tracking-wider mb-1.5">What it does:</p>
                          <ul className="space-y-1">
                            {project.expectedBehaviors.map((b, i) => (
                              <li key={i} className="text-[10px] text-gray-400 font-mono leading-tight">{b}</li>
                            ))}
                          </ul>
                        </div>

                        {/* Component Count */}
                        <div className="px-4 py-2 border-t border-gray-800 flex items-center justify-between">
                          <span className="text-[9px] text-gray-600 font-mono">
                            📦 {project.components.length} parts &nbsp;·&nbsp; 🔌 {project.connections.length} wires
                          </span>
                          <div className="flex items-center gap-1 text-[9px] font-bold text-gray-500 group-hover:text-red-400 transition-colors">
                            <Play className="w-2.5 h-2.5" />
                            Load
                          </div>
                        </div>

                        {/* Active Indicator */}
                        {isActive && (
                          <div className="absolute top-2 right-2 w-5 h-5 bg-red-600 rounded-full flex items-center justify-center text-white text-[8px] shadow-[0_0_8px_#ef4444]">
                            ✓
                          </div>
                        )}

                        {/* Hover Overlay CTA */}
                        <div className="absolute inset-0 bg-red-600/0 group-hover:bg-red-600/5 transition-colors pointer-events-none rounded-xl" />
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex-shrink-0 border-t border-gray-800 px-6 py-3 flex items-center justify-between bg-black/40">
                <p className="text-[10px] text-gray-600">
                  ✏️ After loading, you can edit the code and wiring freely. Changes are auto-saved locally.
                </p>
                <button
                  onClick={() => setIsDefaultWorksOpen(false)}
                  className="px-4 py-1.5 bg-gray-900 hover:bg-gray-800 border border-gray-700 text-xs text-gray-400 hover:text-white rounded-lg transition font-bold"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ─── SIDEBAR AI TUTOR DRAWER PANEL ─── */}
      <AnimatePresence>
        {isAIDrawerOpen && (
          <>
            {/* Backdrop click closer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAIDrawerOpen(false)}
              className="absolute inset-0 bg-black z-40"
            />

            {/* Side Drawer Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className={`absolute right-0 top-0 bottom-0 w-[420px] max-w-full border-l z-50 flex flex-col h-full shadow-2xl transition-colors ${
                isNightMode === false ? "bg-white border-gray-200 text-gray-800" : "bg-[#090909] border-gray-800 text-white"
              }`}
            >
              {/* Drawer Header */}
              <div className="h-16 border-b border-gray-850 flex items-center justify-between px-6 flex-shrink-0">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-red-500 animate-pulse" />
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-red-500">AI Circuit Assistant</h3>
                    <p className="text-[9px] text-gray-500">Roboflix Engineering Lab Tutor</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsAIDrawerOpen(false)}
                  className="w-7 h-7 bg-white/5 hover:bg-white/10 rounded-full flex items-center justify-center text-xs transition text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              {/* Chat Log History Container */}
              <div 
                ref={chatScrollRef}
                className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar bg-black/5"
              >
                {chatMessages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed shadow-sm font-sans ${
                      msg.sender === "user"
                        ? "bg-red-650 text-white rounded-tr-none"
                        : isNightMode === false
                          ? "bg-gray-100 border border-gray-250 text-gray-800 rounded-tl-none"
                          : "bg-gray-900 border border-gray-850 text-gray-250 rounded-tl-none"
                    }`}>
                      {msg.text.split("\n").map((para, pidx) => (
                        <p key={pidx} className={pidx > 0 ? "mt-1.5" : ""}>{para}</p>
                      ))}
                    </div>
                  </div>
                ))}

                {isChatTyping && (
                  <div className="flex justify-start">
                    <div className="bg-gray-900 border border-gray-850 text-gray-400 rounded-2xl rounded-tl-none p-3.5 text-xs flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" />
                      <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                      <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce [animation-delay:0.4s]" />
                    </div>
                  </div>
                )}
              </div>

              {/* Quick Prompt Recommendation Pills */}
              <div className="p-3 border-t border-gray-850/60 bg-black/10">
                <p className="text-[8.5px] uppercase font-bold text-gray-500 tracking-wider mb-2 font-mono">Quick Assist Prompts:</p>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    "🔍 Check my wiring",
                    "💡 How to wire LDR",
                    "⚙️ Explain Stepper Motor"
                  ].map((pText) => (
                    <button
                      key={pText}
                      onClick={() => handleQuickPrompt(pText)}
                      className={`px-2.5 py-1 text-[10px] font-semibold rounded-full border transition cursor-pointer ${
                        isNightMode === false 
                          ? "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100" 
                          : "bg-gray-900 border-gray-850 text-gray-300 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      {pText}
                    </button>
                  ))}
                </div>
              </div>

              {/* Chat Input Bar */}
              <div className={`p-4 border-t flex items-center gap-2 flex-shrink-0 ${
                isNightMode === false ? "bg-white border-gray-200" : "bg-[#0d0d0d] border-gray-850"
              }`}>
                <input
                  type="text"
                  placeholder="Ask a question about wiring, code, or sensors..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSendChatMessage()
                  }}
                  className={`flex-1 px-4 py-2 border rounded-xl text-xs focus:outline-none focus:border-red-650 transition ${
                    isNightMode === false 
                      ? "bg-gray-50 border-gray-200 text-gray-800 placeholder-gray-500" 
                      : "bg-gray-950 border-gray-850 text-white placeholder-gray-600"
                  }`}
                />
                <button
                  onClick={handleSendChatMessage}
                  className="p-2 bg-red-600 hover:bg-red-500 text-white rounded-xl transition"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>

            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Code Uploading Progress HUD Overlay */}
      <AnimatePresence>
        {isUploading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center select-none"
          >
            <div className="max-w-md w-full mx-4 p-8 bg-gray-900/90 border border-red-650/40 rounded-2xl shadow-[0_30px_70px_rgba(0,0,0,0.95)] text-center space-y-6">
              <div className="w-16 h-16 bg-red-650/10 border border-red-500/20 rounded-full flex items-center justify-center mx-auto text-red-550 animate-pulse shadow-[0_0_15px_rgba(220,38,38,0.2)]">
                <Cpu className="w-8 h-8" />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-white font-sans uppercase tracking-wider">
                  Uploading Sketch to Board
                </h3>
                <p className="text-[11px] font-mono text-gray-400 h-10 flex items-center justify-center leading-relaxed">
                  {uploadStepText}
                </p>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden border border-white/5 p-0.5">
                  <motion.div
                    style={{ width: `${uploadProgress}%` }}
                    className="h-full bg-red-600 rounded-full shadow-[0_0_8px_#E50914]"
                    transition={{ ease: "easeInOut" }}
                  />
                </div>
                <div className="flex justify-between text-[10px] font-mono text-gray-500 font-bold">
                  <span>Virtual COM3</span>
                  <span>{uploadProgress}%</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
