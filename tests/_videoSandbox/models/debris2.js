// Converted from: ./debris2.obj
//  vertices: 6
//  faces: 8
//  normals: 0
//  colors: 0
//  uvs: 6
//  materials: 0
//  edges: 0
//
//  Generated with OBJ -> Three.js converter
//  http://github.com/alteredq/three.js/blob/master/utils/exporters/convert_obj_three.py


var model = {

    "version" : 2,
    
    "materials": [	{
	"DbgColor" : 15658734,
	"DbgIndex" : 0,
	"DbgName" : "default"
	}],

    "vertices": [],
    
    "morphTargets": [],

    "morphColors": [],

    "normals": [],

    "colors": [],

    "uvs": [[0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000]],

    "faces": [],

    "edges" : []

};

var req = new XMLHttpRequest();
req.open('GET', "debris2.txt", false);
req.send(null);
if (req.status == 200 || req.status == 0) {
  var numVertices = 18;
  var numMorphTargets = model.morphTargets.length;
  var scale = 0.0078125;
  model.vertices = new Float32Array(numVertices);
  for (var j = 0; j < numMorphTargets; ++j) {
    model.morphTargets[j].vertices = new Float32Array(numVertices);
  }

  var untransposed = new Int16Array(numVertices);
  var transposeOffset = numVertices / 3;
  var prevX = 0, prevY = 0, prevZ = 0;
  for (var i = 0; i < transposeOffset; ++i) {
    var x = req.responseText.charCodeAt(i);
    x = (x >> 1) ^ (-(x & 1));
    prevX += x;
    untransposed[3*i] = prevX;
    var y = req.responseText.charCodeAt(transposeOffset + i);
    y = (y >> 1) ^ (-(y & 1));
    prevY += y;
    untransposed[3*i + 1] = prevY;
    var z = req.responseText.charCodeAt(2*transposeOffset + i);
    z = (z >> 1) ^ (-(z & 1));
    prevZ += z;
    untransposed[3*i + 2] = prevZ;
  }

  for (var i = 0; i < numVertices; ++i) {
    var word = untransposed[i];
    model.vertices[i] = scale * word;

    var prev = word;
    for (var j = 0; j < numMorphTargets; ++j) {
      var offset = (j + 1) * numVertices;
      var delta = req.responseText.charCodeAt(offset + i);
      delta = (delta >> 1) ^ (-(delta & 1));
      prev += delta;
      model.morphTargets[j].vertices[i] = scale * prev;
    }
  }
  var faceOffset = numVertices * (numMorphTargets + 1);
  var numFaces = 80;
  model.faces = new Uint16Array(numFaces);
  for (var i = 0; i < numFaces; ++i) {
    model.faces[i] = req.responseText.charCodeAt(faceOffset + i);
  }
}

postMessage( model );
close();
