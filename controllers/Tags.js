const Tag = require('../models/Tag');


//create Tag ka handler function
exports.createTag = async (req, res) => {
    try {

        //data ko fetch karenge
        const { name, description } = req.body;

        //data ko validate karenge
        if (!name || !description) {
            return res.status(400).json(
                {
                    success: false,
                    message: "Please fill details correctly"
                }
            )
        }

        const tagDetails = await Tag.create({ name, description });

        return res.status(200).json(
            {
                success: true,
                message: "Tag created successfully"
            }
        )


    }
    catch (err) {
        return res.status(500).json(
            {
                success: false,
                message: err.message
            }
        )
    }
}

exports.getTag = async (req, res) => {

    try {
        const allTags = await Tag.find({});

        return res.status(200).json(
            {
                success: true,
                message: "Data fetched successfully",
                allTags
            }
        )


    }
    catch (err) {
         return res.status(500).json(
            {
                success: false,
                message: err.message
            }
        )

    }
}