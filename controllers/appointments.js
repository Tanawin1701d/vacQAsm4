const Appointment = require('../models/Appointment');
const Hospital    = require('../models/Hospital')



exports.getAppointments = async (req, res, next) => {
    let query;
    // only admin can see only thir appointments!

    if (req.user.role !== 'admin'){
        query=Appointment.find({user:req.user,id}).populate({
            path: 'hospital',
            select: 'name province tel'
        });
    }else{ // if not admin you can see all
        query=Appointment.find().populate({
            path: "hospital",
            select: 'name province tel'
        });
    }


    try{
        const appointments = await query

        res.status(200).json({
            success: true,
            count  :appointments.length,
            data   :appointments
        });
    }catch (error){
        console.log(error);
        return res.status(500).json({success: false, message: "can't find Appointment"});
    }

}



exports.getAppointment = async (req, res, next) =>{
    try {
        const appointment = await Appointment.findById(req.params.id).populate({
            path: 'hospital',
            select: 'name description tel'
        });


        if (!appointment){
            return res.status(404).json({success:false, message: `No appointment with the id of ${req.params.id}`})
        }

        res.status(200).json({
            success:true,
            data: appointment
        });
    } catch (error){
        console.log(error);
        return res.status(500).json({success:false, message:"Cannot find Appointment"})
    }
}


//@desc add appointment
//@route  POST /api/v1/hospital/:hospitalId/appointment
//@aaccess Private

exports.addAppointment = async ( req, res, next ) => {
    try{
        req.body.hospital = req.params.hospitalId

        const hospital = await Hospital.findById(req.params.hospitalId)

        if (!hospital){
            return res.status(404).json({success: false, message:`No hospital with the id of ${req.params.hospitalsId}`});
        }

        req.body.user = req.user.id;

        //check for existed appointment
        console.log("test")
        const existedAppointments = await Appointment.find({user: req.user.id});

        if (existedAppointments.length >= 3 && req.user.role !== "admin"){
            return res.status(400).json({
                success: false,
                message: `The user with ID ${req.user.id} have already mad 3 appointments`
            });
        }

        const appointment= await Appointment.create(req.body);
        res.status(200).json({
            success: true,
            data: appointment
        })
    } catch (error){
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Cannot create Appointment"
        });
    }
    
}

//@desc update appointment
//@route  PUT /api/v1/appointments/:id
//@aaccess Private

exports.updateAppointment = async (req, res, next) =>{
    
    try {
        let appointment = await Appointment.findById(req.params.id);


        if (!appointment){
            return req.status(404).json({
                success:false,
                message: `No appointment with the id of ${req.params.id})`
            })
        }

        //// make sure its owner
        if (appointment.user.toString() !== req.user.id && req.user.role !== 'admin'){
            return res.status(401).json({success:false, message: `User ${req.user.id} is not authrized to update this appointment`});
        }

        appointment = await Appointment.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators:true});

        res.status(200).json({
            success: true,
            data: appointment
        });

    }catch (error){
        console.log(error);
        
        return res.status(500).json({success: false, 
                                     message: "Cannot update Appointment"
        })
    }
}

//@desc delete appointment
//@route  PUT /api/v1/appointments/:id
//@aaccess Private


exports.deleteAppointment = async (req,res, next) =>{
    try {
        const appointment = await Appointment.findById(req.params.id);

        if (!appointment){
            return res.status(404).json({
                success: false,
                message: `No appointment with the id of ${req.params.id}`
            });
        }

        //// make sure its owner
        if (appointment.user.toString() !== req.user.id && req.user.role !== 'admin'){
            return res.status(401).json({success:false, message: `User ${req.user.id} is not authrized to update this appointment`});
        }

        await appointment.remove();

        res.status(200).json({
            success: true,
            data : {}
        })
    }catch (error){
        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Cannot delete Appointment"
        });

    }
}