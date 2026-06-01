const express = require('express');
const {
  register,
  login,
  profile,
  logout,
} = require('../controllers/userController');
const validate = require('../middleware/validate');
const auth = require('../middleware/auth');
const { registerSchema, loginSchema } = require('../validations/userValidation');

const router = express.Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.get('/me', auth, profile);
router.post('/logout', auth, logout);

module.exports = router;