const mongoose = require("mongoose");

const applicantsSchema = new mongoose.Schema(
  {
    job_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Jobs",
    },
    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user_account_details",
    },
    status: {
      type: String,
      default: "In-Review", // rejected, shortlisted, selected
    },
    interview: {
      scheduled: {
        type: Boolean,
        default: false,
      },
      info: {},
    },
    offer_letter:{
      scheduled:{
        type:Boolean,
        default:false
      },
      info:{}
    },
    is_recommended: {
      type: Boolean,
      default: false,
    },
    is_rejected:{
       type:Boolean,
       default:false
    },
    is_important:{
      type:Boolean,
      default:false
    },
    is_active:{
       type:Boolean,
       default:false
    },
    status_number:{
       type:Number
    },
    other_information:[{
      event_name:{
        type:String
      },
      info:{
        type:Object
      }
    }]
  },
  { timestamps: true }
);

const Applicant = new mongoose.model("applicants", applicantsSchema);

module.exports = Applicant;