import { PrismaClient } from "@prisma/client";
import { AuthRequest } from "../middleware/auth.middleware";
import { application, Response } from "express";


const prisma=new PrismaClient()

export const applyJob=async(req:AuthRequest,res:Response)=>{

    try {
        if(req.user?.role !== 'SEEKER'){
        res.status(403).json({message:"Only seekers can apply the job"})
        return
    }

    const jobId=Number(req.params.jobId)

    if(!jobId){
        res.status(404).json({message:"Job ID not found"})
        return
    }

    const existing = await prisma.application.findFirst({
      where: { jobId, applicantId: req.user.userId }
    })

    if(existing){
      res.status(400).json({message:"Already applied to the Job"})
    }

    const application=await prisma.application.create({data:{jobId,applicantId:req.user.userId}})

    res.status(201).json({ message: 'Applied successfully', application })

    } catch (error) {
        console.log("Error while applying the job",error)
        res.status(500).json({message:'Server error'})

    }

}

export const myApplication=async(req:AuthRequest,res:Response)=>{
   
    try {
        const application=await prisma.application.findMany({where:{applicantId:req.user?.userId},include:{job:{select:{title:true,company:true,location:true,salary:true}}},orderBy:{createdAt:'desc'}})

        res.json(application)
    } catch (error) {
        console.log("Error while creating application",error)
        res.status(500).json({message:'Server error'})
    }

}

export const jobApplication=async(req:AuthRequest,res:Response)=>{

    try {
        if(req.user?.role !== 'RECRUITER'){
        res.status(403).json({message:'Only recuriter can view the application'})
        return
    }

    const applications=await prisma.application.findMany({where:{jobId:Number(req.params.id)},include:{applicant:{select:{name:true,email:true}}},orderBy:{createdAt:'desc'}})

    res.json(applications)
    } catch (error) {
        console.log("Error while jobApplication",application)
        res.status(500).json({message:'Server error'})

    }

}

export const updateApplicationStatus = async (req: AuthRequest, res: Response) => {
  try {
    if (req.user?.role !== 'RECRUITER') {
      res.status(403).json({ message: 'Only recruiters can update status' })
      return
    }

    const { status } = req.body

    if (!['PENDING', 'ACCEPTED', 'REJECTED'].includes(status)) {
      res.status(400).json({ message: 'Invalid status' })
      return
    }

    const application = await prisma.application.update({
      where: { id: Number(req.params.id) },
      data: { status }
    })

    res.json({ message: 'Status updated', application })

  } catch (error) {
    console.log("Error while updating application")
    res.status(500).json({ message: 'Server error' })
  }
}