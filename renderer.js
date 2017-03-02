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
	.map( exists => exists ? `${caseNumber} - exists` : `${caseNumber} - x`)
	.do(logOutput)

let padZero = (string, len, c = 0) => {
	let s = string + ""
	while(s.length<len) s = "" + c + s;
	return s;
};

let fetchCases$ = (startNumber, endNumber) => {
	let prefix = startNumber.substring(0,3);
	let startCount = startNumber.substring(3);
	return fetchCase$(startNumber)
		.flatMap( res => Rx.Observable.if(
			() => startNumber == endNumber,
			Rx.Observable.of('done'),
			fetchCases$(prefix + padZero(++startCount,5), endNumber))
		);
}

startBtn
	.addEventListener('click', () => {
		if( start.value.substring(0,3) != end.value.substring(0,3)){
			alert('prefix of start and end ranges must match');
			return;
		}

		if( !end.value ||
			start.value == end.value ){
			fetchCase$(start.value)
				.subscribe(console.log, null, () => console.log('done'));
		} else {
			fetchCases$(start.value, end.value)
				.subscribe(console.log, null, () => console.log('done'));
		}
})
