import Wish from "../Models/Wish.js";

export const create = async (req, res) => {
  try {
    const doc = new Wish({
      ...req.body,
    });

    const wish = await doc.save();
    res.json({ ...wish });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Something wrong",
    });
  }
};

export const getAll = async (req, res) => {
  try {
    const wishes = await Wish.find();
    res.json({
      wishes,
    });
  } catch (error) {
    console.log(error);
    res.json({
      message: "Something wrong",
    });
  }
};

export const getOne = async (req, res) => {
  try {
    const wishId = req.params.id;

    const wish = await Wish.findById({
      _id: wishId,
    }).exec();

    res.json({
      ...wish._doc,
    });
  } catch (error) {
    console.log(error);
    res.json(error);
  }
};

export const deleteWish = async (req, res) => {
  try {
    const wishId = req.params.id;
    await Wish.findOneAndDelete({ _id: wishId });
    res.json({ message: "Deleted" });
  } catch (error) {
    res.json(error);
    console.log(error);
  }
};

export const updateWish = async (req, res) => {
  try {
    const wishId = req.params.id;

    await Wish.findByIdAndUpdate(
      {
        _id: wishId,
      },
      {
        ...req.body,
      }
    );

    res.json({
      message: "Updated",
    });
  } catch (error) {
    console.log(error);
  }
};
