// Create a function that takes an array of numbers. Return the largest number in the array.

function findLargestNum(arr) {
	var largest;
	for (var i; i < arr.length - 1; i++) {
		if (arr[i] > arr[i + 1]) {
			largest = arr[i];
		}
	}
	return largest;
}

const getLastItem = arr => {
	return arr.pop();
};

function accum(str) {
	return str
		.split("")
		.map((el, idx) => {
			return el.toUpperCase() + el.toLowerCase().repeat(idx);
		})
		.join("-");
}

function flipEndChars(str) {
	var length = str.length;
	var result = "Incompatible.";

	if (typeof str === "string") {
		var front = str.charAt(0);
		var end = str.charAt(length - 1);
		if (length < 2) {
			result = "Incompatible.";
		} else if (front === end) {
			result = "Two's a pair.";
		} else {
			result = str.split("");
			result[0] = end;
			result[length - 1] = front;
			result = result.join("");
		}
	}
	return result;
}
