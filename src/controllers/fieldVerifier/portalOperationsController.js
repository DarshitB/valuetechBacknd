const FieldVerifier = require("../../models/fieldVerifier/portal_operations");
const User = require("../../models/user");
const City = require("../../models/city");
const bcrypt = require("bcrypt");
const {
  NotFoundError,
  ConflictError,
  BadRequestError,
} = require("../../utils/customErrors");

// Get all field verifiers (not soft-deleted)
exports.getAll = async (req, res, next) => {
  try {
    const verifiers = await FieldVerifier.findAll();
    res.json(verifiers);
  } catch (err) {
    next(err);
  }
};

// Get field verifier by ID
exports.getById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const verifier = await FieldVerifier.findById(id);
    if (!verifier) throw new NotFoundError("Field Verifier not found");
    res.json(verifier);
  } catch (err) {
    next(err);
  }
};

// Check if mobile already exists
exports.findByMobile = async (req, res) => {
  try {
    const { mobile } = req.body;

    if (!mobile || mobile.trim() === "") {
      throw new BadRequestError("Mobile number is required.");
    }

    const verifier = await FieldVerifier.findByMobile(mobile);

    if (verifier) {
      return res.status(200).json({ exists: true });
    } else {
      return res.status(200).json({ exists: false });
    }
  } catch (err) {
    console.error("Error in findByMobile:", err);
    return res.status(500).json({ message: "Server error." });
  }
};

// Check if email already exists
exports.checkEmailExistence = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || email.trim() === "") {
      throw new BadRequestError("Email is required.");
    }

    const verifier = await FieldVerifier.findByEmail(email);

    if (verifier) {
      return res.status(200).json({ exists: true });
    } else {
      return res.status(200).json({ exists: false });
    }
  } catch (err) {
    console.error("Error in checkEmailExistence:", err);
    return res.status(500).json({ message: "Server error." });
  }
};

// Create a new field verifier
exports.create = async (req, res, next) => {
  try {
    const { name, email, mobile, password, city_id, upi_id } = req.body;

    if (!name || !email || !mobile || !password || !city_id) {
      throw new BadRequestError(
        "Name, mobile, email, password, and city are required."
      );
    }

    // Check if email already exists
    const existingEmail = await FieldVerifier.findByEmail(email);
    if (existingEmail) {
      throw new ConflictError("Email already exists.");
    }

    // Check if mobile already exists
    const existingMobile = await FieldVerifier.findByMobile(mobile);
    if (existingMobile) {
      throw new ConflictError("Mobile number already exists.");
    }

    const hash = await bcrypt.hash(password, 10);

    const [verifier] = await FieldVerifier.create({
      name,
      email,
      mobile,
      password: hash,
      city_id,
      upi_id,
      created_by: req.user?.id,
      created_at: new Date(),
    });

    res.locals.newRecordId = verifier.id;

    const creator = await User.findById(verifier.created_by);
    const verifierCity = await City.findById(verifier.city_id);

    // Destructure password out to avoid exposing it
    const { password: _, ...safeData } = verifier;

    const enriched = {
      ...safeData,
      city_name: verifierCity?.name || null,
      created_by: creator?.name || null,
    };

    res.status(201).json(enriched);
  } catch (err) {
    if (err.code === "23505") {
      return next(new ConflictError("Email or mobile already exists."));
    }
    next(err);
  }
};

// Update field verifier
exports.update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, email, mobile, password, city_id, upi_id, is_active } =
      req.body;

    const existing = await FieldVerifier.findById(id);
    if (!existing) throw new NotFoundError("Field Verifier not found");

    // Check if email is being changed and if the new email already exists
    if (email && email !== existing.email) {
      const emailExists = await FieldVerifier.findByEmail(email);
      if (emailExists && emailExists.id !== id) {
        throw new ConflictError("Email already exists.");
      }
    }

    // Check if mobile is being changed and if the new mobile already exists
    if (mobile && mobile !== existing.mobile) {
      const mobileExists = await FieldVerifier.findByMobile(mobile);
      if (mobileExists && mobileExists.id !== id) {
        throw new ConflictError("Mobile number already exists.");
      }
    }

    const updatedData = {
      name,
      email,
      mobile,
      city_id,
      upi_id,
      is_active,
      updated_by: req.user?.id,
      updated_at: new Date(),
    };

    if (password) {
      updatedData.password = await bcrypt.hash(password, 10);
    }

    const [updated] = await FieldVerifier.update(id, updatedData);

    const creator = await User.findById(updated.created_by);
    const editor = await User.findById(updated.updated_by);
    const verifierCity = await City.findById(updated.city_id);

    // Destructure password out to avoid exposing it
    const { password: _, ...safeData } = updated;

    const enriched = {
      ...safeData,
      city_name: verifierCity?.name || null,
      created_by: creator?.name || null,
      updated_by: editor?.name || null,
    };

    res.json(enriched);
  } catch (err) {
    if (err.code === "23505") {
      return next(new ConflictError("Email or mobile already exists."));
    }
    next(err);
  }
};

// Toggle is_active field
exports.toggleActiveStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    /* console.log("it is in this"); */
    const existing = await FieldVerifier.findById(id);
    if (!existing) throw new NotFoundError("Field Verifier not found");

    const [updated] = await FieldVerifier.toggleActiveStatus(id);

    const editor = await User.findById(req.user?.id);
    const creator = await User.findById(updated.created_by);
    const verifierCity = await City.findById(updated.city_id);

    const { password: _, ...safeData } = updated;

    const enriched = {
      ...safeData,
      city_name: verifierCity?.name || null,
      created_by: creator?.name || null,
      updated_by: editor?.name || null,
    };

    res.json(enriched);
  } catch (err) {
    next(err);
  }
};

// Soft delete field verifier
exports.softDelete = async (req, res, next) => {
  try {
    const { id } = req.params;

    const existing = await FieldVerifier.findById(id);
    if (!existing) throw new NotFoundError("Field Verifier not found");

    await FieldVerifier.softDelete(id, req.user.id);

    res.status(204).json({ message: "Field Verifier deleted successfully." });
  } catch (err) {
    next(err);
  }
};

// Get all login records
exports.getAllLogins = async (req, res, next) => {
  try {
    const logins = await FieldVerifier.findAllLogins();
    res.json(logins);
  } catch (err) {
    next(err);
  }
};

// Get login record by ID
exports.getLoginById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const login = await FieldVerifier.findLoginById(id);
    if (!login) throw new NotFoundError("Login record not found");

    res.json(login);
  } catch (err) {
    next(err);
  }
};

// Soft delete login record
exports.softDeleteLogin = async (req, res, next) => {
  try {
    const { id } = req.params;

    const login = await FieldVerifier.findLoginById(id);
    if (!login) throw new NotFoundError("Login record not found");

    await FieldVerifier.softDeleteLogin(id, req.user.id);

    res.status(204).json({ message: "Login deleted successfully." });
  } catch (err) {
    next(err);
  }
};
