const mongoose = require("mongoose");

const jobsSchema = new mongoose.Schema(
  {
    job_details: {
      job_title: {
        type: String,
        trim: true,
        index: "text",
      },
      company_name: {
        type: String,
        trim: true,
        index: "text",
      },

      job_type: {
        type: Object,
        index: "text",
      },
      work_location: {
        type: Object,
        index: "text",
      },
      compensation: {
        pay_type: {
          value: {
            type: String,
            trim: true,
          },

          minimum_range: {
            value: {
              type: Number,
            },
            currency: {
              type: String,
            },
          },
          maximum_range: {
            value: {
              type: Number,
            },
            currency: {
              type: String,
            },
          },
          monthly_incentives: {
            value: {
              type: Number,
            },
            currency: {
              type: String,
            },
          },
        },

        perks: {
          type: Array,
          index: "text",
        },
        deposit_fee: {}, // schema will be defined in this object
      },
    },

    candidate_requirements: {
      minimum_education: {
        type: Object,
        index: "text",
      },
      experience_required: {
        // type: {
        //   type: String,
        //   trim: true,
        // },
        // time: {
        //   type: Number,
        // },
      },
      expertise_area: {
        type: Array,
        index: "text",
      },
      // {
      //   type: String,
      //   trim: true,
      // },

      english_level_required: {},
      // {
      //   type: String,
      //   trim: true,
      // },

      regional_languages: [
        // {
        //   type: String,
        //   trim: true,
        // },
      ],
      additional_requirements: {
        age: {
          minimum: {
            type: Number,
          },
          maximum: {
            type: Number,
          },
        },

        gender: {
          type: {
            type: String,
            trim: true,
            index: "text",
          },
        },

        skills: {
          type: Array,
          index: "text",
        },
        job_description: {
          description: {
            type: String,
            trim: true,
            index: "text",
          },
          about_company: {
            type: String,
            trim: true,
            index: "text",
          },
          about_job: {
            type: String,
            trim: true,
            index: "text",
          },
          roles_responsibility: {
            type: String,
            trim: true,
            index: "text",
          },
          candidates_requirements: {
            type: String,
            trim: true,
            index: "text",
          },
        },
      },
    },
    interview_section: {
      communication_preference: {
        value: {
          type: String,
        },
        member: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "employer",
        },
      },
      notification_preference: {
        value: {
          type: String,
        },
        member: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "employer",
        },
      },
      interview_method: {
        type: [],
        address: {
          type: String,
          trim: true,
        },
      },
    },

    start_date: {
      type: Date,
      required: true,
    },
    expiry_date: {
      type: Date,
      required: true,
    },

    no_of_candidates_required: {
      type: Number,
    },

    posted_by: {
      company_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "employer",
      },
      employer_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "employer",
      },
      associate_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "admins",
      },
      company_logo: {
        type: String,
      },
      company_name: {
        type: String,
        index: "text",
      },
    },
    embeddings: {
      type: Array,
    },
    embeddings_description: {
      type: String,
    },
    spot_instance:{
      type:Array
    }
  },

  { timestamps: true }
);

const EmployerJob = mongoose.model("Jobs", jobsSchema);

module.exports = EmployerJob;