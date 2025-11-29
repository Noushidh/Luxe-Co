
import UserModel from "../../models/usermodel.js";
export const load_customers = async (req, res) => {
  try {
    const users = await UserModel.find({})
    res.render('admin/layout', {
      title: "Customers",
      body: "./customers",
      users: users,
    })
  } catch (error) {
    console.log("customer load error", error)
    res.status(500).send("server error")
  }
}

