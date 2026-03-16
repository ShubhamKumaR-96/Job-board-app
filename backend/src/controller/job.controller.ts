import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import { PrismaClient } from "@prisma/client";

const prisma=new PrismaClient()

export const createJob=async(req:AuthRequest,res:Response)=>{
   
    try {
    const {title,company,location,salary,description}=req.body;

    if (req.user?.role !== 'RECRUITER'){
        res.status(400).json({message:"Only recuriter can post the job"})
        return
    }

    const job=await prisma.job.create({
        data :
        {
            title,company,location,salary,description,postedById:req.user?.userId
        }
    })

    res.status(201).json({message:"Job created successfully",job})

   } catch(error) {
    console.log("Error",error)
     res.status(500).json({message:"Server error"})
   }   
}

export const getAllJobs=async(req:AuthRequest,res:Response)=>{

    try {
        const jobs=await prisma.job.findMany({
            include:{
                postedBy:{
                    select:{name:true,email:true}
                }
            },
            orderBy:{createdAt:'desc'}
        })
        res.status(200).json(jobs)
    } catch (error) {
          console.log("Error",error)
        res.status(500).json({ message: 'Server error' })
    }

}

export const getJobById=async(req:AuthRequest,res:Response)=>{
    try {
        const job=await prisma.job.findUnique({
            where:{id:Number(req.params.id)},
            include:{
                postedBy:{
                    select:{name:true,email:true}
                }
            }

        })

        if(!job){
            res.status(404).json({message:"Job not found"})
            return
        }

        res.json(job)

    } catch (error) {
        res.status(500).json({ message: 'Server error' })
    }
}

export const updateJob=async(req:AuthRequest,res:Response)=>{
 
    try {
    const {title,company,location,salary,description}=req.body;

    const job=await prisma.job.findUnique(
        {where:{id:Number(req.params.id)}}
    )
    if(!job){
        res.status(404).json({message:"Job Id not found"})
        return
    }

    if(job?.postedById !== req.user?.userId){
        res.status(403).json({message:"Not authrozied"})
        return
    }

    const updatedJob=await prisma.job.update({
        where:{id:Number(req.params.id)},
        data:{title,company,location,salary,description}
    })

    res.json({ message: 'Job updated', job: updatedJob })

   }catch(error){
      console.log("Error",error)
     res.status(500).json({ message: 'Server error' })
  }

}

export const deleteJobById=async(req:AuthRequest,res:Response)=>{
    try {
        const job=await prisma.job.findUnique({
            where:{id:Number(req.params.id)}
        })

        if(!job){
            res.status(404).json({message:"Not found job"})
            return
        }

        if(job?.postedById !== req.user?.userId){
            res.status(403).json({message:"Not authorized"})
            return
        }

        const deletedJob=await prisma.job.delete({
            where:{id:Number(req.params.id)}
        })
        res.json({message:"job deleted",deletedJob})

    } catch (error) {
        res.status(500).json({ message: 'Server error' })
    }
}