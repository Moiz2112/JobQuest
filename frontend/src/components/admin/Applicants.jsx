import React, { useEffect } from 'react'
import Navbar from '../shared/Navbar'
import ApplicantsTable from './ApplicantsTable'
import apiClient from '@/utils/apiClient';
import { APPLICATION_API_END_POINT } from '@/utils/constant';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setAllApplicants } from '@/redux/applicationSlice';
import Footer from '../shared/Footer';
import { toast } from 'sonner';

const Applicants = () => {
    const params = useParams();
    const dispatch = useDispatch();
    const {applicants} = useSelector(store=>store.application);

    useEffect(() => {
        const fetchAllApplicants = async () => {
            try {
                const res = await apiClient.get(`${APPLICATION_API_END_POINT}/${params.id}/applicants`);
                dispatch(setAllApplicants(res.data.applications));
            } catch (error) {
                console.log(error);
                toast.error("Failed to load applicants");
            }
        }
        fetchAllApplicants();
    }, [params.id, dispatch]);
    return (
        <div>
            <Navbar />
            <div className='max-w-7xl mx-auto pt-24 px-4 sm:px-6 lg:px-8'>
                <h1 className='font-bold text-xl my-5'>Applicants ({applicants?.length || 0})</h1>
                <ApplicantsTable />
            </div>
            <Footer />
        </div>
    )
}

export default Applicants