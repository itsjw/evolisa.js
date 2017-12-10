let config = {"drawing": {"AddPolygonMutationRate": 700,
                           "RemovePolygonMutationRate": 1500,
                           "PolygonsMin": 1,
                           "PolygonsMax": 255,
                           "PointsMin": 3,
                           "PointsMax": 255
                          },
              "polygon": {"AddPointMutationRate": 1500,
                          "MovePointMutationRate": 1500,
                          "RemovePointMutationRate": 1500,
                          "PointsPerPolygonMin": 3,
                          "PointsPerPolygonMax": 10
                         },
              "point": {"MovePointMutationRate": 1500,
                        "MovePointMinMutationRate": 1500,
                        "MovePointMidMutationRate": 1500,
                        "MovePointMaxMutationRate": 1500,
                        "MovePointRangeMin": 3,
                        "MovePointRangeMid": 20
                       },
              "brush": {"AlphaMutationRate": 1500,
                        "AlphaRangeMin": 30,
                        "AlphaRangeMax":  60,
                        "RedMutationRate": 1500,
                        "RedRangeMin": 0,
                        "RedRangeMax": 255,
                        "GreenMutationRate": 1500,
                        "GreenRangeMin": 0,
                        "GreenRangeMax": 255,
                        "BlueMutationRate": 1500,
                        "BlueRangeMin": 0,
                        "BlueRangeMax": 255
                       }
             };

var img, imgGraphic, drawing, drawingGraphic, drawingDna;

let minError;
let generation;
let selected;

let runButton;

var isRunning = false;

function preload() {
  img = loadImage("assets/mona_lisa_129x192.jpg");
}

function setup() {
  let cnvs = createCanvas(img.width*2, img.height);
  cnvs.parent('p5js');
  background(220);
  image(img, 0, 0);

  /* Load image and buffer */
  initEnvironment(img);
  
  /* GUI */
  initGui();
}

function draw() {
  if (isRunning) {
    evolve();
  }
  /* Autosave every 1000 selections
  if (selected != 0 && selected % 1000 == 0) {
    saveCanvas(drawingGraphic, `autosave_evolisa_${selected}.png`);
  }
  */
}

function initEnvironment(img) {
  generation = 0;
  selected = 0;
  minError = Number.MAX_SAFE_INTEGER;

  imgGraphic = createGraphics(img.width, img.height);
  imgGraphic.image(img, 0, 0);
  imgGraphic.loadPixels();
  imgGraphic.remove();

  drawingGraphic = createGraphics(img.width, img.height);
  drawingGraphic.background(220);
  drawingGraphic.loadPixels();
  drawingGraphic.remove();

  drawingDna = new DnaDrawing(config);
  drawingDna.init();  
}

function initGui() {
  let controls = createDiv('');
  controls.addClass('field');
  controls.addClass('is-grouped');
  controls.parent('p5js');

  /* Save button */
  let saveButtonDiv = createDiv('');
  let saveButton = createButton('Save');
  saveButton.mousePressed(() => {
    saveCanvas(drawingGraphic, `evolisa_${selected}.png`);
  });
  saveButton.addClass('button');
  saveButton.addClass('is-primary');
  saveButtonDiv.addClass('control');
  saveButtonDiv.child(saveButton);

  /* Run button */
  let runButtonDiv = createDiv('');
  runButton = createButton('Run');
  runButton.mousePressed(() => {
    isRunning  = !isRunning;
    runButton.elt.innerText = isRunning ? "Pause" : "Continue";
    if (isRunning) {
      uploadButton.attribute("disabled", '');
      saveButton.attribute("disabled", '');
    } else {
      uploadButton.removeAttribute('disabled');
      saveButton.removeAttribute('disabled');
    }
  });
  runButton.addClass('button');
  runButton.addClass('is-primary');
  runButtonDiv.addClass('control');
  runButtonDiv.child(runButton);

  /* file upload button */
  let fileButtonDiv = createDiv('');
  fileButtonDiv.addClass('control file');

  let label = createElement('label');
  label.addClass('file-label')
  
  let uploadButton = createFileInput(handleFile);
  uploadButton.addClass('file-input');

  let span = createElement('span', 'Upload file');
  span.addClass('file-cta');
  span.addClass('file-label');

  fileButtonDiv.child(label);
  label.child(uploadButton);
  label.child(span);

  controls.child(runButtonDiv);
  controls.child(saveButtonDiv);
  controls.child(fileButtonDiv);
}

function evolve() {
  let newDrawing = drawingDna.clone();
  while (!newDrawing.dirty) {
    newDrawing.mutate();
  }
  generation += 1;

  newDrawing.render(drawingGraphic);
  error = fitness(imgGraphic, drawingGraphic);
  if (error < minError) {
    minError = error;
    selected += 1;
    image(drawingGraphic, img.width, 0);
    drawingDna = newDrawing;
    /*
    console.info(`Polygons: ${dr.polygons.length},\
       Points: ${dr.totalPoints},\
       Error: ${minError},\
       Generation: ${generation},\
       Selected: ${selected}`);
    */
  }
}

/* UTILS */
function willMutate(mutationRate) {
  return getRandomInt(0, mutationRate) == 1;
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

function fitness(template, drawing) {
  // template.loadPixels() get called once during the init. The template never changes.
  drawing.loadPixels();

  let error = 0.0;
  let d = pixelDensity();
  let imgSize = 4 * (template.width * d) * (template.height * d);
  for (let i = 0; i < imgSize; i+=4) {
    r = template.pixels[i] - drawing.pixels[i];
    g = template.pixels[i+1] - drawing.pixels[i+1];
    b = template.pixels[i+2] - drawing.pixels[i+2];
    a = template.pixels[i+3] - drawing.pixels[i+3];
    e = r*r + g*g + b*b + a*a;
    //Alternative error functions
    //e = sqrt(r*r + g*g + b*b + a*a);
    //e = abs(r) + abs(g) + abs(b) + abs(a);
    error += e;
  }
  return error;
}

/* GUI */
function handleFile(file) {
  if (file.type === 'image') {
    loadImage(file.data, loadedImg => {
      img = loadedImg;
      if (img.width > 0 && img.width <= 200 && img.height > 0 && img.height <= 200) {
        resizeCanvas(img.width*2, img.height);
        background(220);
        image(img, 0, 0);
        initEnvironment(img);
        runButton.elt.innerText = "Run";
      }
    });
  }
}