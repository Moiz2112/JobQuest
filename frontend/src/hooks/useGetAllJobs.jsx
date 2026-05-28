import { setAllJobs } from '@/redux/jobSlice'
import { JOB_API_END_POINT } from '@/utils/constant'
import apiClient from '@/utils/apiClient'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

const useGetAllJobs = () => {
    const dispatch = useDispatch();
    useEffect(()=>{
        const fetchAllJobs = async () => {
            try {
                const res = await apiClient.get(`${JOB_API_END_POINT}/get`);
                if(res.data.success){
                    console.log("Jobs fetched from API:", res.data.jobs);
                    dispatch(setAllJobs(res.data.jobs));
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchAllJobs();
    },[dispatch])
}

export default useGetAllJobs