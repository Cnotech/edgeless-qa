async function sleep(timeout: number) {
	return new Promise((resolve) => {
		setTimeout(resolve, timeout);
	});
}

export { sleep };
