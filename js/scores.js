function Scores() {

	this.supported = supported;
	this.store = store;
	this.retrieve = retrieve;
	this.remove = remove;

	function supported() {
		if (typeof(Storage) === 'undefined') {
			console.warn('no localstorage support');
			return false;
		}
		return true;
	}

	function store(key, data) {
		localStorage.setItem(key, data);
	}

	function retrieve(key) {
		return localStorage.getItem(key);
	}

	function remove(key) {
		localStorage.removeItem(key);
	}

}