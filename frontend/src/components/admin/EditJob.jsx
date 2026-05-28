import React, { useState, useEffect } from 'react'
import Navbar from '../shared/Navbar'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { useSelector } from 'react-redux'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import apiClient from '@/utils/apiClient'
import { JOB_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'
import { useNavigate, useParams } from 'react-router-dom'
import { Loader2, ArrowLeft } from 'lucide-react'
import Footer from '../shared/Footer'

const EditJob = () => {
    const { id } = useParams();
    const [input, setInput] = useState({
        title: "",
        description: "",
        requirements: "",
        salary: { min: "", max: "" },
        location: "",
        jobType: "",
        experienceLevel: "",
        workMode: "",
        category: "",
        industry: "",
        position: 1,
        companyId: ""
    });
    const [loading, setLoading] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    const { companies } = useSelector(store => store.company);

    // Fetch job details on mount
    useEffect(() => {
        const fetchJob = async () => {
            try {
                setIsLoading(true);
                const res = await apiClient.get(`${JOB_API_END_POINT}/get/${id}`);
                if (res.data.success) {
                    const job = res.data.job;
                    setInput({
                        title: job.title || "",
                        description: job.description || "",
                        requirements: Array.isArray(job.requirements) ? job.requirements.join(", ") : job.requirements || "",
                        salary: {
                            min: job.salary?.min || "",
                            max: job.salary?.max || ""
                        },
                        location: job.location || "",
                        jobType: job.jobType || "",
                        experienceLevel: job.experienceLevel || "",
                        workMode: job.workMode || "",
                        category: job.category || "",
                        industry: job.industry || "",
                        position: job.position || 1,
                        companyId: job.company?._id || ""
                    });
                }
            } catch (error) {
                console.log(error);
                toast.error(error.response?.data?.message || "Failed to load job");
                navigate("/admin/jobs");
            } finally {
                setIsLoading(false);
            }
        };
        fetchJob();
    }, [id, navigate]);

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };

    const handleSalaryChange = (e) => {
        const { name, value } = e.target;
        setInput({
            ...input,
            salary: {
                ...input.salary,
                [name]: value ? Number(value) : ""
            }
        });
    };

    const selectChangeHandler = (value) => {
        const selectedCompany = companies.find((company) => company.name.toLowerCase() === value);
        setInput({ ...input, companyId: selectedCompany._id });
    };

    const submitHandler = async (e) => {
        e.preventDefault();

        // Validation check
        if (!input.title.trim() || !input.description.trim() || !input.requirements.trim() ||
            !input.salary.min || !input.salary.max || !input.location.trim() || !input.jobType.trim() ||
            !input.experienceLevel.trim() || !input.workMode.trim() || !input.category.trim() ||
            !input.industry.trim() || !input.position || !input.companyId) {
            toast.error("Please fill in all required fields");
            return;
        }

        if (input.salary.min > input.salary.max) {
            toast.error("Minimum salary cannot be greater than maximum salary");
            return;
        }

        try {
            setLoading(true);
            const res = await apiClient.put(`${JOB_API_END_POINT}/${id}`, input, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (res.data.success) {
                toast.success(res.data.message);
                navigate("/admin/jobs");
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Failed to update job");
        } finally {
            setLoading(false);
        }
    }

    if (isLoading) {
        return (
            <div>
                <Navbar />
                <div className='flex items-center justify-center w-screen pt-24 my-5'>
                    <div className='flex flex-col items-center gap-4'>
                        <Loader2 className='h-8 w-8 animate-spin text-purple-600' />
                        <p className='text-gray-600 font-medium'>Loading job details...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <Navbar />
            <div className='flex items-center justify-center w-screen pt-24 my-5'>
                <form onSubmit={submitHandler} className='p-8 max-w-4xl border border-gray-200 shadow-lg rounded-md w-full mx-4'>
                    <div className='flex items-center gap-3 mb-6'>
                        <button
                            type='button'
                            onClick={() => navigate("/admin/jobs")}
                            className='p-2 hover:bg-gray-100 rounded-lg transition-colors'
                        >
                            <ArrowLeft size={20} className='text-gray-700' />
                        </button>
                        <h1 className='text-2xl font-bold text-gray-800'>Edit Job</h1>
                    </div>

                    <div className='grid grid-cols-2 gap-2'>
                        <div>
                            <Label>Title <span className='text-red-500'>*</span></Label>
                            <Input
                                type="text"
                                name="title"
                                value={input.title}
                                onChange={changeEventHandler}
                                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
                                placeholder="e.g., Senior Developer"
                            />
                        </div>
                        <div>
                            <Label>Description <span className='text-red-500'>*</span></Label>
                            <Input
                                type="text"
                                name="description"
                                value={input.description}
                                onChange={changeEventHandler}
                                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
                                placeholder="Job description"
                            />
                        </div>
                        <div>
                            <Label>Requirements <span className='text-red-500'>*</span></Label>
                            <Input
                                type="text"
                                name="requirements"
                                value={input.requirements}
                                onChange={changeEventHandler}
                                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
                                placeholder="Required skills"
                            />
                        </div>
                        <div>
                            <Label>Salary Min <span className='text-red-500'>*</span></Label>
                            <Input
                                type="number"
                                name="min"
                                value={input.salary.min}
                                onChange={handleSalaryChange}
                                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
                                placeholder="e.g., 1000"
                            />
                        </div>
                        <div>
                            <Label>Salary Max <span className='text-red-500'>*</span></Label>
                            <Input
                                type="number"
                                name="max"
                                value={input.salary.max}
                                onChange={handleSalaryChange}
                                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
                                placeholder="e.g., 5000"
                            />
                        </div>
                        <div>
                            <Label>Location <span className='text-red-500'>*</span></Label>
                            <Select value={input.location} onValueChange={(value) => setInput({ ...input, location: value })}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select Location" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem value="Islamabad">Islamabad</SelectItem>
                                        <SelectItem value="Lahore">Lahore</SelectItem>
                                        <SelectItem value="Karachi">Karachi</SelectItem>
                                        <SelectItem value="Rawalpindi">Rawalpindi</SelectItem>
                                        <SelectItem value="Faisalabad">Faisalabad</SelectItem>
                                        <SelectItem value="Multan">Multan</SelectItem>
                                        <SelectItem value="Peshawar">Peshawar</SelectItem>
                                        <SelectItem value="Quetta">Quetta</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label>Job Type <span className='text-red-500'>*</span></Label>
                            <Select value={input.jobType} onValueChange={(value) => setInput({ ...input, jobType: value })}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select Job Type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem value="Full-time">Full-time</SelectItem>
                                        <SelectItem value="Part-time">Part-time</SelectItem>
                                        <SelectItem value="Contract">Contract</SelectItem>
                                        <SelectItem value="Internship">Internship</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label>Experience Level <span className='text-red-500'>*</span></Label>
                            <Select value={input.experienceLevel} onValueChange={(value) => setInput({ ...input, experienceLevel: value })}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select Experience" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem value="Entry-level">Entry-level</SelectItem>
                                        <SelectItem value="Mid-level">Mid-level</SelectItem>
                                        <SelectItem value="Senior">Senior</SelectItem>
                                        <SelectItem value="Executive">Executive</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label>Work Mode <span className='text-red-500'>*</span></Label>
                            <Select value={input.workMode} onValueChange={(value) => setInput({ ...input, workMode: value })}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select Work Mode" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem value="Remote">Remote</SelectItem>
                                        <SelectItem value="Hybrid">Hybrid</SelectItem>
                                        <SelectItem value="Onsite">Onsite</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label>Category <span className='text-red-500'>*</span></Label>
                            <Input
                                type="text"
                                name="category"
                                value={input.category}
                                onChange={changeEventHandler}
                                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
                                placeholder="e.g., Technology, Sales"
                            />
                        </div>
                        <div>
                            <Label>Industry <span className='text-red-500'>*</span></Label>
                            <Input
                                type="text"
                                name="industry"
                                value={input.industry}
                                onChange={changeEventHandler}
                                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
                                placeholder="e.g., IT, Finance"
                            />
                        </div>
                        <div>
                            <Label>No of Positions <span className='text-red-500'>*</span></Label>
                            <Input
                                type="number"
                                name="position"
                                min="1"
                                value={input.position}
                                onChange={changeEventHandler}
                                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
                            />
                        </div>
                        {
                            companies.length > 0 && (
                                <div>
                                    <Label>Company <span className='text-red-500'>*</span></Label>
                                    <Select value={input.companyId ? companies.find(c => c._id === input.companyId)?.name?.toLowerCase() : ""} onValueChange={selectChangeHandler}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select a Company" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                {
                                                    companies.map((company) => {
                                                        return (
                                                            <SelectItem key={company._id} value={company?.name?.toLowerCase()}>{company.name}</SelectItem>
                                                        )
                                                    })
                                                }

                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>
                            )
                        }
                    </div>
                    <div className='flex gap-3 mt-6'>
                        {
                            loading ? <Button className="flex-1"> <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Updating... </Button> : <Button type="submit" className="flex-1">Update Job</Button>
                        }
                        <Button type="button" variant="outline" onClick={() => navigate("/admin/jobs")} className="flex-1">Cancel</Button>
                    </div>
                </form>
            </div>
            <Footer />
        </div>
    )
}

export default EditJob
