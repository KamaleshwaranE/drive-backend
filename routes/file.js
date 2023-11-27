import { Router } from "express";
import mongoose, { now } from "mongoose";
import { body, validationResult } from "express-validator";
const File = mongoose.model("File");
const User = mongoose.model("User");
const Folder = mongoose.model("Folder");

const app = Router();

/** file*/

app.get("/", async (req, res) => {
  const result = await File.find({});
  res.status(200).json(result);
});

// app.get("/:id?", async (req, res) => {
//   const { id } = req.params;
//   const { user } = req.user;
//   const result = await File.find({ user: user.id }).populate("UploadedBy", [
//     "id",
//     "name",
//   ]);
//   res.status(200).json(result);
// });

app.post("/upload", async (req, res) => {
  console.log("hit");
  const { name, mime, type, version, fileSize, favorite } = req.body;
  console.log("before", req.body);
  // const { id: userId } = req.user;
  const file = new File({
    name,
    mime,
    type,
    fileSize,
    // uploadBy,
    // favorite,
  });
  // console.log("test", file);
  await file.save();
  // await File.populate(file, {
  //   path: "uploadOn",
  //   select: ["id", "name"],
  // });
  res.status(201).json(file);
});

app.delete("/bin", async (req, res) => {
  const { id: userId } = req.user;
  const { ids } = req.query;
  await File.updateMany(
    { _id: { $in: ids } },
    {
      $set: {
        inBin: true,
        binOn: new Date(),
        binBy: userId,
      },
    }
  );
  res.sendStatus(204);
});

app.delete("/confirmDelete", async (req, res) => {
  const { id: userId } = req.user;
  const { ids } = req.query;
  await File.updateMany(
    {
      _id: { $in: ids },
    },
    {
      $set: {
        inBin: false,
        binOn: null,
        binBy: null,
      },
    }
  );
  await File.deleteMany({ _id: { $in: ids } });
});

app.put("/restore", async (req, res) => {
  const { id: userId } = req.user;
  const { id } = req.body;
  await File.updateMany(
    { id: { $in: id }, user: userId },
    {
      $set: {
        inBin: false,
        binOn: null,
        binBy: null,
      },
    }
  );
  const result = await File.findById(id);
  res.status(202).json(result);
});

/** favorite*/

app.put("/favorite", async (req, res) => {
  const { id: userId } = req.user;
  const fav = await File.find({ _id: { $in: favorite }, favorite: userId });
  const favIds = favDocs.map((f) => f.id);
  if (favIds.length > 0) {
    await File.updateMany(
      {
        _id: { $in: favIds },
      },
      {
        $pull: { favorite: userId },
      }
    );
  }
  await File.updateMany(
    {
      _id: favorite.filter((f) => !favIds.includes(f)),
    },
    {
      $push: { favorite: userId },
    }
  );
  res.sendStatus(202);
});

/** For folder*/

app.get("/folder", async (req, res) => {
  const folder = await Folder.find({});
  res.status(200).json(folder);
});

app.post("/folder", async (req, res) => {
  const { name } = req.body;
  const folder = new Folder({
    name: name,
  });
  await folder.save();
  res.sendStatus(201);
});

app.put("/folder/:id", async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  const folder = await Folder.findByIdAndUpdate(id, {
    $set: {
      name: name,
    },
  });
  res.status(202).json(folder);
});

app.delete("/folder/:id", async (req, res) => {
  const { id } = req.params;
  const result = await Folder.findByIdAndDelete(id);
  res.sendStatus(204);
});

export default app;
