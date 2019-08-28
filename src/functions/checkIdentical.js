export function checkIdentical(a, b) {
	if (a.length !== b.length) return false;

	a.forEach(e => {
		if (a[e] !== b[e]) return false;
	});
	return true;
}
