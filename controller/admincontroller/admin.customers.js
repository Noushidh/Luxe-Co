

const load_customers =(req,res)=>{
    res.render('admin/layout',{
        title:"Customers",
        body:"./customers"
    })
}
module.exports={load_customers}