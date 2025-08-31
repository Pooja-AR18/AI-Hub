const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Doc = require('../models/Document'); 
// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// Register user
    exports.registerUser = async (req, res) => {
      try {
        const { name, email, password } = req.body;
        console.log("Body received:", req.body);

        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: 'User already exists' });

          const user = await User.create({ name, email, password, role: "user" });
            res.json({
            user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
            token: generateToken(user._id),
          });
          } catch (err) {
              console.error('Register Error:', err);
              res.status(500).json({ message: err.message });
          }
      };




// Login user
      exports.loginUser = async (req, res) => {
        try {
          const { email, password } = req.body;

          const user = await User.findOne({ email });
          if (!user) return res.status(401).json({ message: 'Invalid credentials' });

          const isMatch = await user.matchPassword(password);
          if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

          res.json({
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token: generateToken(user._id),
      });

        } catch (err) {
          console.error('Login Error:', err);
          res.status(500).json({ message: err.message });
        }
      };

      exports.updateDoc = async (req, res) => {
        try {
          const doc = await Doc.findById(req.params.id);
          if (!doc) return res.status(404).json({ message: 'Document not found' });

          // Update fields
          doc.title = req.body.title || doc.title;
          doc.content = req.body.content || doc.content;
          doc.tags = req.body.tags || doc.tags;

          await doc.save();
          res.json(doc);
        } catch (err) {
          console.error(err);
          res.status(500).json({ message: err.message });
        }
      };

