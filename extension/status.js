function checkSubmitDone() {
	const lastResult = document.querySelector('#status-table > tbody > tr');
	const result = lastResult.querySelector(':nth-child(4)').innerText;
	return !(result.indexOf('채점') >= 0 || result.indexOf('기다리는 중') >= 0);
}
let loader;

function start() {
	if (checkSubmitDone()) {
		return;
	}
	loader = setInterval(async () => {
		if (checkSubmitDone()) {
			stop();
			const lastResult = document.querySelector('#status-table > tbody > tr');
			const submitNo = lastResult.querySelector(':nth-child(1)').innerText.trim();
			const userId = lastResult.querySelector(':nth-child(2)').innerText.trim();
			const problemNo = lastResult.querySelector(':nth-child(3)').innerText.trim();
			const result = lastResult.querySelector(':nth-child(4)').innerText.trim();
			const language = lastResult.querySelector(':nth-child(7)').innerText.split('/')[0].trim();
			const lang = languages[language];

			if (result.indexOf('맞았습니다') >= 0) {
				const code = await fetch(`https://www.acmicpc.net/source/download/${submitNo}`, {
					method: 'GET',
				}).then((res) => res.text());
				fetch('https://k7c202.p.ssafy.io/api/problem/submit', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						submitNo,
						userId,
						problemNo,
						code,
						lang,
					}),
				})
					.then((data) => data.json())
					.then((data) => console.log(data));

				fetch('https://k7c202.p.ssafy.io/node/problem/submit', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						submitNo,
						userId,
						problemNo,
						code,
						lang,
					}),
				})
					.then((data) => data.json())
					.then((data) => console.log(data));
			}
		}
	}, 500);
}
function stop() {
	clearInterval(loader);
	loader = null;
}

start();
