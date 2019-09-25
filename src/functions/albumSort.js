export const albumSort = albums => {
	return (
		Object.values(albums)
			.sort(
				(a, b) =>
					//sort by year
					Number(b.release_date.slice(0, 4)) -
					Number(a.release_date.slice(0, 4))
			)
			//sort by type
			.sort((a, b) => (a.album_type > b.album_type ? 1 : -1))
	);
};
