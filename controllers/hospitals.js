//@desc     get all hospitals
//@route    GET /api/v1/hospitals
//@access   Public

exports.getHospitals=(req, res, next)=>{

    res.status(200).json({success:true, msg:'Show all hospitals'});


};

//@desc     get single hospital
//@route    GET /api/v1/hospitals/:id
//@access   Public
exports.getHospital=(req, res, next)=>{

    res.status(200).json({success:true, msg:`Show hospital ${req.params.id}`});

};

//@desc     create new hospital
//@route    POST /api/v1/hospitals
//@access   Private
exports.createHospital=(req, res, next)=>{

    res.status(200).json({success:true, msg:'Create new hospitals'});

};

//@desc     update new hospital
//@route    PUT /api/v1/hospitals
//@access   Private
exports.updateHospital=(req, res, next)=>{

    res.status(200).json({success:true, msg:`Update hospital ${req.params.id}`});

};


//@desc     delete new hospital
//@route    DELETE /api/v1/hospitals
//@access   Private
exports.deleteHospital=(req, res, next)=>{

    res.status(200).json({success:true, msg:`Delete hospital ${req.params.id}`});

};