module.exports = {
	SUM: function(a, b) {
		if (a.i != b.i && a.j != b.j) {
			throw new Error('We have not got a range in sum');
		}

		var result = 0;

		if (a.i === b.i) {
			for (var j = a.j; j <= b.j; j++) {
				result += this.data[a.i][j]*1;
			};
		}

		if (a.j === b.j) {
			for (var i = a.i; i <= b.i; i++) {
				result += this.data[i][a.j]*1;
			};
		}

		return result;
	},

	AVG: function(a, b) {
		return (this.data[a.i][a.j]*1 + this.data[b.i][b.j]*1) / 2;
	}

	// Custom functions here
};