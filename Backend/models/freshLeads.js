const mongoose = require("mongoose");

const userLeadSchema = new mongoose.Schema(
  {
    phoneNumber: {
      type: String,  
    },
    lead_status:{
      type:String,
      default:"Fresh"
    },
    name:{
      type:String
    },
    other_information:{
    type:Object
    },
    user_account:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"user_account_details",
    },
    activity_anchor:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"activity_for_leads"
    },
    assigned_anchor:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"admin"
    },
    activity_timeline_chain:{
      type:String
    },
    current_product_1:{
        type:String
    },
    current_product_2:{
        type:String
    },
    lead_assigned_name:{
      type:String,
    },
    lead_activity_name:{
      type:String
    },
    lead_source:{
      type:String
    },
    lead_channel:{
      type:String
    },
    last_update:{
        type:String
    },
    on_portal:{
        type:Boolean
    },
    lead_score:{
      type:String
    },
    origin:{
      type:String
    },
    lead_unique_id:{
      type:String
    },
    lead_type:{
      type:String,
      default:"degree"
    },
    tags:{
      type:Array
    }

  },
  { timestamps: true }
);

const Lead = mongoose.model("fresh_leads", userLeadSchema);

module.exports = Lead;