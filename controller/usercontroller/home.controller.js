

const HomePage_load = (req,res)=>{
   res.render("user/layout",{
      title:"Home",
      body:"user/home"
   })
}
const AboutPage_load = (req,res)=>{
   res.render("user/layout",{
    title:"About",
    body:"user/about"
   });
}
const ShopPage_load = (req,res)=>{
   res.render("user/layout",{
    title:"Shop",
    body:"user/shop"
   });
}
const ContactPage_load = (req,res)=>{
   res.render("user/layout",{
    title:"Contact",
    body:"user/contact"
   });
}
module.exports={ShopPage_load,HomePage_load,AboutPage_load,ContactPage_load}