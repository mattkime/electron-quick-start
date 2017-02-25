let Rx = require('rxjs');

let startBtn = document.querySelector('#startBtn'),
	start = document.querySelector('#start'),
	end = document.querySelector('#end');

let fetch$ = url => Rx.Observable.fromPromise(fetch(url, { credentials: 'include'}));

let logOutput = content => {
		let node = document.createElement("div");
		node.append(content);
		document.querySelector('#output').append(node);
	};

let fetchCase$ = caseNumber =>
	fetch$(`https://www.lacourt.org/casesummary/ui/?CaseNumber=${caseNumber}`)
	.flatMap( res => Rx.Observable.fromPromise(res.text()))
	.map( html => html.indexOf('No match found for case number') == -1 )
	.map( exists => exists ? `exists - ${caseNumber}` : `xxxxxx - ${caseNumber}`)
	.do(logOutput)

startBtn
	.addEventListener('click', () => {
		fetchCase$('17B00001')
			.subscribe(console.log, null, () => console.log('done'));
})
