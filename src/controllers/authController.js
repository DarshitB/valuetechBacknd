const User = require("../models/user");
const Role = require("../models/role");
const db = require("../../db");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { NotFoundError, BadRequestError } = require("../utils/customErrors");
const { getDeviceDetails } = require("../utils/deviceData");

/* exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password)
      throw new BadRequestError("Username and password are required");

    const user = await User.findByUsername(username);
    if (!user) throw new NotFoundError("User not found");

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new BadRequestError("Invalid password");

    const role = await Role.findById(user.role_id);

    // 👇 Check if role name is 'developer_admin'
    let rolePermissions = [];
    if (role.name === "developer_admin") {
      // Get all permissions
      rolePermissions = await db("permissions").select("name");
    } else {
      // Get permissions assigned to the role
      rolePermissions = await Role.getPermissions(user.role_id);
    }

    const deviceInfo = getDeviceDetails(req);

    await db("activity_logs").insert({
      user_id: user.id,
      action: "login",
      table_name: null,
      record_id: null,
      metadata: {
        ip: req.ip,
        user_agent: req.headers["user-agent"],
        device_info: deviceInfo,
      },
    }); // Log login activity

    const token = jwt.sign(
      { userId: user.id, roleId: user.role_id },
      process.env.JWT_SECRET,
      { expiresIn: "3h" }
    );

    // res.json({
    //  token,
    //  user: {
    //    id: user.id,
    //    username: user.username,
    //    role: {
    //      id: role.id,
    //      name: role.name,
    //      permissions: rolePermissions.map((p) => p.name),
    //    },
    //  },
    //});
    res.json({
      token,
    });
  } catch (err) {
    next(err);
  }
}; */
exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    console.log("🔵 Step 1: Got login data", req.body);

    // ✅ Validate required fields
    if (!username || !password) {
      console.log("🔴 Missing fields");
      throw new BadRequestError("Username and password are required");
    }

    // ✅ Find user by username
    const user = await User.findByUsernameOrMobile(username);
    console.log("🔵 Step 2: User fetched", user);
    if (!user) {
      console.log("🔴 User not found");
      throw new NotFoundError("User not found");
    }

    // ✅ Compare hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log("🔵 Step 3: Password check", isPasswordValid);
    if (!isPasswordValid) {
      console.log("🔴 Invalid password");
      throw new BadRequestError("Invalid password");
    }

    // ✅ Get user role & permissions
    const role = await Role.findById(user.role_id);
    console.log("🔵 Step 4: Role fetched", role);
    let permissions = [];

    if (role.name === "developer_admin") {
      // Developer admin gets all permissions
      permissions = await db("permissions").select("name");
      console.log("🔵 Step 5A: All permissions fetched");
    } else {
      // Get permissions assigned to this role
      permissions = await Role.getPermissions(role.id);
      console.log("🔵 Step 5B: Role-based permissions", permissions);
    }

    // ✅ Log activity
    await db("activity_logs").insert({
      user_id: user.id,
      action: "login",
      table_name: null,
      record_id: null,
      metadata: {
        ip: req.ip,
        user_agent: req.headers["user-agent"],
        device_info: getDeviceDetails(req),
      },
    });
    console.log("🔵 Step 6: Activity log inserted");
    // ✅ Generate JWT Token
    const token = jwt.sign(
      { userId: user.id, roleId: user.role_id },
      process.env.JWT_SECRET,
      { expiresIn: "3h" }
    );
    console.log("🔵 Step 7: Token generated");
    // ✅ Send response (only token for now)
    res.json({ token });

    // 👉 To include user info in response, uncomment below:
    /*
    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        role: {
          id: role.id,
          name: role.name,
          permissions: permissions.map(p => p.name),
        },
      },
    });
    */
  } catch (err) {
    next(err);
  }
};
exports.logout = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Optionally log the logout activity
    await db("activity_logs").insert({
      user_id: decoded.userId,
      action: "logout",
      table_name: null,
      record_id: null,
      metadata: {
        ip: req.ip,
        user_agent: req.headers["user-agent"],
        device_info: getDeviceDetails(req),
      },
    });

    res.json({ message: "Logged out (client should delete token)" });
  } catch (err) {
    next(err);
  }
};

exports.getMe = async (req, res, next) => {
  try {
    const userId = req.user?.id; // comes from decoded token in auth middleware

    if (!userId) throw new BadRequestError("Invalid user");

    const user = await User.findById(userId);
    if (!user) throw new NotFoundError("User not found");
    /* console.log(user); */
    const role = await Role.findById(user.role_id);

    let permissions = [];
    if (role.name === "developer_admin") {
      permissions = await db("permissions").select("name");
    } else {
      permissions = await Role.getPermissions(user.role_id);
    }

    res.json({
      id: user.id,
      username: user.username,
      name: user.name,
      mobile: user.mobile,
      city_id: user.city_id,
      city_name: user.city_name,
      role: {
        id: role.id,
        name: role.name,
      },
      permissions: permissions.map((p) => p.name),
    });
  } catch (err) {
    next(err);
  }
};
