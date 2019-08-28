export const albumSort = albums => {
	return Object.values(albums).sort(
		(a, b) =>
			//remove dashes from dates and sort by number
			b.release_date.replace(/-/g, "") - a.release_date.replace(/-/g, "")
	);
};
