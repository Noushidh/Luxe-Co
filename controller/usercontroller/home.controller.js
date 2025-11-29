

export const HomePage_load = (req,res)=>{
   res.render("user/layout",{
      title:"Home",
      body:"user/home"
   })
}
export const AboutPage_load = (req,res)=>{
   res.render("user/layout",{
    title:"About",
    body:"user/about"
   });
}
export const ShopPage_load = (req,res)=>{
   res.render("user/layout",{
    title:"Shop",
    body:"user/shop"
   });
}
export const ContactPage_load = (req,res)=>{
   res.render("user/layout",{
    title:"Contact",
    body:"user/contact"
   });
}
