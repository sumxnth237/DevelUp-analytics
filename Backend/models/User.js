const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  loginSession: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "test_users",
  },
  user_login_id: {
    type: String
  },
  user_profile: {
    user_img: String,
    name: {
      first_name: String,
      last_name: String,
    },
    
    job_title: {
      type: String,
      index: "text",
    },
    
    phone: {
      country_code: {
        type: String,
        default: "+91",
      },
      number: String,
    },
    current_salary:{
        type:Number
    },
    gender:{
      type:String
    },
    email: String,
    address: {
      line1: String,
      line2: String,
      city: String,
      state: String,
      country: String,
      postal_code: String,
    },
    age: Number,
    d_o_b:{
      type:Date
    }
  },
  education_details: [
    {
      institute: {
        type: String,
        index: "text",
      },
      degree: {
        type: String,
        index: "text",
      },
      specialisation: {
        type: String,
        index: "text",
      },
      course: {
        type: String,
        index: "text",
      },
      pursuing: {
        value: Boolean,
        mayoc: String,
      },
      total_marks_obtained: {
        unit: String,
        marks: Number,
      },
      grade:{
        type:String
      },
      start_year:{
        type:String
      },
      end_year:{
        type:String
      }
    },
  ],
  about: {
    type: String,
    index: "text",
  },
  work_experience: {
    fresher: Boolean,
    experience: [
      {
        company_name: {
          type: String,
          index: "text",
        },
        designation: {
          type: String,
          index: "text",
        },
        work_duration: {
          start_date: String,
          end_date: String,
          OriginalStartDateFormat: String,
          OriginalEndDateFormat: String,
          currently_working: Boolean,
        },
        work_type: {
          type: String,
          index: "text",
        },
        job_description: {
          type: String,
          index: "text",
        },
        salary: {
          type: Number
        },
      },
    ],
    months_of_experience: Number,
  },
  project_information: [
    {
      title: {
        type: String,
        index: "text",
      },
      duration: {
        start: {
          type: Date,
        },
        end: {
          type: Date,
        },
        OriginalStartDateFormat: {
          type: String,
        },
        OriginalEndDateFormat: {
          type: String,
        }
      },
      description: {
        type: String,
        index: "text",
      },
    },
  ],
  certificates: [
    {
      name: {
        type: String,
        index: "text",
      },
      issued_by: String,
      issued_date: String,
      OriginalDateFormat: String,
    },
  ],
  skills: {
    career_skills: [
      {
        type: String,
        index: "text",
      },
    ],
    soft_skills: [
      {
        type: String,
        index: "text",
      },
    ],
  },
  candidate_language: {
    english_skills: String,
    other_languages: [],
  },
  candidate_toggles: {
    ready_to_relocate: {
      type: Boolean,
      default: false
    },
    immediate_joining: {
      type: Boolean,
      default: false
    },
    interests: [
      {
        title: String,
        value: String
      }
    ],

  },
  courses: [
    {
      name: String,
      institute: String,
      date: String
    },

  ],

  awards: [
    {
      name: String,
      issuer: String,
      date: String
    }
  ],
  referral: [
    {
      name: String,
      title: String,
      email: String,
      employer: String,
      number: String
    }
  ],
  resume_pdf_link:{
    type:String,
  },
  first_time_login:{
    type:Boolean,
    default:true
  }



},
  { timestamps: true });

const User = mongoose.model('user_account_details', userSchema);

module.exports = User;