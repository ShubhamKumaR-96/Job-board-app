import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'


const prisma=new PrismaClient()

export const register=async (req:Request,res:Response)=>{
    try {
        
    const {name,email,password,role}=req.body

    const existingUser=await prisma.user.findUnique({where:{email}})

    if (existingUser){
        res.status(400).json({message:'Email already registered'})
        return
    }

    const hashedPassword=await bcrypt.hash(password,10)

    const user=await prisma.user.create({
        data:{
            name,email,password:hashedPassword,role
        }
    })

    const token=jwt.sign(
        {userId:user.id,role:user.id},
        process.env.JWT_SECRET as string,
        {expiresIn:'7d'}
    )

    res.json({
        message:'Registration Successfully',
        token,
        user:{
            userId:user.id,
            name:user.name,
            email:user.email,
            role:user.role
        }
    })
    } catch (error){
     res.status(500).json({message:'Server error'})
    }
}

export const login=async(req:Request,res:Response)=>{
   try {
    const {email,password}=req.body;

    const user=await prisma.user.findUnique({where:{email}})

    if (!user){
        res.status(400).json({message:"Invalid email or password "})
        return
    }

    const isMatch=await bcrypt.compare(password,user.password)

    if(!isMatch){
        res.status(400).json({message:'Invalid email or password' })
    }

    const token=jwt.sign(
        {userId:user.id,role:user.role},
        process.env.JWT_SECRET as string,
        {expiresIn:"7h"}
    )

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    })
  }catch(error){
    res.status(500).json({ message: 'Server error' })
  }
}