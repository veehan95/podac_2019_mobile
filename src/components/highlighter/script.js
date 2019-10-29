export default {
  name: 'Higlighter',
  data() {
    return {
      highlight: false,
    }
  },
  methods: {
    draw_rect() {  },
  }
}




// //Canvas
// var canvas = document.getElementById('canvas');
// var ctx = canvas.getContext('2d');
// //Variables
// var canvasx = $(canvas).offset().left;
// var canvasy = $(canvas).offset().top;
// var last_mousex = last_mousey = 0;
// var mousex = mousey = 0;
// var mousedown = false;
//
// var record = []
//
// //Mousedown
// $(canvas).on('mousedown', function(e) {
//     last_mousex = parseInt(e.clientX-canvasx);
// 	last_mousey = parseInt(e.clientY-canvasy);
//   record = [{x: last_mousex,y:last_mousey}]
//     mousedown = true;
// });
//
// //Mouseup
// $(canvas).on('mouseup', function(e) {
//     mousedown = false;
// 		record.push({x: e.clientX-canvasx,y:e.clientY-canvasy})
//     console.log(record)
// });
//
// //Mousemove
// $(canvas).on('mousemove', function(e) {
//     mousex = parseInt(e.clientX-canvasx);
// 	mousey = parseInt(e.clientY-canvasy);
//     if(mousedown) {
//         ctx.clearRect(0,0,canvas.width,canvas.height); //clear canvas
//         ctx.beginPath();
//         var width = mousex-last_mousex;
//         var height = mousey-last_mousey;
//         ctx.rect(last_mousex,last_mousey,width,height);
//         ctx.strokeStyle = 'black';
//         ctx.lineWidth = 10;
//         ctx.stroke();
//     }
//     //Output
//     $('#output').html('current: '+mousex+', '+mousey+'<br/>last: '+last_mousex+', '+last_mousey+'<br/>mousedown: '+mousedown);
// });
