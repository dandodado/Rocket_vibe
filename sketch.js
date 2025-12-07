let ship;
let particles = []; // 추진체 불꽃 입자 배열

function setup() {
  createCanvas(800, 600);
  ship = new Ship(width / 2, height / 2, 80, 40); // 우주선 객체 생성
}

function draw() {
  background(20, 20, 50); // 어두운 우주 배경

  // 키 입력에 따른 추진체 작동 및 힘 적용
  if (keyIsDown(LEFT_ARROW)) {
    ship.applyForceLeftThruster();
    particles.push(new Particle(ship.pos.x - ship.w / 2, ship.pos.y + ship.h / 2, -1)); // 왼쪽 추진체 불꽃 생성
  }
  if (keyIsDown(RIGHT_ARROW)) {
    ship.applyForceRightThruster();
    particles.push(new Particle(ship.pos.x + ship.w / 2, ship.pos.y + ship.h / 2, 1)); // 오른쪽 추진체 불꽃 생성
  }

  ship.update(); // 우주선 상태 업데이트
  ship.display(); // 우주선 그리기

  // 입자 업데이트 및 그리기
  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update();
    particles[i].display();
    if (particles[i].isFinished()) {
      particles.splice(i, 1); // 수명이 다한 입자 제거
    }
  }

  // 화면 경계 처리 (우주선이 화면 밖으로 나가지 않도록)
  if (ship.pos.x < 0) ship.pos.x = width;
  if (ship.pos.x > width) ship.pos.x = 0;
  if (ship.pos.y < 0) ship.pos.y = height;
  if (ship.pos.y > height) ship.pos.y = 0;
}

// 우주선 클래스
class Ship {
  constructor(x, y, w, h) {
    this.pos = createVector(x, y); // 위치
    this.vel = createVector(0, 0); // 속도
    this.acc = createVector(0, 0); // 가속도
    this.angle = 0; // 회전 각도
    this.angularVel = 0; // 각속도
    this.angularAcc = 0; // 각가속도
    this.w = w; // 너비
    this.h = h; // 높이
    this.thrusterForce = 0.1; // 추진체 힘 크기
    this.rotationForce = 0.005; // 회전 힘 크기
    this.maxSpeed = 5; // 최대 속도
    this.damping = 0.98; // 공기 저항 (마찰)
    this.angularDamping = 0.95; // 각운동 마찰
  }

  applyForce(force) {
    this.acc.add(force); // 힘을 가속도에 더함
  }

  applyTorque(torque) {
    this.angularAcc += torque; // 토크를 각가속도에 더함
  }

  // 왼쪽 추진체 작동
  applyForceLeftThruster() {
    let force = p5.Vector.fromAngle(this.angle - HALF_PI); // 우주선 방향으로 위로 향하는 힘
    force.mult(this.thrusterForce);
    this.applyForce(force);

    // 오른쪽으로 회전하는 토크 적용
    this.applyTorque(this.rotationForce);
  }

  // 오른쪽 추진체 작동
  applyForceRightThruster() {
    let force = p5.Vector.fromAngle(this.angle - HALF_PI); // 우주선 방향으로 위로 향하는 힘
    force.mult(this.thrusterForce);
    this.applyForce(force);

    // 왼쪽으로 회전하는 토크 적용
    this.applyTorque(-this.rotationForce);
  }

  update() {
    this.vel.add(this.acc); // 속도에 가속도 더함
    this.vel.mult(this.damping); // 속도 감쇠 (마찰)
    this.vel.limit(this.maxSpeed); // 속도 제한
    this.pos.add(this.vel); // 위치에 속도 더함

    this.angularVel += this.angularAcc; // 각속도에 각가속도 더함
    this.angularVel *= this.angularDamping; // 각속도 감쇠
    this.angle += this.angularVel; // 각도에 각속도 더함

    this.acc.mult(0); // 가속도 초기화
    this.angularAcc = 0; // 각가속도 초기화
  }

  display() {
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.angle);

    // 몸체 (사각형)
    rectMode(CENTER);
    fill(150, 150, 150);
    stroke(200);
    strokeWeight(2);
    rect(0, 0, this.w, this.h);

    // 왼쪽 추진체
    fill(100, 100, 100);
    rect(-this.w / 2 - 10, 0, 20, this.h / 1.5);
    triangle(
      -this.w / 2 - 10, -this.h / 3,
      -this.w / 2 - 10, this.h / 3,
      -this.w / 2 - 25, 0
    );

    // 오른쪽 추진체
    fill(100, 100, 100);
    rect(this.w / 2 + 10, 0, 20, this.h / 1.5);
    triangle(
      this.w / 2 + 10, -this.h / 3,
      this.w / 2 + 10, this.h / 3,
      this.w / 2 + 25, 0
    );

    // 조종석 또는 창문
    fill(50, 50, 100);
    ellipse(0, -this.h / 4, this.w / 3, this.h / 3);


    pop();
  }
}

// 추진체 불꽃 입자 클래스
class Particle {
  constructor(x, y, side) {
    this.pos = createVector(x, y);
    this.vel = createVector(random(-0.5, 0.5) * side, random(1, 3)); // 아래로 퍼지는 불꽃
    this.acc = createVector(0, 0.05); // 중력과 비슷한 아래 방향 가속도
    this.lifespan = 255; // 투명도로 수명 표현
    this.col = color(255, 100, 0, this.lifespan); // 주황색 불꽃
  }

  update() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.lifespan -= 5; // 수명 감소
    this.col = color(255, random(50, 150), 0, this.lifespan); // 색상 업데이트
  }

  display() {
    noStroke();
    fill(this.col);
    ellipse(this.pos.x, this.pos.y, random(4, 8), random(4, 8)); // 크기가 변하는 불꽃 입자
  }

  isFinished() {
    return this.lifespan < 0; // 수명이 다했는지 확인
  }
}