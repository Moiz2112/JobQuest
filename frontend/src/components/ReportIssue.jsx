import React, { useState } from 'react'
import { Button } from './ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import apiClient from '@/utils/apiClient'
import { toast } from 'sonner'
import { useSelector } from 'react-redux'

const ReportIssue = () => {
    const { user } = useSelector(store => store.auth);
    const [open, setOpen] = useState(false);
    const [type, setType] = useState('User Report');
    const [severity, setSeverity] = useState('low');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);

    const submit = async () => {
        if (!title || !description) {
            toast.error('Please provide title and description');
            return;
        }
        setLoading(true);
        try {
            const payload = {
                type,
                title,
                severity,
                description,
                reportedBy: {
                    id: user?._id || null,
                    email: user?.email || ''
                }
            };
            await apiClient.post('/reports', payload);
            toast.success('Report submitted successfully');
            setOpen(false);
            setTitle(''); setDescription(''); setSeverity('low'); setType('User Report');
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || 'Failed to submit report');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Button onClick={() => setOpen(true)} className='bg-red-600 hover:bg-red-700'>Report</Button>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className='sm:max-w-lg'>
                    <DialogHeader>
                        <DialogTitle>Report an Issue</DialogTitle>
                    </DialogHeader>
                    <DialogDescription>
                        <div className='space-y-4 mt-2'>
                            <div>
                                <label className='block text-sm font-medium mb-1'>Type</label>
                                <Select onValueChange={(val) => setType(val)} defaultValue={type}>
                                    <SelectTrigger className='w-full'><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value='User Report'>User Report</SelectItem>
                                        <SelectItem value='Job Report'>Job Report</SelectItem>
                                        <SelectItem value='Company Report'>Company Report</SelectItem>
                                        <SelectItem value='Content Report'>Content Report</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <label className='block text-sm font-medium mb-1'>Severity</label>
                                <Select onValueChange={(val) => setSeverity(val)} defaultValue={severity}>
                                    <SelectTrigger className='w-full'><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value='low'>Low</SelectItem>
                                        <SelectItem value='medium'>Medium</SelectItem>
                                        <SelectItem value='high'>High</SelectItem>
                                        <SelectItem value='critical'>Critical</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <label className='block text-sm font-medium mb-1'>Title</label>
                                <Input value={title} onChange={(e)=>setTitle(e.target.value)} placeholder='Short title for the report' />
                            </div>

                            <div>
                                <label className='block text-sm font-medium mb-1'>Description</label>
                                <Textarea value={description} onChange={(e)=>setDescription(e.target.value)} placeholder='Describe the issue in detail' />
                            </div>

                            <div className='text-sm text-gray-500'>Reporting as: {user?.email || 'Anonymous'}</div>
                        </div>
                    </DialogDescription>
                    <DialogFooter>
                        <div className='flex gap-2 justify-end'>
                            <Button variant='outline' onClick={()=>setOpen(false)}>Cancel</Button>
                            <Button onClick={submit} className='bg-red-600 hover:bg-red-700' disabled={loading}>{loading ? 'Submitting...' : 'Submit Report'}</Button>
                        </div>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default ReportIssue
