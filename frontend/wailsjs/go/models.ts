export namespace main {
	
	export class Result {
	    resultType: string;
	    resultRaw: string;
	
	    static createFrom(source: any = {}) {
	        return new Result(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.resultType = source["resultType"];
	        this.resultRaw = source["resultRaw"];
	    }
	}

}

