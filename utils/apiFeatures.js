class APIFeatures

{
    constructor(query , queryString)

    {
        this.query = query;

        this.queryString = queryString;
    }

    filter()

    {

        //Filtering

        // console.log(this.query);

        const queryObj = {...this.queryString};

        const exclude = ['page' , 'sort' , 'limit' , 'fields'];

        exclude.forEach(el => delete queryObj[el]);

        //Advanced Filtering

        let queryStr = JSON.stringify(queryObj);

        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g , match => `$${match}`);

        // console.log(JSON.parse(queryStr));
        
        this.query = this.query.find(JSON.parse(queryStr));


        return this;
    }

    sort()

    {

        //Sorting

        if(this.queryString.sort)

        {

          const sortBy = this.queryString.sort.split(',').join(' ');

           this.query = this.query.sort(sortBy);

        //    console.log(sortBy);
        }

        else

        {
            this.query = this.query.sort('-createdAt');
        }

       return this;

    
    }

    limitFields()

    {
         //Projecting or Limiting

         if(this.queryString.fields)

         {
             const fields = this.queryString.fields.split(',').join(' ');
 
             this.query = this.query.select(fields);
 
            //  console.log(fields);
 
         }
 
         else
 
         { 
             this.query = this.query.select('-__v');
         }

         return this;
 
 
    }

    Pagination()

    {
        //Pagination

        // example = query = query.skip(2).limit(10);

        const page = this.queryString.page * 1 || 1;

        const limit = this.queryString.limit * 1 || 100;

        const skip = (page - 1) * limit;

        this.query = this.query.skip(skip).limit(limit);

        // the requested page is greater than the total number of results

        // if(this.queryString.page)

        // {
        //     const numTour = await query.countDocuments();

        //     if(skip >= numTour)

        //     {
        //         throw new Error;
        //     }


        // }

        return this;
   
    }
}

module.exports = APIFeatures;