
const bcrypt = require("bcryptjs");
const Usuario = require("../models/Usuario");
const { generarJWT } = require("../helpers/jwt");

const crearUsuario = async (req, res) => {


  const { email,  password } = req.body;

  
  try {
    const usuario = await Usuario.findOne({ email });

    if (usuario) {
      return res.status(400).json({
        ok: false,
        msg: "El usuario ya existe con ese correo",
      });
    }


    const newUser = new Usuario(req.body);

    const salt = bcrypt.genSaltSync(10);
    newUser.password = bcrypt.hashSync(password, salt);

    await newUser.save();
    const token = await generarJWT(newUser.id, newUser.name);
  
    res.status(201).json({
      ok: true,
      user: newUser.name,
      uid: newUser.id,
      token: token,
    });
    
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "error",
    });
  }
};

const loginUsuario = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await Usuario.findOne({ email });

    if (!user) {
      return res.status(400).json({
        ok: false,
        msg: "El usuario no existe con ese email",
      });
    }

    const validPassword = bcrypt.compareSync(password, user.password);

    if (!validPassword) {
      return res.status(400).json({
        ok: false,
        msg: "Contraseña incorrecta",
      });
    }
    const token = await generarJWT(user.id, user.name);

    res.status(200).json({
      ok: true,
      uid: user.id,
      user: user.name,
      token: token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({});
  }
};

const revalidateToken = async (req, res) => {
  const uid = req.uid;
  const name = req.name;

  const token = await generarJWT(uid, name);

  res.json({
    ok: true,
    token: token,
  });
};

module.exports = {
  crearUsuario,
  loginUsuario,
  revalidateToken,
};
