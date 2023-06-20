int maxSize = 128;
int minSize = 4;
float divineRatio = 0.7;//分割確率
float ratioDecrease = 0.15;//分割確率の減衰度
ArrayList<Rect> rects = new ArrayList<Rect>();

int dispType = 0;

void setup()
{
  size(512, 512);
  rectMode(CENTER);
  ReGenSquares();
}

void ReGenSquares()
{
  rects.clear();
  for (int x=0; x<width; x+=maxSize)
    for (int y=0; y<height; y+=maxSize)
    {
      GenSquare(x, y, maxSize, divineRatio);
    }
}

void GenSquare(int x, int y, int size, float ratio)
{
  if (size<=minSize || random(1.0)>ratio)
  {
    rects.add(new Rect(x+size/2, y+size/2, size));
  } else
  {
    GenSquare(x, y, size/2, ratio-ratioDecrease);
    GenSquare(x+size/2, y, size/2, ratio-ratioDecrease);
    GenSquare(x, y+size/2, size/2, ratio-ratioDecrease);
    GenSquare(x+size/2, y+size/2, size/2, ratio-ratioDecrease);
  }
}

void draw()
{
  background(0);
  for (Rect r : rects)
    r.disp();
}

void keyPressed()
{
  switch(keyCode)
  {
  case RIGHT: 
    dispType++;
    break;
  case LEFT : 
    dispType--;
    break;
  }
  if (key==' ')
  {
    ReGenSquares();
  }
}

class Rect
{
  float x, y;
  float rectSize;
  Rect(int _x, int _y, int _size)
  {
    x=_x;
    y=_y;
    rectSize=_size;
  }

  void disp()
  {
    switch(dispType)
    {
    case 1: 
      rotation1();
      break;
    case 2: 
      sizeWave();
      break;
    case 3: 
      tileOrder();
      break;
    case 4: 
      tileRotation();
      break;
    default: 
      NoEffect();
      break;
    }
  }

  void NoEffect()
  {
    rect(x, y, rectSize, rectSize);
  }

  void rotation1()
  {
    float sizeMag = (sin(atan2(y-height/2, x-width/2)+frameCount*0.02)+1)/2f;
    float size = rectSize* sizeMag;
    rect(x, y, size, size);
  }

  void sizeWave()
  {
    float size = rectSize * (sin((x+y+frameCount)*0.02f)+1)/2f;
    rect(x, y, size, size);
  }

  void tileOrder()
  {
    float col = width/maxSize;
    float row = height/maxSize;

    //0rderは0~1
    float order = (x/maxSize+floor(y/maxSize)*col)/col/row;
    float mag = max(0, (sin(-order*PI*2+frameCount*0.02f)-0.75)*4);
    float size = rectSize * mag;
    rect(x, y, size, size);
  }

  void tileRotation()
  {
    pushMatrix();
    float Rot =((x+y)*0.05+frameCount)*0.02f;
    translate(x, y);
    rotate(Rot);
    rect(0, 0, rectSize, rectSize);
    popMatrix();
  }
}
