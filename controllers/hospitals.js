const Hospital = require("../models/Hospital");

//@desc     get all hospitals
//@route    GET /api/v1/hospitals
//@access   Public
exports.getHospitals=async (req, res, next)=>{

    try {
        const hospitals = await Hospital.find();
        res.status(200).json({success: true, count: hospitals.length, data:hospitals})
    } catch (error) {
        res.status(400).json({success:false});
    }
    
};

//@desc     get single hospital
//@route    GET /api/v1/hospitals/:id
//@access   Public
exports.getHospital=async (req, res, next)=>{

    try {
        const hospital = await Hospital.findById(req.params.id);

        if(!hospital){
            return res.status(400).json({success: false});
        }

        res.status(200).json({success: true, data: hospital});
    } catch (error) {
        res.status(400).json({success:false});
    }

};

//@desc     create new hospital
//@route    POST /api/v1/hospitals
//@access   Private
exports.createHospital= async (req, res, next)=>{
    console.log(req.body);
    const hospital = await Hospital.create(req.body);
    res.status(201).json({success:true, data:hospital });

};

//@desc     update new hospital
//@route    PUT /api/v1/hospitals
//@access   Private
exports.updateHospital=async(req, res, next)=>{

    try {
        const hospital = await Hospital.findByIdAndUpdate(req.params.id,
                                                          req.body,
                                                          {
                                                              new: true,
                                                              runValidators: true
                                                          }
                                                         );

        if(!hospital){
            return res.status(400).json({success: false});
        }

        res.status(200).json({success: true, data: hospital});
    } catch (error) {
        res.status(400).json({success:false});
    }

};


//@desc     delete new hospital
//@route    DELETE /api/v1/hospitals
//@access   Private
exports.deleteHospital=async (req, res, next)=>{

    try {
        const hospital = await Hospital.findByIdAndDelete(req.params.id);

        if(!hospital){
            return res.status(400).json({success: false, msg: "errrrrrrr"});
        }

        res.status(200).json({success: true, data: {}});
    } catch (error) {
        console.log(error);
        res.status(400).json({success:false, msg: "errrrrrrfhfghfghgfhr"});
    }

};