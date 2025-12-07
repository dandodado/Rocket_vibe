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



