const Evento = require("../models/Evento");

const createEvent = async (req, res) => {
  console.log(req.body);
  try {
    const evento = new Evento(req.body);
    evento.user = req.uid;
    await evento.save();
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }

  res.json({
    ok: true,
    msg: "createEvent",
  });
};

const updateEvent = async (req, res) => {
  const eventoId = req.params.id;
  const uid = req.uid;

  try {
    const evento = await Evento.findById(eventoId);

    if (!evento) {
      res.status(404).json({
        ok: false,
        msg: "Evento no existe por ese id",
      });
    }

    if (evento.user.toString() !== uid) {
      return res.status(401).json({
        ok: false,
        msg: "No tiene privilegio de editar este evento",
      });
    }
    const newEvent = {
      ...req.body,
      user: uid,
    };

    const eventoActualizado = await Evento.findByIdAndUpdate(
      eventoId,
      newEvent,
      { new: true }
    );

    res.json({
      ok: true,
      evento: eventoActualizado,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

const deleteEvent = async (req, res) => {
  const eventoId = req.params.id;

  try {
    const evento = await Evento.findById(eventoId);

    if (!evento) {
      return res.status(404).json({
        ok: false,
        msg: "Evento no existe por ese id",
      });
    }

    const uid = req.uid;

    if (uid !== evento.user.toString()) {
      return res.status(404).json({
        ok: false,
        msg: "No tiene privilegio de eliminar este evento",
      });
    }

    await Evento.findByIdAndDelete(eventoId);

    res.status(200).json({
      ok: true,
      msg: "Evento eliminado",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador"
  } )
}
};

const getAllEvents = async (req, res) => {



  try {
    const eventos = await Evento.find().populate("user", "name");

    res.json({
      ok: true,
      eventos,
    });
    
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

module.exports = {
  createEvent,
  updateEvent,
  deleteEvent,
  getAllEvents,
};
