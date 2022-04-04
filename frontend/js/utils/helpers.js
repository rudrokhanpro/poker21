export const createURL = (url, params) => {
	const newURL = new URL(url);

	Object.keys(params).map((key) => newURL.searchParams.set(key, params[key]));

	return newURL;
};

export const createRelativeURL = (url, params) => {
	const newURL = new URL(window.location.origin + url);

	Object.keys(params).map((key) => newURL.searchParams.set(key, params[key]));

	return newURL;
};