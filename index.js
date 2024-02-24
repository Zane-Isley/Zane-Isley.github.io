const BAUD_RATE = 9600;                               // This should match the baud rate in your Arduino sketch
let lastX = 0;                                        // Creates variable used to record previos x value
let lastY = 0;                                        // Creates variable used to record previous y value
let port, connectBtn;                                 // Declare global variables

function setup() {
  setupSerial();                                      // Run our serial setup function (below)

  // Create a canvas that is the size of our browser window.
  // windowWidth and windowHeight are p5 variables
  createCanvas(windowWidth, windowHeight);
  drawSketch();                                       // Calls function used to create the Etch a Sketch
  let button = createButton('RESET');                 // Creates "reset" button (object)
  button.position(windowWidth/2, windowHeight*.82);   // Places button center and bottom of screen
  button.mousePressed(() => {                         // Opens when button is pressed
    drawSketch();                                     // Calls function used to create the Etch a Sketch
    port.write(42);                                   // Writes to arduino (to turn on LED)
  });
}

function draw() {
  stroke(60, 65, 66);                                 // Sets stroke color charcoal gray
  const portIsOpen = checkPort();                     // Check whether the port is open (see checkPort function below)
  if (!portIsOpen) return;                            // If the port is not open, exit the draw loop

  let str = port.readUntil("\n");                     // Read from the port until the newline
  if (str.length == 0) return;                        // If we didn't read anything, return.

  let arr = str.trim().split(",");                    // Trim whitespace and split on commas

  // Convert each element to a number and map it to the desired range
  let x = map(Number(arr[0]), 512, 1023, windowWidth*.5, windowWidth*.75);
  let y = map(Number(arr[1]), 512, 1023, windowHeight*.5, windowHeight*.77);

  console.log(lastX);                                 // Tracks lastX (used for debuging)
  if (lastX == 0) {                                   // Checks previous X value
    lastX = x;                                        // Sets lastX = X
    lastY = y;                                        // Sets lastY = Y
  } else {
    line(lastX, lastY, x, y);                         // Draws line using previous and current X/Y values
    lastX = x;                                        // Sets lastX = X
    lastY = y;                                        // Sets lastY = Y
  }
}

// Function used to create "Etch a Sketch" background
function drawSketch() {
  background(220);                                    // Creates background
  fill(212,8,2);                                      // Sets fill color to red
  noStroke();                                         // Removes stroke
  rectMode(CENTER);                                   // Makes rectangles be place by the middle
  rect(windowWidth/2, windowHeight/2, windowWidth*.7,windowHeight*.8);          // Draws etch a sketch
  fill(226,226,226);                                                            // Sets fill color light gray
  rect(windowWidth/2, windowHeight/2, windowWidth*.5, windowHeight*.55, 20);    // Draws etch a sketch screen
  fill('white');                                      // Sets fill color to white
  circle(windowWidth/5, windowHeight*.82, 80);        // Draws left drawing knob
  circle(windowWidth*.8, windowHeight*.82, 80);       // Draws right drawing knob
  textAlign(CENTER);                                  // Aligns text to center
  textFont('Brush Script MT');                        // Sets text font
  fill(217,172,108);                                  // Sets fill color to gold
  textSize(50);                                       // Sets Text size
  text("~   Etch A Sketch   ~", windowWidth/2, windowHeight/5.5)                // Writes "etch a Sketch" on screen
}

// Three helper functions for managing the serial connection.

function setupSerial() {
  port = createSerial();

  // Check to see if there are any ports we have used previously
  let usedPorts = usedSerialPorts();
  if (usedPorts.length > 0) {
    // If there are ports we've used, open the first one
    port.open(usedPorts[0], BAUD_RATE);
  }

  // create a connect button
  connectBtn = createButton("Connect to Arduino");
  connectBtn.position(5, 5); // Position the button in the top left of the screen.
  connectBtn.mouseClicked(onConnectButtonClicked); // When the button is clicked, run the onConnectButtonClicked function
}

function checkPort() {
  if (!port.opened()) {
    // If the port is not open, change button text
    connectBtn.html("Connect to Arduino");
    // Set background to gray
    background("gray");
    return false;
  } else {
    // Otherwise we are connected
    connectBtn.html("Disconnect");

    return true;
  }
}

function onConnectButtonClicked() {
  // When the connect button is clicked
  if (!port.opened()) {
    // If the port is not opened, we open it
    port.open(BAUD_RATE);
  } else {
    // Otherwise, we close it!
    port.close();
  }
}