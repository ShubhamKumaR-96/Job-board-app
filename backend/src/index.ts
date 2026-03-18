import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import authRoutes from './routes/auth.route'
import jobRoutes from './routes/job.routes'
import applicationRoute from './routes/application.route'


const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

app.use('/api/auth',authRoutes)
app.use('/api/jobs',jobRoutes)
app.use('/api/applications',applicationRoute)

app.get('/', (req, res) => {
  res.json({ message: 'Job Board API is running!' })
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})