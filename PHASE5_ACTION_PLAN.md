# JobQuest - Phase 5 Action Plan
## Backend Routes & Data Integration

**Estimated Time:** 3-4 hours  
**Priority:** CRITICAL - Unblocks all remaining frontend work  
**Date:** May 7, 2026

---

## STEP 1: Add Missing User Routes (20 minutes)

**File:** `backend/routes/user.route.js`

Replace the entire file with:

```javascript
import express from "express";
import { 
    login, 
    logout, 
    register, 
    updateProfile,
    addEducation,
    addExperience,
    updateResume,
    saveJob,
    unsaveJob,
    getSavedJobs,
    getProfile
} from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { singleUpload } from "../middlewares/mutler.js";
 
const router = express.Router();

// Authentication
router.route("/register").post(singleUpload, register);
router.route("/login").post(login);
router.route("/logout").get(logout);

// Profile Management
router.route("/profile").get(isAuthenticated, getProfile);
router.route("/profile/update").post(isAuthenticated, singleUpload, updateProfile);
router.route("/profile/education").post(isAuthenticated, addEducation);
router.route("/profile/experience").post(isAuthenticated, addExperience);
router.route("/profile/resume").post(isAuthenticated, singleUpload, updateResume);

// Job Saving
router.route("/jobs/save/:jobId").post(isAuthenticated, saveJob);
router.route("/jobs/unsave/:jobId").post(isAuthenticated, unsaveJob);
router.route("/jobs/saved").get(isAuthenticated, getSavedJobs);

export default router;
```

**What Changed:**
- Added import for new controller functions
- Added 7 new routes for profile and job management
- All routes properly protected with `isAuthenticated` middleware

---

## STEP 2: Add Missing Job Routes (20 minutes)

**File:** `backend/routes/job.route.js`

Replace the entire file with:

```javascript
import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { 
    getAdminJobs, 
    getAllJobs, 
    getJobById, 
    postJob,
    updateJob,
    deleteJob,
    getJobApplicants,
    getFeaturedJobs
} from "../controllers/job.controller.js";

const router = express.Router();

// Public/Protected Get Routes
router.route("/get").get(getAllJobs);
router.route("/get/:id").get(getJobById);
router.route("/featured").get(getFeaturedJobs);

// Admin/Recruiter Routes
router.route("/post").post(isAuthenticated, postJob);
router.route("/admin/jobs").get(isAuthenticated, getAdminJobs);
router.route("/:id").put(isAuthenticated, updateJob);
router.route("/:id").delete(isAuthenticated, deleteJob);
router.route("/:id/applicants").get(isAuthenticated, getJobApplicants);

export default router;
```

**What Changed:**
- Added imports for missing functions
- Reorganized routes by type (public, admin, etc)
- Added update, delete, and applicants routes

---

## STEP 3: Add Missing Application Routes (20 minutes)

**File:** `backend/routes/application.route.js`

Replace the entire file with:

```javascript
import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { 
    applyJob, 
    getApplicants, 
    getAppliedJobs, 
    updateStatus,
    scheduleInterview,
    getApplicationById
} from "../controllers/application.controller.js";
 
const router = express.Router();

// Student Routes
router.route("/apply/:id").post(isAuthenticated, applyJob);
router.route("/get").get(isAuthenticated, getAppliedJobs);
router.route("/:id").get(isAuthenticated, getApplicationById);

// Recruiter Routes
router.route("/:id/applicants").get(isAuthenticated, getApplicants);
router.route("/:id/status").put(isAuthenticated, updateStatus);
router.route("/:id/interview").post(isAuthenticated, scheduleInterview);

export default router;
```

**What Changed:**
- Added imports for all application functions
- Fixed HTTP method from GET to POST for apply
- Added interview scheduling route
- Organized by student and recruiter sections

---

## STEP 4: Add Missing Company Routes (20 minutes)

**File:** `backend/routes/company.route.js`

Replace the entire file with:

```javascript
import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { 
    getCompanies, 
    getCompanyById, 
    registerCompany, 
    updateCompany,
    getCompanyStats,
    getAllCompanies
} from "../controllers/company.controller.js";
import { singleUpload } from "../middlewares/mutler.js";

const router = express.Router();

// Public Routes
router.route("/all").get(getAllCompanies);

// Protected Routes
router.route("/register").post(isAuthenticated, registerCompany);
router.route("/get").get(isAuthenticated, getCompanies);
router.route("/get/:id").get(isAuthenticated, getCompanyById);
router.route("/update/:id").put(isAuthenticated, singleUpload, updateCompany);
router.route("/:id/stats").get(isAuthenticated, getCompanyStats);

export default router;
```

**What Changed:**
- Fixed function name from `getCompany` to `getCompanies`
- Added getAllCompanies public route
- Added getCompanyStats route
- Added singleUpload middleware for logo upload

---

## STEP 5: Verify Backend Compiles (5 minutes)

```bash
cd backend
npm run dev
```

**Expected Output:**
```
Server running at port : 3001
mongodb connected successfully
```

**If Error:** Check that all imports match controller function names

---

## STEP 6: Create API Hooks (1 hour)

Create 5 new files in `frontend/src/hooks/`

### 6.1 useGetAllJobs.jsx

```javascript
import { setAllJobs, setSearchedQuery } from '@/redux/jobSlice'
import { JOB_API_END_POINT } from '@/utils/constant'
import axios from 'axios'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const useGetAllJobs = () => {
    const dispatch = useDispatch()
    const { searchedQuery } = useSelector(store => store.job)

    useEffect(() => {
        const fetchAllJobs = async () => {
            try {
                const res = await axios.get(
                    `${JOB_API_END_POINT}/get?keyword=${searchedQuery}`,
                    { withCredentials: true }
                )
                if (res.data.success) {
                    dispatch(setAllJobs(res.data.jobs))
                }
            } catch (error) {
                console.log(error)
            }
        }
        fetchAllJobs()
    }, [searchedQuery, dispatch])
}

export default useGetAllJobs
```

### 6.2 useGetAppliedJobs.jsx

```javascript
import { setAppliedJobs } from '@/redux/jobSlice'
import { APPLICATION_API_END_POINT } from '@/utils/constant'
import axios from 'axios'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

const useGetAppliedJobs = () => {
    const dispatch = useDispatch()

    useEffect(() => {
        const fetchAppliedJobs = async () => {
            try {
                const res = await axios.get(
                    `${APPLICATION_API_END_POINT}/get`,
                    { withCredentials: true }
                )
                if (res.data.success) {
                    dispatch(setAppliedJobs(res.data.applications))
                }
            } catch (error) {
                console.log(error)
            }
        }
        fetchAppliedJobs()
    }, [dispatch])
}

export default useGetAppliedJobs
```

### 6.3 useGetAllCompanies.jsx

```javascript
import { setCompanies } from '@/redux/companySlice'
import { COMPANY_API_END_POINT } from '@/utils/constant'
import axios from 'axios'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

const useGetAllCompanies = () => {
    const dispatch = useDispatch()

    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const res = await axios.get(
                    `${COMPANY_API_END_POINT}/all`,
                    { withCredentials: true }
                )
                if (res.data.success) {
                    dispatch(setCompanies(res.data.companies))
                }
            } catch (error) {
                console.log(error)
            }
        }
        fetchCompanies()
    }, [dispatch])
}

export default useGetAllCompanies
```

### 6.4 useGetAllAdminJobs.jsx

```javascript
import { setAllAdminJobs } from '@/redux/jobSlice'
import { JOB_API_END_POINT } from '@/utils/constant'
import axios from 'axios'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

const useGetAllAdminJobs = () => {
    const dispatch = useDispatch()

    useEffect(() => {
        const fetchAdminJobs = async () => {
            try {
                const res = await axios.get(
                    `${JOB_API_END_POINT}/admin/jobs`,
                    { withCredentials: true }
                )
                if (res.data.success) {
                    dispatch(setAllAdminJobs(res.data.jobs))
                }
            } catch (error) {
                console.log(error)
            }
        }
        fetchAdminJobs()
    }, [dispatch])
}

export default useGetAllAdminJobs
```

### 6.5 useGetCompanyById.jsx

```javascript
import { setSingleCompany } from '@/redux/companySlice'
import { COMPANY_API_END_POINT } from '@/utils/constant'
import axios from 'axios'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

const useGetCompanyById = (companyId) => {
    const dispatch = useDispatch()

    useEffect(() => {
        const fetchCompany = async () => {
            try {
                const res = await axios.get(
                    `${COMPANY_API_END_POINT}/get/${companyId}`,
                    { withCredentials: true }
                )
                if (res.data.success) {
                    dispatch(setSingleCompany(res.data.company))
                }
            } catch (error) {
                console.log(error)
            }
        }
        fetchCompany()
    }, [companyId, dispatch])
}

export default useGetCompanyById
```

---

## STEP 7: Update Redux Slices (30 minutes)

Update `frontend/src/redux/jobSlice.js` to add these actions:

```javascript
setAllJobs: (state, action) => {
    state.allJobs = action.payload
},
setAppliedJobs: (state, action) => {
    state.appliedJobs = action.payload
},
setAllAdminJobs: (state, action) => {
    state.allAdminJobs = action.payload
}
```

Update `frontend/src/redux/companySlice.js` to add:

```javascript
setCompanies: (state, action) => {
    state.companies = action.payload
},
setSingleCompany: (state, action) => {
    state.singleCompany = action.payload
}
```

---

## STEP 8: Verify Everything Works (10 minutes)

1. **Backend running:**
   ```
   npm run dev (in backend folder)
   ```

2. **Frontend running:**
   ```
   npm run dev (in frontend folder)
   ```

3. **Test registration:**
   - Go to http://localhost:5176/signup
   - Fill form and create account

4. **Test login:**
   - Go to http://localhost:5176/login
   - Login with created account

5. **Check console:**
   - No errors should appear
   - Redux state should have user data

---

## CHECKLIST

- [ ] Step 1: User routes updated
- [ ] Step 2: Job routes updated
- [ ] Step 3: Application routes updated
- [ ] Step 4: Company routes updated
- [ ] Step 5: Backend verified
- [ ] Step 6: API hooks created (5 files)
- [ ] Step 7: Redux slices updated
- [ ] Step 8: All services running

---

## TROUBLESHOOTING

### Error: "Cannot find module 'xyz'"
**Solution:** Check import paths and ensure all function names match between routes and controllers

### Error: "Unexpected token }"
**Solution:** Check for missing closing braces or semicolons in route definitions

### 404 on API call
**Solution:** Verify route path matches exactly, including `/api/v1/` prefix

### Authentication failing
**Solution:** Ensure cookies are being sent with `{ withCredentials: true }`

---

## NEXT AFTER THIS PHASE

Once routes and hooks are complete:
1. Wire up Jobs.jsx to show real data
2. Wire up Profile.jsx for profile management
3. Create AdminDashboard.jsx
4. Integrate filtering and search
5. Test complete user flows

**Estimated additional time:** 2-3 hours

---

**You're so close! Complete this phase and your FYP will be 85% done!** 🚀

