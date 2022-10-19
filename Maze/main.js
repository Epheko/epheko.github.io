//https://qiita.com/yk-nakamura/items/2ea2e9f5399a9d930a6b

let tds;
//イベントリスナ追加
$("button").click(() => {
	let mazeSize = $("#count").val();
	$("#form").remove();
	$("body").css("padding-top", "0px");

	//tableで地図を作る
	tds = [[]];
	tds.pop();//空にする
	$("#map").css("display", "block");
	let table = document.createElement("table");
	$("#map").append(table);
	for (let x = 0; x < mazeSize; x++) {
		let tdRow = [];
		let r = document.createElement("tr");
		let hei = x % 2 == 0 ? "2px" : "5px";
		r.setAttribute("height", hei);
		for (let y = 0; y < mazeSize; y++) {
			let d = document.createElement("td");
			let wid = y % 2 == 0 ? "2px" : "5px";
			d.setAttribute("width", wid);
			d.setAttribute("height", hei);
			tdRow.push(d);
			r.appendChild(d);
		}
		table.appendChild(r);
		tds.push(tdRow);
	}
	$("td").attr("bgcolor", "#888888");

	GenMaze(mazeSize);
	Display(mazeSize);
});

let mazeMap;
//棒倒し法で迷路を作る
function GenMaze(size) {
	mazeMap = [[]];
	mazeMap.pop();
	for (let x = 0; x < size; x++) {
		let tmpArr = [];
		for (let y = 0; y < size; y++) {
			if (x * y == 0 || (x - size + 1) * (y - size + 1) == 0) {
				tmpArr.push(1);
			} else {
				tmpArr.push(0);
			}
		}
		mazeMap.push(tmpArr);
	}

	//棒を倒す
	for (let x = 2; x < size - 2; x++) {
		for (let y = 2; y < size - 2; y++) {
			if ((x * y % 2) == 0 && (x + y) % 2 == 0) {
				//棒中心
				mazeMap[x][y] = 1;
				//倒す方向を決める
				let dirX = 0;
				let dirY = 0;
				while (mazeMap[x + dirX][y + dirY] == 1) {
					let angle = Math.random() * ((x == 2) ? 4 : 3);
					angle = Math.floor(angle) + 2;
					dirX = Math.round(Math.cos(angle * Math.PI * 0.5));
					dirY = -Math.round(Math.sin(angle * Math.PI * 0.5));
					//倒す
				}
				mazeMap[x + dirX][y + dirY] = 1;
			}
		}
	}
	//ランダムにゴールを決める
	let gx = 0;
	let gz = 0;
	let flg = 0;
	while (flg == 0) {
		gx = Math.round(Math.random() * (size - 3)) + 2;
		gz = Math.round(Math.random() * (size - 3)) + 2;
		if (mazeMap[gx][gz] == 0) {
			let kabeNum = mazeMap[gx + 1][gz] + mazeMap[gx - 1][gz] + mazeMap[gx][gz + 1] + mazeMap[gx][gz - 1];
			if (kabeNum == 3) { flg = 1; }
		}
	}
	mazeMap[gx][gz] = 2;

	for (let x = 0; x < size; x++) {
		console.debug(mazeMap[x]);
	}
	console.debug(gx + "," + gz);

}

let pilSize = 5;//柱の四方サイズ
let walLen = 20;//壁の長さ
let posSpan = 0;
let plPosX = 1;
let plPosZ = 1;
let foward = 0;
let goal;

function Display(size) {
	// Three.jsを初期化
	var renderer = new THREE.WebGLRenderer();
	// 描画領域のサイズは縦横とも320ピクセル
	renderer.setSize(document.documentElement.clientWidth, document.documentElement.clientHeight);
	// Three.jsによって生成されたCanvasをページの末尾に追加
	document.body.appendChild(renderer.domElement);

	// シーンを初期化する
	var scene = new THREE.Scene();
	//フォグを追加
	scene.fog = new THREE.Fog(0x000000, 60, 200);

	posSpan = (walLen + pilSize) / 2;
	for (let x = 0; x < size; x++) {
		for (let z = 0; z < size; z++) {
			//柱生成
			if (mazeMap[x][z] == 1) {
				if ((x * z % 2) == 0 && (x + z) % 2 == 0) {
					GenerateWall(pilSize, 14, pilSize, x * posSpan, 0, z * posSpan, scene);
				} else if (x % 2 == 0) {//壁1
					GenerateWall(pilSize - 1, 10, walLen, x * posSpan, 0, z * posSpan, scene);
				} else if (z % 2 == 0) {//壁2
					GenerateWall(walLen, 10, pilSize - 1, x * posSpan, 0, z * posSpan, scene);
				}
			} else if (mazeMap[x][z] == 2) {
				console.debug("ごーーーーーるのねたばれ" + x + "," + z);
				goal = new THREE.Mesh(
					// 立方体のXYZサイズを設定
					new THREE.CubeGeometry(2, 2, 2),
					// マテリアルをLambertに
					new THREE.MeshLambertMaterial({ color: 0xffff00 })
				);
				goal.position.set(posSpan * x, 0, posSpan * z);
				scene.add(goal);
			}
		}
	}

	var plane = new THREE.Mesh(
		// 平面のサイズを設定
		new THREE.PlaneGeometry(posSpan * size, posSpan * size),
		// マテリアルをLambertに
		new THREE.MeshLambertMaterial({ transparent: true, opacity: 1, color: 0xcccccc })
	);
	plane.position.set(posSpan * size / 2, -5, posSpan * size / 2);
	scene.add(plane);


	// カメラを初期化
	var camera = new THREE.PerspectiveCamera(40, document.documentElement.clientWidth / document.documentElement.clientHeight, 1, 10000);//第二引数はアス比？
	// カメラ位置を設定
	scene.position.set(0, 0, 0);
	// カメラを3Dシーンに追加
	scene.add(camera);

	//初期向き調整　目の前壁から始まらないようにね
	for (let a = 0; a < 4; a++) {

		let difX = Math.round(Math.cos(foward * Math.PI * 0.5));
		let difZ = Math.round(Math.sin(foward * Math.PI * 0.5));
		if (mazeMap[plPosX + difX][plPosZ + difZ] == 0) {
			break;
		}
		foward++;
	}

	// 光源を追加
	var light = new THREE.DirectionalLight(0xffffff, 1.25);
	var light2 = new THREE.DirectionalLight(0xffffff, 1.25);
	// 光源の位置を設定
	light.position.set(200, 260, 100);
	light2.position.set(-200, 260, -100);
	scene.add(light);
	scene.add(light2);

	//アンビエントライト
	var ambientLight = new THREE.AmbientLight(0x555555); // 光源色を指定して生成
	scene.add(ambientLight); // シーンに追加

	function move(e) {
		//地図上の今いる場所(動く前)を白にマーク
		tds[plPosX][plPosZ].setAttribute("bgcolor", "#ffffff");

		let difX = Math.round(Math.cos(foward * Math.PI * 0.5));
		let difZ = Math.round(Math.sin(foward * Math.PI * 0.5));
		if (e.key == 'w') {
			if (mazeMap[plPosX + difX][plPosZ + difZ] == 0) {
				plPosX += 2 * difX;
				plPosZ += 2 * difZ;
			}
		}
		if (e.key == 's') {
			if (mazeMap[plPosX - difX][plPosZ - difZ] == 0) {
				plPosX -= 2 * difX;
				plPosZ -= 2 * difZ;
			}
		}
		if (e.key == 'a') {
			foward = (foward + 3) % 4;
		}
		if (e.key == 'd') {
			foward = (foward + 1) % 4;
		}
		//マップ表示の更新
		for (let x = -1; x < 2; x++) {
			for (let z = -1; z < 2; z++) {
				let col = "#888888";
				if (mazeMap[plPosX + x][plPosZ + z] == 0) {
					col = "#ffffff"
				} else {
					col = "#000000"
				}
				tds[plPosX + x][plPosZ + z].setAttribute("bgcolor", col);
			}
		}
		//地図上の今いる場所を赤にマーク
		tds[plPosX][plPosZ].setAttribute("bgcolor", "#ff0000");
		if (mazeMap[plPosX][plPosZ] == 2) {
			let timerId = setInterval(function () {
				alert("ゴール！");
				clearInterval(timerId);
			}, 100);
		}
	}


	//アニメーション
	function render() {
		goal.rotation.x += 0.01;
		goal.rotation.y += 0.1;
		goal.rotation.z += 0.05;
		camera.position.set(plPosX * posSpan, -2, plPosZ * posSpan);
		camera.lookAt(new THREE.Vector3(plPosX * posSpan + Math.cos(foward * Math.PI * 0.5), camera.position.y, plPosZ * posSpan + Math.sin(foward * Math.PI * 0.5)));
		requestAnimationFrame(render);
		renderer.render(scene, camera);
	}

	// レンダリング
	document.addEventListener('keydown', move);
	move("");//一回地図表示する
	render();

	let timerId = setInterval(function () {
		alert("W,Sで前進後退 \nA,Dで90度回転\n左上にマップもあるよ！");
		clearInterval(timerId);
	}, 10);
}

function GenerateWall(sx, sy, sz, px, py, pz, scene) {
	// オブジェクトを初期化する
	var cube = new THREE.Mesh(
		// 立方体のXYZサイズを設定
		new THREE.CubeGeometry(sx, sy, sz),
		// マテリアルをLambertに
		new THREE.MeshLambertMaterial({ color: 0xaaaaaa })
	);
	cube.position.set(px, py, pz);
	scene.add(cube);
}