const Product = require("../models/product")

const getAllProductsStatic = async (req,res) =>{
    const products = await Product.find({name: 'vase table'})
    res.status(200).json({products})
}

const getAllProducts = async (req,res) =>{
    const {featured,company,name,sort,fields,numericFilters} = req.query;

    const queryObj = {}

    if(featured){
        queryObj.featured = featured === 'true' ? true : false
    }

    if(company){
        queryObj.company = company
    }

    if(name){
        queryObj.name = { $regex: name, $options: 'i' }
    }

    if(numericFilters){
        const operatorMap = {
            '>': '$gt',
            '>=': '$gte',
            '=': '$eq',
            '<': '$lt',
            '<=': '$lte'
        }
        const regex = /\b(<|<=|=|>|>=)\b/g
        let filters = numericFilters.replace(regex, (match) =>{
            `-${operatorMap[match]}-`
        })

        const options = ['price', 'rating'];
        filters = filters.split(",").forEach((item) =>{
            const [field,operator,value] = item.split("-")
            if(options.includes(field)){
                queryObj[field] = {[operator]: Number(value)}
            }
        })
    }


    let results =  Product.find(queryObj);
    
    if(sort){
        const sortList = sort.split(",").join(' ');
        results = results.sort(sortList)
        // products = products.sort()
    }
    else{
        results = results.sort('createdAt')
    }


    if(fields){
        const fieldList = fields.split(",").join(' ');
        results = results.select(fieldList)
    }

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page-1) * limit

    results = results.skip(skip).limit(limit);

    const products = await results

    res.status(200).json({length:products.length ,products})
}

module.exports = {
    getAllProducts,
    getAllProductsStatic
}