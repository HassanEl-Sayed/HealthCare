1- Connect to DB with mongoose.

2- used bcrypt to hash password for user and doctor.

3- used webjsontoken to get/verify token.

4-create auto the date of create email & update it.
------------------------------------------------------------------------------------------------------------
5- For user : join with [Area/insurance] and Make routs
            (signup/login/logout/read profile / update profile / delete user / allUser / <ratingDoc>).
------------------------------------------------------------------------------------------------------------
6-<Done> For Upload images: using multer and sharp package 
            1- make limit size = #1MB 
            2-it can upload any extention and convert it to #PNG 
            3-resize pic
            (upload avatar/delete avatar/upload insuranceCard/delete insuranceCard/<doctotAvatar>)
------------------------------------------------------------------------------------------------------------
7-For doctor : join with [specialtie_array/BranchesHC_array] and Make routs
             (signup/login/logout/read profile / update profile / delete doctor /<allDoctors> /<oneDoctor>/<AvalibleTimeForOneDoctor >).
------------------------------------------------------------------------------------------------------------
8-<Done> For Area : join with [governorate] and Make routs 
            (Add Governorate / Add Area / get all Governorates that can get All Governerate's area  / get all area in all governorate).
------------------------------------------------------------------------------------------------------------
9-<Done> For specialtis : Make routs 
             (Add specialtis / get all specialtis that can get all doctors from it ) 
------------------------------------------------------------------------------------------------------------
10-For Hospital : join with [specialtis_array]  and make routs
            (Add Hospital / get all Hospital /get profile hospital /remove hospital/<BranchesOfOneHospital> )
------------------------------------------------------------------------------------------------------------
11-For Clinic : join with [specialtis_array]  and make routs
            (Add Clinic / get all Clinic /get profile Clinic /remove clinic)
------------------------------------------------------------------------------------------------------------
12-<Done> For BranchesHC : join with [Hospital/Clinic/Area]  and make routs      
             (Add BranshesHC / get all BranchesHC /get One BranshesHC / Remove BranchHC)
------------------------------------------------------------------------------------------------------------
13- For Insurance : join with [InsuranceType] and make routs
             (Add InsuranceType / Add Insurance /get all InsuranceType/Get One insuranceType /get all insurance ) 
------------------------------------------------------------------------------------------------------------
14- For Hc Insurance Values : join with [hospitals/clinics/specilities/insurance] and make routs 
             (Add hc insurance Value / Get all Hc insurance values  / get one insurance value by id(not important) ) 
------------------------------------------------------------------------------------------------------------
15-<Done> For DravailTime : join with [BranchesHC/doctors] and make routs 
             (Add DravailTime / Get all DravailTime /<removeDravailTime >) 
------------------------------------------------------------------------------------------------------------
16-<Done> For Rating : join with [doctors/user] 
   ## 1-(/rate) user can rate when he was login  & can store userId auto in rateSchema <in route users>
   ## 2-(doctors/rate/:id) find the Feedback for specific doctor   <in route doctors>  
   ## 3-get avgRating for [doctors] in drShema code--<in ratingSchema>  
   ## 4-Sort By high average Rating.
------------------------------------------------------------------------------------------------------------
17-<Done> For Payment : join with [users/paymentMethod] 
             (Add PaymentMethod / Add Payment /get all PaymentMethods/Get One Payment /get all payments(for 1 LOGGED IN user)/
             Update Payment /remove Payment/remove PaymentMethod )  
------------------------------------------------------------------------------------------------------------
18-<Done> For Booking : join with [doctors/user/draviltime/xlavailtime/payment] 
   ## 1-(/book) user can book when he login & can store userId auto in bookingSchema <in route booking>
   ## 2-(book/all) get all Booking history done by specific user(who is signed in) <in route booking> 
   ## 3-(book/:id) read details of specific booked appointment for a logged in user <in route booking>
   ## 4-(/book/bookingUpdate/:id) logged in user can update a booked appointment he has done before <in route payment> 
   ## 5-(book/remove/:id) Delete a booked appointment for a logged in user (by id) <in route booking>  
------------------------------------------------------------------------------------------------------------
19-For Search(Filter&Sorting) : Using schema [doctors/BranchHC/DrAvailTime] 
   ## 1-(/search/filter?specialties= &drTitle= &drName=) user can search by specialties & drTitle & drName and sort by rate <in route doctors>
   ## 2-(/search/filter?area= &HospitalName=) user can search by area & HospitalName <in route BranchHC>  
   ## 3-(/search/filter?area= &labName=) user can search by area & LabName <in route BranchXL>
   ## 4-(/search/filter?moneyFrom= &moneyTo= &date=) user can search by range of vezeeta & date <in route drAvailTime> and sort by low vezeeta 
   ## 5-(/search/filter?moneyFrom= &moneyTo= &date=) user can search by range of vezeeta & date <in route XLAvailTime> and sort by low vezeeta
   ## 6-(/search/filter?discountFrom= &discountTo= &specialties= &insurance=) user can search by range of dicount of insurance & specialties &insurance <in route hcInsValue> and sort by high discount
   ## 7-(/search/filter?discountFrom= &discountTo= &type= &insurance=) user can search by range of dicount of insurance & specialties &insurance <in route xlInsValue> and sort by high discount
------------------------------------------------------------------------------------------------------------
20-<Done> For Types : Make routs 
             (Add Type / get all types / Read all labs with specific type / Read all xrays with specific type) 
------------------------------------------------------------------------------------------------------------
21- For Lab : join with [Types_array]  and make routs
            (Add lab / get all labs /get lab profile /remove Lab/<BranchesOfOneLab> )
------------------------------------------------------------------------------------------------------------
22-For XRay : join with [Types_array]  and make routs
            (Add XRay / get all XRay /get profile XRay /remove XRay/<BranchesOfOneXRay>)
------------------------------------------------------------------------------------------------------------
23-<Done> For BranchesXL : join with [Lab/XRay/Area]  and make routs      
             (Add BranchesXL / get all BranchesXL /get One BranchesXL / Remove BranchesXL)
------------------------------------------------------------------------------------------------------------
24- For XL Insurance Values : join with [labs/xrays/types/insurance] and make routs 
             (Add XL insurance Value / Get all XL insurance values  ) 
------------------------------------------------------------------------------------------------------------
25-<Done> For XLavailTime : join with [BranchesXL/labs/xrays/types] and make routs 
             (Add XLavailTime / Get all XLavailTime /<removeXLavailTime >) 
------------------------------------------------------------------------------------------------------------
26-For Diagnosis : join with [doctors/user] 
   ## 1-(/search/users?userEmail= ) doctor must be login and search for user that he booking with him  <in route doctor>
   ## 1-(/diagnosis) doctor can diagnosis when he was login  & can store doctorId auto in DiagnosisSchema <in route doctor>
   ## 2-(doctors/rate/:id) find the Feedback for specific doctor   <in route doctors>  
   ## 3-get avgRating for [doctors] in drShema code--<in ratingSchema>  
   ## 4-Sort By high average Rating.
