
const flattenObj = (prefix="",obj,out={})=>{
    for(const key of Object.keys(obj)){
        const value = obj[key];
        const path = prefix ? `${prefix}.${key}`: key;
        if(value !== null && (value.constructor === Object)){
            flattenObj(path,value,out);
        }else{
            out[path] = value
        }
    }
    return out;
}

module.exports = flattenObj;