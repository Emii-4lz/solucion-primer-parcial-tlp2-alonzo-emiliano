// * ARCHIVO A COMPLETAR
import { UserModel, ProfileModel } from "../models/index.js";
import { hashPassword, comparePassword } from "../helpers/bcrypt.helper.js";
import { signToken } from "../helpers/jwt.helper.js";
import { compare } from "bcrypt";

export const register = async (req, res) => {
  try {
    const { username, email, password, first_name, last_name, role } = req.body
    // TODO: 1. Hashear la password antes de guardarla (hashPassword).
    const hashedPassword = await hashPassword(password);
    // TODO: 2. Crear el user y su profile asociado.
    const newUser = await UserModel.create({ username, email, password: hashedPassword, role });
    await ProfileModel.create({ userId: newUser.id, first_name, last_name });
    // TODO: 3. Responder con código 201, un mensaje de éxito y devolver el usuario sin la password.
    return res.status(201).json({ message: "Se ha registrado satisfactoriamente!" })
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Error interno del servidor" });
  }
};

export const login = async (req, res) => {
  try {
    // TODO: 1. Buscar el user por email y comparar la password (comparePassword).
    const { email, password } = matchedData(req)

    const userExist = await UserModel.findOne({
      where: { email }
    });

    const passwordValid = await comparePassword(password, userExist.password)

    if (!passwordValid) {
      return res.status(400).json({ message: "Las credenciales son incorrectas." })
    }

    // TODO: 2. Firmar un JWT con el id y el role del user (signToken).
    const token = signToken({ id: userExist.id, role: userExist.role })

    // TODO: 3. Guardar el token en una cookie httpOnly llamada "token", responder con código 200 y un mensaje de éxito.
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60
    })

    return res.status(200).json({ message: "Inicio de sesión exitoso" })

    // ? Considerar qué mensaje devolver ante credenciales inválidas.
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Error interno del servidor" });
  }
};

export const logout = async (_req, res) => {
  try {
    // TODO: 1. Eliminar la cookie "token" y responder con código 204 sin devolver ningun mensaje.
    res.clearCookie("token");
    return res.status(204);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Error interno del servidor" });
  }
};
