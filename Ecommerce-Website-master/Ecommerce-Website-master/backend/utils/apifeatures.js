class Apifeatures {
    constructor(query, querystr){
        this.query = query;
        this.querystr = querystr;
    }

    search(){
        const keyword = this.querystr.keyword ? {
            name:{
                $regex : this.querystr.keyword,
                $options: "i",
            },
        }:{};
       
        this.query = this.query.find({ ...keyword});
        return this;
    }
    filter(){
        const querycopy = {...this.querystr}
        
        // removing some fields for category

        const removeFields =["keyword","page","limit"];
        removeFields.forEach((key) => delete querycopy[key]);

        // Filter for price and rating
        console.log(querycopy);

        let querystr = JSON.stringify(querycopy);

        querystr = querystr.replace(/\b(gt|gte|lt|lte)\b/g,key => `$${key}`);
        console.log(querystr);

        this.query =this.query.find(JSON.parse(querystr));


        console.log(querystr);

        return this;

    }
    pagination(resultPerPage){
        const currentPage = Number (this.querystr.page) || 1;   //

        const skip = resultPerPage * (currentPage-1)

        this.query = this.query.limit(resultPerPage).skip(skip);
        
        return this;
    }
    
}

module.exports =Apifeatures