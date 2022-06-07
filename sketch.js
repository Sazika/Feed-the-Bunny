const Engine = Matter.Engine;
const Render = Matter.Render;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;
const Body = Matter.Body;
const Composites = Matter.Composites;
const Composite = Matter.Composite;

let engine;
let world;
var ground;
var fruit
var rope, rope2, rope3;
var fruit_con, fruit_con2, fruit_con3;
var bg_img;
var melon_img;
var rabbit_img, rabbit;
var button, button2, button3;
var blink,eat,sad;
var air, eatingSound, cutSound, sadSound, bgSound;
var blower;
var mute;



function preload(){
  bg_img = loadImage("background.png")
  melon_img = loadImage("melon.png")
  rabbit_img = loadImage("Rabbit-01.png")

  blink = loadAnimation("blink_1.png","blink_2.png","blink_3.png")
  eat = loadAnimation("eat_0.png","eat_1.png","eat_2.png","eat_3.png","eat_4.png")
  sad = loadAnimation("sad_1.png","sad_2.png","sad_3.png")

  air = loadSound('air.wav');
  eatingSound = loadSound('eating_sound.mp3');
  cutSound = loadSound('rope_cut.mp3');
  sadSound = loadSound('sad.wav');
  bgSound = loadSound('sound1.mp3')

  blink.playing = true;
  eat.playing = true;
  sad.playing = true
  eat.looping = false
  sad.looping = false
}

function setup() 
{
  var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
  if(isMobile){
    canW = displayWidth
    canH = displayHeight
    createCanvas(displayWidth, displayHeight)
  }
  else{
    createCanvas(windowWidth,windowHeight);
  }

  frameRate(80);

  bgSound.play();
  bgSound.setVolume(0.25);

  blink.frameDelay = 10
  eat.frameDelay = 20
  sad.frameDelay = 20

  engine = Engine.create();
  world = engine.world;

  ground = new Ground(width/2,height+50,width,150);

  rabbit = createSprite(width/2,height-100)
  rabbit.scale = 0.3
  
  rabbit.addAnimation("Blink",blink)
  rabbit.addAnimation("Eat",eat)
  rabbit.addAnimation("Sad",sad)

  rabbit.changeAnimation("Blink")

  rope = new Rope(7,{x:width/2+20,y:30});
  rope2 = new Rope(10,{x:width/3+20,y:30});
  rope3 = new Rope(5,{x:width/2+270,y:200});

  fruit = Bodies.circle(width/2,300,20);
  Matter.Composite.add(rope.body,fruit);

  fruit_con = new Link(rope,fruit);
  fruit_con2 = new Link(rope2,fruit);
  fruit_con3 = new Link(rope3,fruit);

  button = createImg("cut_button.png")
  button.position(width/2,30)
  button.size(70,70)
  button.mouseClicked(drop)

  button2 = createImg("cut_button.png")
  button2.position(width/3,30)
  button2.size(70,70)
  button2.mouseClicked(drop2)

  button3 = createImg("cut_button.png")
  button3.position(width/2+250,200)
  button3.size(70,70)
  button3.mouseClicked(drop3)

  rectMode(CENTER);
  ellipseMode(RADIUS);
  textSize(50)

  blower = createImg('balloon.png');
  blower.position(130,200);
  blower.size(250,150);
  blower.mouseClicked(blow);

  mute = createImg('mute.png');
  mute.position(width - 110,30);
  mute.size(70,70);
  mute.mouseClicked(muteGame);
  
}

function draw() 
{
  background(bg_img);

  rope.show();
  if(fruit!=null){
    imageMode(CENTER)
    image(melon_img,fruit.position.x,fruit.position.y,150,150);
  }
  ground.show();
  
  if(collide(fruit,rabbit)===true){
    rabbit.changeAnimation('Eat')
    eatingSound.play();
  }

  if(fruit!= null && fruit.position.y > height - 50){
    rabbit.changeAnimation('Sad')
    sadSound.play();
    bgSound.stop();
    fruit = null
  }
  rope2.show();
  rope3.show();
  
  drawSprites();
  Engine.update(engine);
  
   
}

function drop(){
  rope.break();
  fruit_con.detach();
  fruit_con = null
  cutSound.play();
}

function drop2(){
  rope2.break();
  fruit_con2.detach();
  fruit_con2 = null
  cutSound.play();
}

function drop3(){
  rope3.break();
  fruit_con3.detach();
  fruit_con3 = null
  cutSound.play();
}

function collide(body,sprite){
  if(body!=null){
    var d = dist(body.position.x,body.position.y,sprite.position.x,sprite.position.y)
    if(d<=60){
      World.remove(world,fruit)
      fruit = null
      return true
    }
    else{
      return false
    }
  }
}

function blow(){
  air.play();
  Matter.Body.applyForce(fruit,{x:0,y:0},{x:0.03,y:0})
}

function muteGame(){
  if(bgSound.isPlaying()){
    bgSound.stop()
  }
  else{
    bgSound.play();
  }
}