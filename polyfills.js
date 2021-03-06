// https://github.com/uxitten/polyfill/blob/master/string.polyfill.js
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/padStart
if (!String.prototype.padStart) {
    String.prototype.padStart = function padStart(targetLength,padString) {
        targetLength = targetLength>>0; //truncate if number or convert non-number to 0;
        padString = String((typeof padString !== 'undefined' ? padString : ' '));
        if (this.length > targetLength) {
            return String(this);
        }
        else {
            targetLength = targetLength-this.length;
            if (targetLength > padString.length) {
                padString += padString.repeat(targetLength/padString.length); //append to original to ensure we are longer than needed
            }
            return padString.slice(0,targetLength) + String(this);
        }
    };
}

if(!String.prototype.leftTrim) {
	String.prototype.leftTrim = function() {
			return this.replace(/^\s+/,"");
	}
}

if(!String.prototype.toCamelCase) {
	String.prototype.toCamelCase =  function (arg) {
		theStrings = this.split(' ');
		if( theStrings.length <= 1 ) {
				return this.toString();	
		}
		let theCamel = theStrings.reduce( ( camel, word ) => {
			return camel + word.charAt(0).toUpperCase() + word.slice(1);
		});
		if(arg) {
			return theCamel;
		}
		return theCamel.charAt(0).toLowerCase() + theCamel.slice(1);
	}
}
// toCamelCase = (str) => str.replace(/[_|-][A-Za-z]/g, (match, offset, string) => match[1].toUpperCase());

