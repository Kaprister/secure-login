const User = require('./model/user');
const bcrypt = require('bcrypt');
const mailSender = require('./utils/mailSender');



// signup

exports.signup = async(req, res) => {
    try{
        // get data from the request body
        let data = {
            name,
            email,
            password,
            confirmPassword
        } = req.body;
        

        // check if all details are there are not
        if(!name || !email || !password){
            return res.status(403).send({
                success: false,
                message: "All Fields are required"
            });
        }
     
        // check if password and confirm password matched
        if(password.toString() !== confirmPassword.toString()){
            console.log("password and confirm password not matched");
            return res.status(401).json({
                success: false,
                message: "Password and Confirm Password do not matched!"
            });
        }

        // check if user is already exists
        const existingUser = await User.findOne({ email});
        if(existingUser){
            return res.status(400).json({
                success: false,
                message: "User already exists. please login in to continue."
            });
        }


        // hash the password
        const hashedPassword = await bcrypt.hash(password.toString(), 10);
        // create a new user
        const user = await User.create({
            name : data.name.toString(),
            email : data.email.toString(),
            password: hashedPassword,
        });


        return res.status(200).json({
            success: true,
            user,
            message: "User registered successfully",
        });

    }catch(error){
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "User cannot be registered. Please try again!"
        })
    }
}



// login

exports.login = async(req, res) => {
    try{
        // get dat from request body
        const{
            email,
            password,
        } = req.body;

        // check if all details are there are not
        if(!email || !password){
            return res.status(403).json({
                success: false,
                message: "All fields are required"
            })
        }

        // check user exists or not
        const user = await User.findOne({email});
        if(!user){
            return res.status(401).json({
                success: false,
                message: "User is not registered!"
            })
        }

        // match password
        if(await bcrypt.compare(password.toString(), user.password)){

            if (user.blockedUntil && user.blockedUntil > Date.now()) {
                return res.status(406).json({
                    success: false,
                    message: "Your account is currently blocked. Please try again after one hour."
                });
            }

            await User.findOneAndUpdate(
                {email: email}, 
                {tryCount:0},
                {new : true} );

            res.status(200).json({
                success:true,
                message:"logged in successfully!"
            });
            
        }else{
            let updatedUserDetails = await User.findOneAndUpdate(
                {email: email}, 
                {$inc:{tryCount:1}},
                {new : true} );
            console.log("TRY TO LOG IN COUNT : " ,updatedUserDetails.tryCount);

            if(updatedUserDetails.tryCount === 3){
                try{
                    const emailResponse = await mailSender(
                        updatedUserDetails.email,
                        "Important Notice Regarding Your Account Security",
    
                        ` 
                            We hope this mail finds you well. <br>
                        
                            We've noticed that there have been three consecutive failed login attempts on your account.
                            While we understand that these may be genuine mistakes,
                            we want to bring this to your attention to ensure the security of your account.
                            Please be aware that your account will be temporarily locked after five consecutive failed login attempts.
                            This is a security measure we have in place to protect your account from unauthorized access. <br>
    
                            Thank you for your attention to this matter.
                        `
                        );
                        
                    // console.log('Email sent successfully : ', emailResponse)
                    console.log('Email sent successfully!!')
                    return res.status(402).json({
                        success:false,
                        message: "Password is incorrect!"
                    })
    
                }catch(error){
                    console.error("Error occurred while sending email:", error)
                    return res.status(500).json({
                        success: false,
                        message: "Error occurred while sending email",
                        error: error.message,
                    })
                }
            }

            if(updatedUserDetails.tryCount >= 5){
                await User.findOneAndUpdate(
                    {email : email},
                    {
                        $set : {
                            tryCount : 0,
                            blockedUntil: Date.now() + 360000,
                        }
                    },
                    { new: true }
                )


                try{
                    const emailResponse = await mailSender(
                        updatedUserDetails.email,
                        "Account Blocked Due to Security Reasons",
    
                        ` 
                            We hope this mail finds you well. <br>
                        
                            We regret to inform you that your account has been temporarily blocked due to security reasons.
                            This action was taken after five consecutive failed login attempts.
                            Your account will be unblocked automatically after one hour. <br>

                            Thank you for your understanding.
                        `
                        )
                        
                    console.log('Email sent successfully : ', emailResponse)
                    return res.status(406).json({
                        success: false,
                        message: "Your account has been blocked due to security reasons. Please try again after one hour."
                    });
    
                }catch(error){
                    console.error("Error occurred while sending email:", error)
                    return res.status(500).json({
                        success: false,
                        message: "Error occurred while sending email",
                        error: error.message,
                    })
                }

            }

            // let updatedDetails = await User.findOneAndUpdate(
            //     {email: email}, 
            //     {tryCount:0},
            //     {new : true} );
            
            // console.log("TRY TO LOG IN COUNT AGAIN UPDATE : " ,updatedDetails.tryCount);

            return res.status(402).json({
                success:false,
                message: "Password is incorrect!"
            })
        }
    }catch(error){
        console.log(error)
        return res.status(500).json({
            success:false,
            message: "User cannot Logged In, please try again"
        })
    }
}